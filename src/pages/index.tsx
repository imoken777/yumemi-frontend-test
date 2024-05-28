import axios from 'axios';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import type { FC } from 'react';
import { useState } from 'react';
import LineGraphComponent from '../components/LineGraphComponent/LineGraph';
import PopulationLabelSelector from '../components/PopulationLabelSelector/PopulationLabelSelector';
import PrefectureCheckBoxes from '../components/PrefectureCheckBoxes/PrefectureCheckBoxes';
import { usePopulationData } from '../hooks/usePopulationData';
import type {
  EnPopulationLabelType,
  MultilingualPopulationLabels,
  PrefectureWithCheck,
  PrefecturesAPIResponse,
} from '../types';
import styles from './index.module.css';

const multilingualPopulationLabels: MultilingualPopulationLabels = [
  ['total', 'juvenile', 'workingAge', 'elderly'],
  ['総人口', '年少人口', '生産年齢人口', '老年人口'],
];

const ORIGIN_URL = process.env.NEXT_PUBLIC_ORIGIN_URL;

const Home: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  prefecturesWithCheck: initialPrefecturesWithCheck,
}) => {
  const [prefecturesWithCheck, setPrefecturesWithCheck] = useState<PrefectureWithCheck[]>(
    initialPrefecturesWithCheck,
  );
  const { allPopulationData, updatePopulationData } = usePopulationData();
  const [selectedLabel, setSelectedLabel] = useState<EnPopulationLabelType>('total');

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
        await updatePopulationData(selectedPrefecture.prefCode, selectedPrefecture.prefName);
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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>都道府県別人口推移グラフ</h1>
      </header>

      <main className={styles.main}>
        <section className={styles.checkboxSection}>
          <PrefectureCheckBoxes
            prefectures={prefecturesWithCheck}
            handlePrefectureCheckbox={handlePrefectureCheckbox}
          />
          <button className={styles.resetButton} onClick={resetCheckBoxes}>
            全てのチェックを外す
          </button>
        </section>

        <section className={styles.labelSelectorSection}>
          <PopulationLabelSelector
            selectedLabel={selectedLabel}
            handlePopulationLabelChange={handlePopulationLabelChange}
          />
        </section>

        <section className={styles.graphSection}>
          <LineGraphComponent
            boundaryYear={allPopulationData.boundaryYear}
            populationData={allPopulationData[selectedLabel]}
            prefecturesWithCheck={prefecturesWithCheck}
          />
        </section>
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps<{
  prefecturesWithCheck: PrefectureWithCheck[];
}> = async () => {
  try {
    const response = await axios.get<PrefecturesAPIResponse>(`${ORIGIN_URL}/api/prefectures`);
    const prefData: PrefectureWithCheck[] = response.data.result.map((pref) => ({
      prefCode: pref.prefCode,
      prefName: pref.prefName,
      isChecked: false,
    }));

    return {
      props: {
        prefecturesWithCheck: prefData,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error', error);
    return {
      props: {
        prefecturesWithCheck: [],
      },
      revalidate: 30,
    };
  }
};

export default Home;
