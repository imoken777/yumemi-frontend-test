import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import type { FC } from 'react';
import LineGraphComponent from '../components/LineGraphComponent/LineGraph';
import PopulationLabelSelector from '../components/PopulationLabelSelector/PopulationLabelSelector';
import PrefectureCheckBoxes from '../components/PrefectureCheckBoxes/PrefectureCheckBoxes';
import { usePopulationData } from '../hooks/usePopulationData';
import { usePopulationLabel } from '../hooks/usePopulationLabel';
import { usePrefectureCheck } from '../hooks/usePrefectureCheck';
import type { PrefectureWithCheck } from '../types';
import styles from './index.module.css';

const multilingualPopulationLabels: MultilingualPopulationLabels = [
  ['total', 'juvenile', 'workingAge', 'elderly'],
  ['総人口', '年少人口', '生産年齢人口', '老年人口'],
];
const Home: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  prefecturesWithCheck: initialPrefecturesWithCheck,
}) => {
  const { allPopulationData, updatePopulationData } = usePopulationData();

  const { prefecturesWithCheck, handlePrefectureCheckbox, resetCheckBoxes } = usePrefectureCheck(
    initialPrefecturesWithCheck,
    allPopulationData,
    updatePopulationData,
  );

  const { selectedLabel, handlePopulationLabelChange, multilingualPopulationLabels } =
    usePopulationLabel();

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
