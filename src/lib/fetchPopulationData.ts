import axios from 'axios';
import type {
  AllPopulationData,
  PopulationAPIResponse,
  PopulationData,
} from '../types/PopulationTypes';

const ORIGIN_URL = process.env.NEXT_PUBLIC_ORIGIN_URL;

export const fetchPopulationData = async (
  prefCode: number,
  prefName: string,
): Promise<{
  boundaryYear: AllPopulationData['boundaryYear'];
  total: PopulationData;
  juvenile: PopulationData;
  workingAge: PopulationData;
  elderly: PopulationData;
} | null> => {
  const parameters = {
    prefCode: prefCode.toString(),
    cityCode: '-',
  };

  try {
    const response = await axios.get<PopulationAPIResponse>(`${ORIGIN_URL}/api/populationData`, {
      params: parameters,
    });

    const newPopulationData = response.data.result.data.map((data) => {
      return {
        prefCode,
        prefName,
        data: data.data,
      };
    });

    return {
      boundaryYear: response.data.result.boundaryYear,
      total: newPopulationData[0],
      juvenile: newPopulationData[1],
      workingAge: newPopulationData[2],
      elderly: newPopulationData[3],
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data);
    } else {
      console.error(error);
    }
    return null;
  }
};
