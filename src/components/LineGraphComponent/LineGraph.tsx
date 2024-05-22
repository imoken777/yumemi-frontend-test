import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import type { PopulationData, Prefecture } from '../../types';

type LineGraphProps = {
  combinedData: {
    [key: string]: number | null;
    year: number;
  }[];
  populationData: PopulationData[];
  prefectures: Prefecture[];
};

const LineGraphComponent: React.FC<LineGraphProps> = ({
  combinedData,
  populationData,
  prefectures,
}) => {
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

  return (
    <LineChart
      width={1500}
      height={1000}
      data={combinedData}
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
