import type { AxiosInstance } from 'axios';
import axios from 'axios';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import LineGraphComponent from '../components/LineGraphComponent/LineGraph';
import PopulationLabelSelector from '../components/PopulationLabelSelector/PopulationLabelSelector';
import PrefectureCheckBoxes from '../components/PrefectureCheckBoxes/PrefectureCheckBoxes';
import type {
  AllPopulationData,
  EnPopulationLabelType,
  MultilingualPopulationLabels,
  PopulationAPIResponse,
  PrefectureWithCheck,
  PrefecturesAPIResponse,
} from '../types';
import styles from './index.module.css';

const resasAxiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://opendata.resas-portal.go.jp',
  headers: {
    'X-API-KEY': process.env.NEXT_PUBLIC_RESAS_API_KEY,
  },
});

const multilingualPopulationLabels: MultilingualPopulationLabels = [
  ['total', 'juvenile', 'workingAge', 'elderly'],
  ['総人口', '年少人口', '生産年齢人口', '老年人口'],
];

const Home: FC = () => {
  const [prefecturesWithCheck, setPrefecturesWithCheck] = useState<PrefectureWithCheck[]>([]);
  const [allPopulationData, setAllPopulationData] = useState<AllPopulationData>({
    boundaryYear: 0,
    total: [],
    juvenile: [],
    workingAge: [],
    elderly: [],
  });
  const [selectedLabel, setSelectedLabel] = useState<EnPopulationLabelType>('total');

  const fetchPopulationData = async (prefCode: number, prefName: string) => {
    const populationEndPoint = '/api/v1/population/composition/perYear';
    const parameters = {
      prefCode,
      cityCode: '-',
    };

    try {
      const response = await resasAxiosInstance.get<PopulationAPIResponse>(populationEndPoint, {
        params: parameters,
      });

      const newPopulationData = response.data.result.data.map((data) => {
        return {
          prefCode: parameters.prefCode,
          prefName: prefName ?? '',
          data: data.data,
        };
      });

      setAllPopulationData((prevData) => ({
        boundaryYear: response.data.result.boundaryYear,
        total: [...prevData.total, newPopulationData[0]],
        juvenile: [...prevData.juvenile, newPopulationData[1]],
        workingAge: [...prevData.workingAge, newPopulationData[2]],
        elderly: [...prevData.elderly, newPopulationData[3]],
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrefectureCheckbox = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    const updatedPrefectures = prefecturesWithCheck.map((prefecture) =>
      prefecture.prefName === name ? { ...prefecture, isChecked: checked } : prefecture,
    );
    setPrefecturesWithCheck(updatedPrefectures);

    if (checked) {
      const selectedPrefecture = updatedPrefectures.find(
        (prefecture) => prefecture.prefName === name,
      );
      const notFetchedPrefectures = !allPopulationData[selectedLabel].some(
        (data) => data.prefCode === selectedPrefecture?.prefCode,
      );

      if (selectedPrefecture && notFetchedPrefectures) {
        await fetchPopulationData(selectedPrefecture.prefCode, selectedPrefecture.prefName);
      }
    }
  };

  const handlePopulationLabelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const matchingLabel = multilingualPopulationLabels[0].find((label) => label === value);
    if (matchingLabel === undefined) return;
    setSelectedLabel(matchingLabel);
  };

  const resetCheckBoxes = () => {
    const updatedPrefectures = prefecturesWithCheck.map((prefecture) => ({
      ...prefecture,
      isChecked: false,
    }));
    setPrefecturesWithCheck(updatedPrefectures);
  };

  const fetchPrefectures = async () => {
    const prefecturesEndpoint = '/api/v1/prefectures';

    try {
      const response = await resasAxiosInstance.get<PrefecturesAPIResponse>(prefecturesEndpoint);
      const prefData: PrefectureWithCheck[] = response.data.result.map((pref) => ({
        prefCode: pref.prefCode,
        prefName: pref.prefName,
        isChecked: false,
      }));
      setPrefecturesWithCheck(prefData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPrefectures();
  }, []);

  return (
    <div className={styles.container}>
      <PrefectureCheckBoxes
        prefectures={prefecturesWithCheck}
        handlePrefectureCheckbox={handlePrefectureCheckbox}
      />

      <button onClick={resetCheckBoxes}>全てのチェックを外す</button>

      <PopulationLabelSelector
        selectedLabel={selectedLabel}
        handlePopulationLabelChange={handlePopulationLabelChange}
      />

      <LineGraphComponent
        boundaryYear={allPopulationData.boundaryYear}
        populationData={allPopulationData[selectedLabel]}
        prefecturesWithCheck={prefecturesWithCheck}
      />
    </div>
  );
};

export default Home;
