import { renderHook, waitFor } from '@testing-library/react';
import { fetchPopulationData } from '../../lib/fetchPopulationData';
import type { PopulationData } from '../../types/PopulationTypes';
import { usePopulationData } from '../usePopulationData';

jest.mock('../../lib/fetchPopulationData');

describe('usePopulationData', () => {
  const mockFetchPopulationData = fetchPopulationData as jest.MockedFunction<
    typeof fetchPopulationData
  >;

  beforeEach(() => {
    mockFetchPopulationData.mockReset();
  });

  test('should initialize with default population data', () => {
    const { result } = renderHook(() => usePopulationData());
    expect(result.current.allPopulationData).toEqual({
      boundaryYear: 0,
      total: [],
      juvenile: [],
      workingAge: [],
      elderly: [],
    });
  });

  test('should update population data when updatePopulationData is called', async () => {
    const newPopulationData: {
      boundaryYear: number;
      total: PopulationData;
      juvenile: PopulationData;
      workingAge: PopulationData;
      elderly: PopulationData;
    } | null = {
      boundaryYear: 2023,
      total: { prefCode: 1, prefName: '北海道', data: [{ year: 2020, value: 1000 }] },
      juvenile: { prefCode: 1, prefName: '北海道', data: [{ year: 2020, value: 200 }] },
      workingAge: { prefCode: 1, prefName: '北海道', data: [{ year: 2020, value: 600 }] },
      elderly: { prefCode: 1, prefName: '北海道', data: [{ year: 2020, value: 200 }] },
    };

    mockFetchPopulationData.mockResolvedValue(newPopulationData);

    const { result } = renderHook(() => usePopulationData());

    await waitFor(() => {
      result.current.updatePopulationData(1, '北海道');
    });

    expect(result.current.allPopulationData).toEqual({
      boundaryYear: 2023,
      total: [newPopulationData.total],
      juvenile: [newPopulationData.juvenile],
      workingAge: [newPopulationData.workingAge],
      elderly: [newPopulationData.elderly],
    });
  });

  test('should handle errors when fetchPopulationData fails', async () => {
    console.error = jest.fn();
    mockFetchPopulationData.mockResolvedValue(null);

    const { result } = renderHook(() => usePopulationData());

    await waitFor(() => {
      result.current.updatePopulationData(1, '北海道');
    });

    expect(console.error).toHaveBeenCalledWith('Failed to fetch population data');
  });
});
