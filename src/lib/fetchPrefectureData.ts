import axios from 'axios';
import type { PrefecturesAPIResponse, PrefectureWithCheck } from '../types';

const ORIGIN_URL = process.env.NEXT_PUBLIC_ORIGIN_URL;

export const fetchPrefectureData = async (): Promise<PrefectureWithCheck[] | null> => {
  try {
    const response = await axios.get<PrefecturesAPIResponse>(`${ORIGIN_URL}/api/prefectures`);
    const prefData: PrefectureWithCheck[] = response.data.result.map((pref) => ({
      prefCode: pref.prefCode,
      prefName: pref.prefName,
      isChecked: false,
    }));
    return prefData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data);
    } else {
      console.error(error);
    }
    return null;
  }
};
