import axios from 'axios';
import type { PopulationAPIResponse } from '../../types/PopulationTypes';
import { fetchPopulationData } from '../fetchPopulationData';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchPopulationData', () => {
  const mockResponse: PopulationAPIResponse = {
    message: null,
    result: {
      boundaryYear: 2020,
      data: [
        {
          label: 'total',
          data: [
            { year: 1960, value: 5039206 },
            { year: 1965, value: 5171800 },
          ],
        },
        {
          label: 'juvenile',
          data: [
            { year: 1960, value: 1340942 },
            { year: 1965, value: 1456141 },
          ],
        },
        {
          label: 'workingAge',
          data: [
            { year: 1960, value: 2987190 },
            { year: 1965, value: 3072280 },
          ],
        },
        {
          label: 'elderly',
          data: [
            { year: 1960, value: 711074 },
            { year: 1965, value: 744679 },
          ],
        },
      ],
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('returns population data when API call is successful', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const result = await fetchPopulationData(1, '北海道');

    expect(result).toEqual({
      boundaryYear: 2020,
      total: {
        prefCode: 1,
        prefName: '北海道',
        data: mockResponse.result.data[0].data,
      },
      juvenile: {
        prefCode: 1,
        prefName: '北海道',
        data: mockResponse.result.data[1].data,
      },
      workingAge: {
        prefCode: 1,
        prefName: '北海道',
        data: mockResponse.result.data[2].data,
      },
      elderly: {
        prefCode: 1,
        prefName: '北海道',
        data: mockResponse.result.data[3].data,
      },
    });
  });

  test('returns null when API call fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API error'));

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await fetchPopulationData(1, '北海道');

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

    await fetchPopulationData(1, '北海道');

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

    await fetchPopulationData(1, '北海道');

    expect(consoleErrorSpy).toHaveBeenCalledWith(unknownError);

    consoleErrorSpy.mockRestore();
  });
});
