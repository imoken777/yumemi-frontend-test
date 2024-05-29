import { useCallback, useState } from 'react';
import { fetchPopulationData } from '../lib/fetchPopulationData';
import type { AllPopulationData } from '../types/PopulationTypes';

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
