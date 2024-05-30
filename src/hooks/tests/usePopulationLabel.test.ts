import { renderHook, waitFor } from '@testing-library/react';
import { usePopulationLabel } from '../usePopulationLabel';

describe('usePopulationLabel', () => {
  test('should initialize with default label "total"', () => {
    const { result } = renderHook(() => usePopulationLabel());
    expect(result.current.selectedLabel).toBe('total');
  });

  test('should update selectedLabel when handlePopulationLabelChange is called with a valid label', async () => {
    const { result } = renderHook(() => usePopulationLabel());

    const event = {
      target: { value: 'juvenile' },
    } as React.ChangeEvent<HTMLSelectElement>;

    await waitFor(() => {
      result.current.handlePopulationLabelChange(event);
    });

    expect(result.current.selectedLabel).toBe('juvenile');
  });

  test('should not update selectedLabel when handlePopulationLabelChange is called with an invalid label', async () => {
    const { result } = renderHook(() => usePopulationLabel());

    const event = {
      target: { value: 'invalidLabel' },
    } as React.ChangeEvent<HTMLSelectElement>;

    await waitFor(() => {
      result.current.handlePopulationLabelChange(event);
    });

    expect(result.current.selectedLabel).toBe('total');
  });

  test('should return multilingualPopulationLabels', () => {
    const { result } = renderHook(() => usePopulationLabel());
    expect(result.current.multilingualPopulationLabels).toEqual([
      ['total', 'juvenile', 'workingAge', 'elderly'],
      ['総人口', '年少人口', '生産年齢人口', '老年人口'],
    ]);
  });
});
