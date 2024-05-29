import type { PrefectureBase } from './PrefectureTypes';

type PopulationDataItem = {
  year: number;
  value: number;
};

export type MultilingualPopulationLabels = [
  ['total', 'juvenile', 'workingAge', 'elderly'],
  ['総人口', '年少人口', '生産年齢人口', '老年人口'],
];
export type EnPopulationLabelType = MultilingualPopulationLabels[0][number];

export type JaPopulationLabelType = MultilingualPopulationLabels[0][number];

export type PopulationAPIResponse = {
  message: string | null;
  result: {
    boundaryYear: number;
    data: {
      label: JaPopulationLabelType;
      data: PopulationDataItem[];
    }[];
  };
};

export type PopulationData = PrefectureBase & {
  data: PopulationDataItem[];
};

export type AllPopulationData = {
  boundaryYear: PopulationAPIResponse['result']['boundaryYear'];
} & {
  [key in EnPopulationLabelType]: PopulationData[];
};
