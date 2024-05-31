/**
 * @jest-environment node
 */

import { testApiHandler } from 'next-test-api-route-handler';
import { resasAxiosInstance } from '../../lib/resasAxiosInstance';
import handler from '../../pages/api/populationData';
import type { ErrorAPIResponse } from '../../types/ErrorTypes';
import type { PopulationAPIResponse } from '../../types/PopulationTypes';

jest.mock('../../lib/resasAxiosInstance');

describe('API Route: /api/population', () => {
  test('should return population data on valid GET request', async () => {
    const mockData: PopulationAPIResponse = {
      message: null,
      result: {
        boundaryYear: 2020,
        data: [
          {
            label: 'total',
            data: [
              { year: 1960, value: 123456 },
              { year: 1970, value: 234567 },
            ],
          },
          {
            label: 'juvenile',
            data: [
              { year: 1960, value: 12345 },
              { year: 1970, value: 23456 },
            ],
          },
          {
            label: 'workingAge',
            data: [
              { year: 1960, value: 1234 },
              { year: 1970, value: 2345 },
            ],
          },
          {
            label: 'elderly',
            data: [
              { year: 1960, value: 123 },
              { year: 1970, value: 234 },
            ],
          },
        ],
      },
    };
    (resasAxiosInstance.get as jest.Mock).mockResolvedValue({ data: mockData });

    await testApiHandler<PopulationAPIResponse>({
      pagesHandler: handler,
      paramsPatcher: (params) => {
        params.prefCode = '1';
        params.cityCode = '-';
      },
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET' });
        const data = await res.json();
        expect(res.status).toBe(200);
        expect(data).toEqual(mockData);
      },
    });
  });

  test('should return 405 for non-GET requests', async () => {
    await testApiHandler<ErrorAPIResponse>({
      pagesHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'POST' });
        const data = await res.json();
        expect(res.status).toBe(405);
        expect(data).toEqual({ message: 'Method Not Allowed' });
      },
    });
  });

  test('should return 500 on internal server error', async () => {
    (resasAxiosInstance.get as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await testApiHandler<ErrorAPIResponse>({
      pagesHandler: handler,
      paramsPatcher: (params) => {
        params.prefCode = '1';
        params.cityCode = '-';
      },
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET' });
        const data = await res.json();
        expect(res.status).toBe(500);
        expect(data).toEqual({ message: 'Internal Server Error' });
      },
    });

    consoleErrorSpy.mockRestore();
  });

  test('should return 400 for invalid query parameters', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await testApiHandler<ErrorAPIResponse>({
      pagesHandler: handler,
      test: async ({ fetch }) => {
        // Missing query parameters
        const res = await fetch({ method: 'GET' });
        const data = await res.json();
        expect(res.status).toBe(400);
        expect(data).toEqual(expect.objectContaining({ message: expect.any(String) }));
      },
    });

    consoleErrorSpy.mockRestore();
  });
});
