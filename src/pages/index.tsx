import axios from 'axios';
import styles from './index.module.css';
import type { Prefecture, PrefecturesAPIResponse } from '../types';
import { useEffect, useState } from 'react';

const Home = () => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);

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
};

export default Home;
