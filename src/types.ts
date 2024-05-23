interface PrefectureBase {
  prefCode: number;
  prefName: string;
}

export type PrefecturesAPIResponse = {
  message: string | null;
  result: PrefectureBase[];
};

export type PrefectureWithCheck = PrefectureBase & {
  isChecked: boolean;
};

type PopulationDataItem = {
  year: number;
  value: number;
};

export type PopulationAPIResponse = {
  message: string | null;
  result: {
    boundaryYear: number;
    data: {
      label: '総人口' | '年少人口' | '生産年齢人口' | '老年人口';
      data: PopulationDataItem[];
    }[];
  };
};

export type PopulationData = PrefectureBase & {
  boundaryYear: number;
  data: PopulationDataItem[];
};
