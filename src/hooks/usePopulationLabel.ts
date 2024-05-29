import { useState } from 'react';
import type { EnPopulationLabelType, MultilingualPopulationLabels } from '../types';

const multilingualPopulationLabels: MultilingualPopulationLabels = [
  ['total', 'juvenile', 'workingAge', 'elderly'],
  ['総人口', '年少人口', '生産年齢人口', '老年人口'],
];

export const usePopulationLabel = () => {
  const [selectedLabel, setSelectedLabel] = useState<EnPopulationLabelType>('total');

  const handlePopulationLabelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const matchingLabel = multilingualPopulationLabels[0].find((label) => label === value);
    if (matchingLabel === undefined) return;
    setSelectedLabel(matchingLabel);
  };

  return { selectedLabel, handlePopulationLabelChange, multilingualPopulationLabels };
};
