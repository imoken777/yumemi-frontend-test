import type { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import { z } from 'zod';
import { withZod } from '../withZod';

const querySchema = z
  .object({
    prefCode: z.string(),
    cityCode: z.string(),
  })
  .strict();

const handler = withZod(
  z.object({
    query: querySchema,
  }),
  async (
    req: Omit<NextApiRequest, 'query'> & { query: z.infer<typeof querySchema> },
    res: NextApiResponse,
  ) => {
    res.status(200).json({ message: 'Success', data: req.query });
  },
);

describe('withZod middleware', () => {
  test('returns 200 if the request is valid', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        prefCode: '01',
        cityCode: '001',
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: 'Success',
      data: { prefCode: '01', cityCode: '001' },
    });
  });

  test('returns 400 if the request has missing required fields', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        // Missing prefCode field
        cityCode: '001',
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: 'Bad Request',
      issues: expect.any(Object),
    });
  });

  test('returns 400 if the request has invalid data types', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        prefCode: 1, // Invalid data type
        cityCode: '001',
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: 'Bad Request',
      issues: expect.any(Object),
    });
  });

  test('returns 400 if the request has extra fields', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        prefCode: '01',
        cityCode: '001',
        extraField: 'extra', // Extra field
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: 'Bad Request',
      issues: expect.any(Object),
    });
  });

  test('returns 400 if the request has invalid schema', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      // Invalid request body
      body: {
        prefCode: '01',
        cityCode: '001',
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: 'Bad Request',
      issues: expect.any(Object),
    });
  });
});
