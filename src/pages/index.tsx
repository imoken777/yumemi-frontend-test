import type { AxiosInstance } from 'axios';
import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

const Home: React.FC = () => {
  const [prefectures, setPrefectures] = useState<PrefectureWithCheck[]>([]);
  const [totalPopulationData, setTotalPopulationData] = useState<PopulationData[]>([]);

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

    const checkedPrefectures = prefectures.filter((prefecture) => prefecture.isChecked);
    const notFetchedPrefectures = checkedPrefectures.filter(
      (prefecture) => !totalPopulationData.some((data) => data.prefCode === prefecture.prefCode),
    );

    notFetchedPrefectures.forEach((prefecture) => {
      fetchPopulationData(prefecture.prefCode, prefecture.prefName);
    });
  }, [prefectures, totalPopulationData, setTotalPopulationData]);

  const fetchPrefectures = async () => {
    const prefecturesEndpoint = '/api/v1/prefectures';

    try {
      const response = await resasAxiosInstance.get<PrefecturesAPIResponse>(prefecturesEndpoint);
      const prefData: PrefectureWithCheck[] = response.data.result.map((pref) => ({
        prefCode: pref.prefCode,
        prefName: pref.prefName,
        isChecked: false,
      }));
      setPrefectures(prefData);
    } catch (error) {
      console.error(error);
    }
  };

  const combinedPopulationByYearData = useMemo(() => {
    const yearMap: { [key: number]: { year: number; [key: string]: number | null } } = {};

    totalPopulationData.forEach((popData) => {
      popData.data.forEach((entry) => {
        if (yearMap[entry.year] === undefined) {
          yearMap[entry.year] = { year: entry.year };
        }
        yearMap[entry.year][popData.prefName] = entry.value;
      });
    });

    Object.values(yearMap).forEach((yearData) => {
      totalPopulationData.forEach((popData) => {
        if (!(popData.prefName in yearData)) {
          yearData[popData.prefName] = null;
        }
      });
    });

    return Object.values(yearMap);
  }, [totalPopulationData]);

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

      <LineGraphComponent
        combinedData={combinedPopulationByYearData}
        populationData={totalPopulationData}
        prefectures={prefectures}
      />
    </div>
  );
};

export default Home;
