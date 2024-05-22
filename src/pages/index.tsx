import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import PrefectureCheckBoxes from '../components/PrefectureCheckBoxes/PrefectureCheckBoxes';
import type {
  AllPopulationData,
  PopulationAPIResponse,
  Prefecture,
  PrefecturesAPIResponse,
} from '../types';
import styles from './index.module.css';

const resasAxiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://opendata.resas-portal.go.jp',
  headers: {
    'X-API-KEY': process.env.NEXT_PUBLIC_RESAS_API_KEY,
  },
});

const Home = () => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [allPopulationData, setAllPopulationData] = useState<AllPopulationData[]>([]);

  const handlePrefectureCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setPrefectures(
      prefectures.map((prefecture) =>
        prefecture.prefName === name ? { ...prefecture, isChecked: checked } : prefecture,
      ),
    );
  };

  const getCheckedPrefecturesPopulationData = useCallback(() => {
    const fetchPopulationData = async (prefCode: number, prefName: string) => {
      const populationEndPoint = '/api/v1/population/composition/perYear';
      const parameters = {
        prefCode,
        cityCode: '-',
      };

      try {
        const response = await resasAxiosInstance.get<PopulationAPIResponse>(populationEndPoint, {
          params: parameters,
        });
        const populationData: AllPopulationData = {
          prefCode: parameters.prefCode,
          prefName: prefName ?? '',
          boundaryYear: response.data.result.boundaryYear,
          data: response.data.result.data[0].data,
        };

        setAllPopulationData((prevData) => [...prevData, populationData]);
      } catch (error) {
        console.error(error);
      }
    };

    const checkedPrefectures = prefectures.filter((prefecture) => prefecture.isChecked);
    const notFetchedPrefectures = checkedPrefectures.filter(
      (prefecture) => !allPopulationData.some((data) => data.prefCode === prefecture.prefCode),
    );

    notFetchedPrefectures.forEach((prefecture) => {
      fetchPopulationData(prefecture.prefCode, prefecture.prefName);
    });
  }, [prefectures, allPopulationData, setAllPopulationData]);

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

  useEffect(() => {
    getCheckedPrefecturesPopulationData();
  }, [prefectures, getCheckedPrefecturesPopulationData]);

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
