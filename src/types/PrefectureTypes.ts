export type PrefectureBase = {
  prefCode: number;
  prefName: string;
};

export type PrefecturesAPIResponse = {
  message: string | null;
  result: PrefectureBase[];
};

export type PrefectureWithCheck = PrefectureBase & {
  isChecked: boolean;
};
