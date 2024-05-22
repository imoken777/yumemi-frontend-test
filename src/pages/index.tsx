import axios from 'axios';
import { useEffect, useState } from 'react';
import PrefectureCheckBoxes from '../components/PrefectureCheckBoxes/PrefectureCheckBoxes';
import styles from './index.module.css';

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
      <PrefectureCheckBoxes
        prefectures={prefectures}
        handlePrefectureCheckbox={handlePrefectureCheckbox}
      />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
