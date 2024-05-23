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
            <div key={prefecture.prefCode}>
              <label>
                <input
                  type="checkbox"
                  name={prefecture.prefName}
                  onChange={handlePrefectureCheckbox}
                />
                {prefecture.prefName}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrefectureCheckBoxes;
