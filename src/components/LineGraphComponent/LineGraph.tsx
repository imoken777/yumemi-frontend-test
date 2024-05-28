import type { FC } from 'react';
import { Fragment, useMemo } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { PopulationData, PrefectureWithCheck } from '../../types';

type LineGraphProps = {
  boundaryYear: number;
  populationData: PopulationData[];
  prefecturesWithCheck: PrefectureWithCheck[];
};

const numberToColor = (number: number) => {
  const colors = [
    '#ff0000',
    '#007fff',
    '#ff00ff',
    '#ff007f',
    '#00ffff',
    '#ffff00',
    '#7f00ff',
    '#00ff7f',
    '#0000ff',
    '#ff7f00',
    '#7fff00',
  ];
  return colors[number % colors.length];
};

const formatYAxis = (tickItem: number) => {
  if (tickItem >= 100000000) {
    return `${(tickItem / 100000000).toFixed(0)}億`;
  } else if (tickItem >= 10000) {
    return `${(tickItem / 10000).toFixed(0)}万`;
  } else {
    return tickItem.toString();
  }
};

const LineGraphComponent: FC<LineGraphProps> = ({
  boundaryYear: boundaryYear,
  populationData,
  prefecturesWithCheck: prefectures,
}) => {
  const combinedPopulationByYearData = useMemo(() => {
    const yearMap: { [key: number]: { year: number; [key: string]: number | null } } = {};

    populationData.forEach((popData) => {
      popData.data.forEach((entry) => {
        if (yearMap[entry.year] === undefined) {
          yearMap[entry.year] = { year: entry.year };
        }
        yearMap[entry.year][popData.prefName] = entry.value;
      });
    });

    Object.values(yearMap).forEach((yearData) => {
      populationData.forEach((popData) => {
        if (!(popData.prefName in yearData)) {
          yearData[popData.prefName] = null;
        }
      });
    });

    return Object.values(yearMap);
  }, [populationData]);

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart
        width={700}
        height={500}
        data={combinedPopulationByYearData}
        margin={{ top: 5, right: 20, bottom: 5, left: 10 }}
      >
        <defs>
          <clipPath id="recharts-clip">
            <rect x="0" y="0" width="100%" height="100%" />
          </clipPath>
        </defs>
        <CartesianGrid stroke="var(--secondary-color)" />
        <XAxis
          dataKey="year"
          allowDuplicatedCategory={false}
          stroke="var(--secondary-color)"
          dy={5}
        />
        <YAxis tickFormatter={formatYAxis} stroke="var(--secondary-color)" />
        <Tooltip
          payloadUniqBy={(payload) => payload.name}
          contentStyle={{ backgroundColor: 'var(--primary-color)' }}
        />
        <Legend />
        {populationData.map((popData, index) => {
          const isChecked = prefectures.some(
            (pref) => pref.prefCode === popData.prefCode && pref.isChecked,
          );
          if (!isChecked) return null;

          //グラフを見た目上連続にするため、boundaryYearのデータは重複して描画する
          const actualData = combinedPopulationByYearData.filter((d) => d.year <= boundaryYear);
          const futureData = combinedPopulationByYearData.filter((d) => d.year >= boundaryYear);

          return (
            <Fragment key={popData.prefCode}>
              <Line
                type="monotone"
                dataKey={popData.prefName}
                stroke={numberToColor(index)}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8 }}
                data={actualData}
                animationDuration={500}
                unit="人"
              />
              <Line
                type="monotone"
                dataKey={popData.prefName}
                stroke={numberToColor(index)}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8 }}
                strokeDasharray="5 5"
                legendType="none"
                data={futureData}
                animationDuration={500}
                unit="人"
              />
            </Fragment>
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineGraphComponent;
