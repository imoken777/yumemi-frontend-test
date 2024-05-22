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
