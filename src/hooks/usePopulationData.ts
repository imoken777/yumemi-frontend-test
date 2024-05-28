import axios from 'axios';
import { useCallback, useState } from 'react';
import type { AllPopulationData, PopulationAPIResponse, PopulationData } from '../types';

const ORIGIN_URL = process.env.NEXT_PUBLIC_ORIGIN_URL;

const fetchPopulationData = async (
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

export const usePopulationData = () => {
  const [allPopulationData, setAllPopulationData] = useState<AllPopulationData>({
    boundaryYear: 0,
    total: [],
    juvenile: [],
    workingAge: [],
    elderly: [],
  });

  const updatePopulationData = useCallback(async (prefCode: number, prefName: string) => {
    const newPopulationData = await fetchPopulationData(prefCode, prefName);
    if (newPopulationData) {
      setAllPopulationData((prev) => {
        return {
          boundaryYear: newPopulationData.boundaryYear,
          total: [...prev.total, newPopulationData.total],
          juvenile: [...prev.juvenile, newPopulationData.juvenile],
          workingAge: [...prev.workingAge, newPopulationData.workingAge],
          elderly: [...prev.elderly, newPopulationData.elderly],
        };
      });
    } else {
      console.error('Failed to fetch population data');
    }
  }, []);

  return { allPopulationData, updatePopulationData };
};
