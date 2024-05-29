import type { NextApiRequest, NextApiResponse } from 'next';
import { resasAxiosInstance } from '../../lib/resasAxiosInstance';
import type { ErrorAPIResponse, PrefecturesAPIResponse } from '../../types';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<PrefecturesAPIResponse | ErrorAPIResponse>,
) => {
  const prefecturesEndPoint = '/api/v1/prefectures';

  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  try {
    const response = await resasAxiosInstance.get<PrefecturesAPIResponse>(prefecturesEndPoint);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
