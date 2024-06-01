import type { PopulationData } from '../types/PopulationTypes';

export const combinePopulationByYearData = (populationData: PopulationData[]) => {
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
};

export const numberToColor = (number: number) => {
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

export const convertToJapaneseUnits = (tickItem: number) => {
  if (tickItem >= 100000000) {
    return `${(tickItem / 100000000).toFixed(0)}億`;
  } else if (tickItem >= 10000) {
    return `${(tickItem / 10000).toFixed(0)}万`;
  } else {
    return tickItem.toString();
  }
};
