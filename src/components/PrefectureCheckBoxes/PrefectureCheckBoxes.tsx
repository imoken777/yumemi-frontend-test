import type { FC } from 'react';
import type { PrefectureWithCheck } from '../../types';
import styles from './PrefectureCheckBoxes.module.css';

type PrefectureCheckBoxesProps = {
  prefectures: PrefectureWithCheck[];
  handlePrefectureCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const PrefectureCheckBoxes: FC<PrefectureCheckBoxesProps> = ({
  prefectures,
  handlePrefectureCheckbox,
}) => {
  return (
    <div>
      {prefectures.length > 0 && (
        <div className={styles.prefecturesContainer}>
          {prefectures.map((prefecture) => (
            <div key={prefecture.prefCode} className={styles.checkboxItem}>
              <input
                id={`checkbox-${prefecture.prefCode}`}
                type="checkbox"
                name={prefecture.prefName}
                onChange={handlePrefectureCheckbox}
                checked={prefecture.isChecked}
              />
              <label htmlFor={`checkbox-${prefecture.prefCode}`}>{prefecture.prefName}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrefectureCheckBoxes;
