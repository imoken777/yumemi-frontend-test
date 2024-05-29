import type { FC } from 'react';
import type {
  EnPopulationLabelType,
  MultilingualPopulationLabels,
} from '../../types/PopulationTypes';
import styles from './PopulationLabelSelector.module.css';

type PopulationLabelSelectProps = {
  selectedLabel: EnPopulationLabelType;
  multilingualPopulationLabels: MultilingualPopulationLabels;
  handlePopulationLabelChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

const PopulationLabelSelector: FC<PopulationLabelSelectProps> = ({
  selectedLabel,
  multilingualPopulationLabels,
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
