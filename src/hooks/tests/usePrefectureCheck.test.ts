import { renderHook, waitFor } from '@testing-library/react';
import type { AllPopulationData } from '../../types/PopulationTypes';
import type { PrefectureWithCheck } from '../../types/PrefectureTypes';
import { usePrefectureCheck } from '../usePrefectureCheck';

const mockPrefecturesWithCheck: PrefectureWithCheck[] = [
  { prefCode: 1, prefName: '北海道', isChecked: false },
  { prefCode: 2, prefName: '青森県', isChecked: false },
];

const mockAllPopulationData: AllPopulationData = {
  boundaryYear: 0,
  total: [],
  juvenile: [],
  workingAge: [],
  elderly: [],
};

const mockUpdatePopulationData = jest.fn();

describe('usePrefectureCheck', () => {
  beforeEach(() => {
    mockUpdatePopulationData.mockReset();
  });

  test('should initialize with given prefecturesWithCheck', () => {
    const { result } = renderHook(() =>
      usePrefectureCheck(mockPrefecturesWithCheck, mockAllPopulationData, mockUpdatePopulationData),
    );

    expect(result.current.prefecturesWithCheck).toEqual(mockPrefecturesWithCheck);
  });

  test('should update isChecked of the prefecture when handlePrefectureCheckbox is called', async () => {
    const { result } = renderHook(() =>
      usePrefectureCheck(mockPrefecturesWithCheck, mockAllPopulationData, mockUpdatePopulationData),
    );

    const event = {
      target: { name: '北海道', checked: true },
    } as React.ChangeEvent<HTMLInputElement>;

    await waitFor(() => {
      result.current.handlePrefectureCheckbox(event);
    });

    expect(result.current.prefecturesWithCheck).toEqual([
      { prefCode: 1, prefName: '北海道', isChecked: true },
      { prefCode: 2, prefName: '青森県', isChecked: false },
    ]);
  });

  test('should call updatePopulationData if the prefecture is checked and not fetched', async () => {
    const { result } = renderHook(() =>
      usePrefectureCheck(mockPrefecturesWithCheck, mockAllPopulationData, mockUpdatePopulationData),
    );

    const event = {
      target: { name: '北海道', checked: true },
    } as React.ChangeEvent<HTMLInputElement>;

    await waitFor(() => {
      result.current.handlePrefectureCheckbox(event);
    });

    expect(mockUpdatePopulationData).toHaveBeenCalledWith(1, '北海道');
  });

  test('should not call updatePopulationData if the prefecture is checked and already fetched', async () => {
    const updatedPopulationData: AllPopulationData = {
      ...mockAllPopulationData,
      total: [{ prefCode: 1, prefName: '北海道', data: [{ year: 2020, value: 1000 }] }],
    };

    const { result } = renderHook(() =>
      usePrefectureCheck(mockPrefecturesWithCheck, updatedPopulationData, mockUpdatePopulationData),
    );

    const event = {
      target: { name: '北海道', checked: true },
    } as React.ChangeEvent<HTMLInputElement>;

    await waitFor(() => {
      result.current.handlePrefectureCheckbox(event);
    });

    expect(mockUpdatePopulationData).not.toHaveBeenCalled();
  });

  test('should reset all checkboxes when resetCheckBoxes is called', async () => {
    const { result } = renderHook(() =>
      usePrefectureCheck(mockPrefecturesWithCheck, mockAllPopulationData, mockUpdatePopulationData),
    );

    await waitFor(() => {
      result.current.resetCheckBoxes();
    });

    expect(result.current.prefecturesWithCheck).toEqual([
      { prefCode: 1, prefName: '北海道', isChecked: false },
      { prefCode: 2, prefName: '青森県', isChecked: false },
    ]);
  });
});
