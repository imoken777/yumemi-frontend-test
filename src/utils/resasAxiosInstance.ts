import type { AxiosInstance } from 'axios';
import axios from 'axios';

export const resasAxiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://opendata.resas-portal.go.jp',
  headers: {
    'X-API-KEY': process.env.NEXT_PUBLIC_RESAS_API_KEY,
  },
});
