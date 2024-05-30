import axios from 'axios';
import type { PrefecturesAPIResponse } from '../../types/PrefectureTypes';
import { fetchPrefectureData } from '../fetchPrefectureData';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchPrefectureData', () => {
  const mockResponse: PrefecturesAPIResponse = {
    message: null,
    result: [
      { prefCode: 1, prefName: '北海道' },
      { prefCode: 2, prefName: '青森県' },
    ],
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('returns prefecture data when API call is successful', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const result = await fetchPrefectureData();

    expect(result).toEqual([
      { prefCode: 1, prefName: '北海道', isChecked: false },
      { prefCode: 2, prefName: '青森県', isChecked: false },
    ]);
  });

  test('returns null when API call is unsuccessful', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockedAxios.get.mockRejectedValueOnce(new Error('API call failed'));

    const result = await fetchPrefectureData();

    expect(result).toBeNull();

    consoleErrorSpy.mockRestore();
  });

  test('returns null when API call fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedAxios.get.mockRejectedValueOnce(new Error('API error'));

    const result = await fetchPrefectureData();

    expect(result).toBeNull();

    consoleErrorSpy.mockRestore();
  });

  test('logs error details when API call fails with axios error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const axiosError = {
      isAxiosError: true,
      response: { data: 'Error response data' },
    };
    mockedAxios.get.mockRejectedValueOnce(axiosError);

    await fetchPrefectureData();

    expect(consoleErrorSpy).toHaveBeenCalledWith({
      isAxiosError: true,
      response: { data: 'Error response data' },
    });

    consoleErrorSpy.mockRestore();
  });

  test('logs error when API call fails with unknown error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const unknownError = new Error('Unknown error');
    mockedAxios.get.mockRejectedValueOnce(unknownError);

    await fetchPrefectureData();

    expect(consoleErrorSpy).toHaveBeenCalledWith(unknownError);

    consoleErrorSpy.mockRestore();
  });
});
