import type { FC } from 'react';
import type { EnPopulationLabelType, MultilingualPopulationLabels } from '../../types';

type PopulationLabelSelectProps = {
  selectedLabel: EnPopulationLabelType;
  handlePopulationLabelChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

const multilingualPopulationLabels: MultilingualPopulationLabels = [
  ['total', 'juvenile', 'workingAge', 'elderly'],
  ['総人口', '年少人口', '生産年齢人口', '老年人口'],
];

const PopulationLabelSelector: FC<PopulationLabelSelectProps> = ({
  selectedLabel,
  handlePopulationLabelChange,
}) => {
  return (
    <select onChange={handlePopulationLabelChange} value={selectedLabel}>
      {multilingualPopulationLabels[0].map((label, index) => (
        <option key={label} value={label}>
          {multilingualPopulationLabels[1][index]}
        </option>
      ))}
    </select>
  );
};

export default PopulationLabelSelector;
