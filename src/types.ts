export type PrefecturesAPIResponse = {
  message: string;
  result: {
    prefCode: number;
    prefName: string;
  }[];
};

export type Prefecture = {
  prefCode: number;
  prefName: string;
  isChecked: boolean;
};

export type PopulationAPIResponse = {
  message: string;
  result: {
    boundaryYear: number;
    data: {
      label: string;
      data: {
        year: number;
        value: number;
      }[];
    }[];
  };
};

export type PopulationData = {
  prefCode: number;
  prefName: string;
  boundaryYear: number;
  data: {
    year: number;
    value: number;
  }[];
};
