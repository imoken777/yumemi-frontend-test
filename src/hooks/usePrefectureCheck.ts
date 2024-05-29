import { useState } from 'react';
import type { AllPopulationData, PrefectureWithCheck } from '../types';

export const usePrefectureCheck = (
  initialPrefecturesWithCheck: PrefectureWithCheck[],
  allPopulationData: AllPopulationData,
  updatePopulationData: (prefCode: number, prefName: string) => Promise<void>,
) => {
  const [prefecturesWithCheck, setPrefecturesWithCheck] = useState<PrefectureWithCheck[]>(
    initialPrefecturesWithCheck,
  );

  const handlePrefectureCheckbox = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    const updatedPrefectures = prefecturesWithCheck.map((prefecture) =>
      prefecture.prefName === name ? { ...prefecture, isChecked: checked } : prefecture,
    );
    setPrefecturesWithCheck(updatedPrefectures);

    if (checked) {
      const selectedPrefecture = updatedPrefectures.find(
        (prefecture) => prefecture.prefName === name,
      );

      const notFetchedPrefectures = !allPopulationData.total.some(
        (data) => data.prefCode === selectedPrefecture?.prefCode,
      );

      if (selectedPrefecture && notFetchedPrefectures) {
        await updatePopulationData(selectedPrefecture.prefCode, selectedPrefecture.prefName);
      }
    }
  };

  const resetCheckBoxes = () => {
    const updatedPrefectures = prefecturesWithCheck.map((prefecture) => ({
      ...prefecture,
      isChecked: false,
    }));
    setPrefecturesWithCheck(updatedPrefectures);
  };

  return { prefecturesWithCheck, handlePrefectureCheckbox, resetCheckBoxes };
};
