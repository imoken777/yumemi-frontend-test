import axios from 'axios';
import styles from './index.module.css';
import type { Prefecture, PrefecturesAPIResponse } from '../types';
import { useEffect, useState } from 'react';

const Home = () => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);

  const handlePrefectureCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    const newPrefectures = prefectures.map((prefecture) => {
      if (prefecture.prefName === name) {
        return { ...prefecture, isChecked: checked };
      }
      return prefecture;
    });
    setPrefectures(newPrefectures);
  };

  const fetchPrefectures = async () => {
    const url = 'https://opendata.resas-portal.go.jp/api/v1/prefectures';
    const headers = {
      'X-API-KEY': process.env.NEXT_PUBLIC_RESAS_API_KEY,
    };

    try {
      const response = await axios.get<PrefecturesAPIResponse>(url, { headers });
      const prefData: Prefecture[] = response.data.result.map((pref) => ({
        prefCode: pref.prefCode,
        prefName: pref.prefName,
        isChecked: false,
      }));
      setPrefectures(prefData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPrefectures();
  }, []);
  return (
    <div className={styles.container}>
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

      <h1>checked Items</h1>
      <ul>
        {prefectures
          .filter((prefecture) => prefecture.isChecked)
          .map((prefecture) => (
            <li key={prefecture.prefCode}>{prefecture.prefName}</li>
          ))}
      </ul>
    </div>
  );
};

export default Home;
