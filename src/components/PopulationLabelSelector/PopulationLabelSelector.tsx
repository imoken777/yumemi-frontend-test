import type { FC } from 'react';
import type { EnPopulationLabelType, MultilingualPopulationLabels } from '../../types';
import styles from './PopulationLabelSelector.module.css';

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
    <div className={styles.selectContainer}>
      <select
        onChange={handlePopulationLabelChange}
        value={selectedLabel}
        className={styles.select}
        title="Select population label"
      >
        {multilingualPopulationLabels[0].map((label, index) => (
          <option key={label} value={label} className={styles.selectOption}>
            {multilingualPopulationLabels[1][index]}
          </option>
        ))}
      </select>
      <div className={styles.selectIcon}>▼</div>
    </div>
  );
};

export default PopulationLabelSelector;
