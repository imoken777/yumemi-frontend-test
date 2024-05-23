import type { AxiosInstance } from 'axios';
import axios from 'axios';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import LineGraphComponent from '../components/LineGraphComponent/LineGraph';
import PrefectureCheckBoxes from '../components/PrefectureCheckBoxes/PrefectureCheckBoxes';
import type {
  PopulationAPIResponse,
  PopulationData,
  PrefectureWithCheck,
  PrefecturesAPIResponse,
} from '../types';
import styles from './index.module.css';

const resasAxiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://opendata.resas-portal.go.jp',
  headers: {
    'X-API-KEY': process.env.NEXT_PUBLIC_RESAS_API_KEY,
  },
});

const Home: FC = () => {
  const [prefecturesWithCheck, setPrefecturesWithCheck] = useState<PrefectureWithCheck[]>([]);
  const [totalPopulationData, setTotalPopulationData] = useState<PopulationData[]>([]);

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
      const totalPopulationData: PopulationData = {
        prefCode: parameters.prefCode,
        prefName: prefName ?? '',
        boundaryYear: response.data.result.boundaryYear,
        data: response.data.result.data[0].data,
      };

      setTotalPopulationData((prevData) => [...prevData, totalPopulationData]);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrefectureCheckbox = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    const updatedPrefectures = prefecturesWithCheck.map((prefecture) =>
      prefecture.prefName === name ? { ...prefecture, isChecked: checked } : prefecture,
    );
    setPrefecturesWithCheck(updatedPrefectures);

    if (checked) {
      const selectedPrefecture = updatedPrefectures.find(
        (prefecture) => prefecture.prefName === name,
      );
      const notFetchedPrefectures = !totalPopulationData.some(
        (data) => data.prefCode === selectedPrefecture?.prefCode,
      );

      if (selectedPrefecture && notFetchedPrefectures) {
        await fetchPopulationData(selectedPrefecture.prefCode, selectedPrefecture.prefName);
      }
    }
  };

  const fetchPrefectures = async () => {
    const prefecturesEndpoint = '/api/v1/prefectures';

    try {
      const response = await resasAxiosInstance.get<PrefecturesAPIResponse>(prefecturesEndpoint);
      const prefData: PrefectureWithCheck[] = response.data.result.map((pref) => ({
        prefCode: pref.prefCode,
        prefName: pref.prefName,
        isChecked: false,
      }));
      setPrefecturesWithCheck(prefData);
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
        prefectures={prefecturesWithCheck}
        handlePrefectureCheckbox={handlePrefectureCheckbox}
      />

      <LineGraphComponent
        populationData={totalPopulationData}
        prefecturesWithCheck={prefecturesWithCheck}
      />
    </div>
  );
};

export default Home;
