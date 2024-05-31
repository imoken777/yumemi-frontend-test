/**
 * @jest-environment node
 */

import { testApiHandler } from 'next-test-api-route-handler';
import { resasAxiosInstance } from '../../lib/resasAxiosInstance';
import handler from '../../pages/api/prefectures';
import type { ErrorAPIResponse } from '../../types/ErrorTypes';
import type { PrefecturesAPIResponse } from '../../types/PrefectureTypes';

jest.mock('../../lib/resasAxiosInstance');

describe('API Route: /api/prefectures', () => {
  test('should return prefectures data on GET request', async () => {
    const mockData: PrefecturesAPIResponse = {
      message: null,
      result: [{ prefCode: 1, prefName: '北海道' }],
    };
    (resasAxiosInstance.get as jest.Mock).mockResolvedValue({ data: mockData });

    await testApiHandler<PrefecturesAPIResponse>({
      pagesHandler: handler,
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
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET' });
        const data = await res.json();
        expect(res.status).toBe(500);
        expect(data).toEqual({ message: 'Internal Server Error' });
      },
    });

    consoleErrorSpy.mockRestore();
  });
});
