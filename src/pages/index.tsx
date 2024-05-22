import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { useEffect, useState } from 'react';
import PrefectureCheckBoxes from '../components/PrefectureCheckBoxes/PrefectureCheckBoxes';
import styles from './index.module.css';

const resasAxiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://opendata.resas-portal.go.jp',
  headers: {
    'X-API-KEY': process.env.NEXT_PUBLIC_RESAS_API_KEY,
  },
});

const Home = () => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);

  const handlePrefectureCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setPrefectures(
      prefectures.map((prefecture) =>
        prefecture.prefName === name ? { ...prefecture, isChecked: checked } : prefecture,
      ),
    );
  };

      }
      return prefecture;
    });
    setPrefectures(newPrefectures);
  };

  const fetchPrefectures = async () => {
    const prefecturesEndpoint = '/api/v1/prefectures';

    try {
      const response = await resasAxiosInstance.get<PrefecturesAPIResponse>(prefecturesEndpoint);
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
