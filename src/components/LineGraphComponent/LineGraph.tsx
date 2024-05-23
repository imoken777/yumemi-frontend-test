import type { FC } from 'react';
import { useMemo } from 'react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import type { PopulationData, PrefectureWithCheck } from '../../types';

type LineGraphProps = {
  populationData: PopulationData[];
  prefecturesWithCheck: PrefectureWithCheck[];
};

const numberToColor = (number: number) => {
  const colors = [
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffc000',
    '#ff00ff',
    '#00dfff',
    '#ff8000',
    '#ff0080',
    '#80ff00',
    '#8000ff',
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
    <LineChart
      width={1500}
      height={1000}
      data={combinedPopulationByYearData}
      margin={{ top: 5, right: 20, bottom: 5, left: 10 }}
    >
      <CartesianGrid stroke="#f5f5f5" />
      <XAxis dataKey="year" />
      <YAxis tickFormatter={formatYAxis} />
      <Tooltip />
      <Legend />
      {populationData.map((popData, index) => {
        const isChecked = prefectures.some(
          (pref) => pref.prefCode === popData.prefCode && pref.isChecked,
        );
        return isChecked ? (
          <Line
            key={popData.prefCode}
            type="monotone"
            dataKey={popData.prefName}
            stroke={numberToColor(index)}
            dot={false}
            activeDot={{ r: 8 }}
          />
        ) : null;
      })}
    </LineChart>
  );
};

export default LineGraphComponent;
