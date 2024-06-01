import type { PopulationData } from '../../types/PopulationTypes';
import { combinePopulationByYearData, convertToJapaneseUnits, numberToColor } from '../graphCustom';

describe('combinePopulationByYearData', () => {
  test('should combine population data by year correctly', () => {
    const populationData: PopulationData[] = [
      {
        prefName: '北海道',
        prefCode: 1,
        data: [
          { year: 2000, value: 5600000 },
          { year: 2005, value: 5500000 },
        ],
      },
      {
        prefName: '青森県',
        prefCode: 2,
        data: [
          { year: 2000, value: 1400000 },
          { year: 2005, value: 1350000 },
        ],
      },
    ];

    const expected = [
      { year: 2000, 北海道: 5600000, 青森県: 1400000 },
      { year: 2005, 北海道: 5500000, 青森県: 1350000 },
    ];

    const result = combinePopulationByYearData(populationData);

    expect(result).toEqual(expected);
  });

  test('should handle missing years for some prefectures', () => {
    const populationData: PopulationData[] = [
      {
        prefName: '北海道',
        prefCode: 1,
        data: [{ year: 2000, value: 5600000 }],
      },
      {
        prefName: '青森県',
        prefCode: 2,
        data: [
          { year: 2000, value: 1400000 },
          { year: 2005, value: 1350000 },
        ],
      },
    ];

    const expected = [
      { year: 2000, 北海道: 5600000, 青森県: 1400000 },
      { year: 2005, 北海道: null, 青森県: 1350000 },
    ];

    const result = combinePopulationByYearData(populationData);

    expect(result).toEqual(expected);
  });
});

describe('graphCustom', () => {
  describe('numberToColor', () => {
    test('should return the correct color for the given number', () => {
      expect(numberToColor(0)).toBe('#ff0000');
      expect(numberToColor(1)).toBe('#007fff');
      expect(numberToColor(2)).toBe('#ff00ff');
      expect(numberToColor(3)).toBe('#ff007f');
      expect(numberToColor(4)).toBe('#00ffff');
      expect(numberToColor(5)).toBe('#ffff00');
      expect(numberToColor(6)).toBe('#7f00ff');
      expect(numberToColor(7)).toBe('#00ff7f');
      expect(numberToColor(8)).toBe('#0000ff');
      expect(numberToColor(9)).toBe('#ff7f00');
      expect(numberToColor(10)).toBe('#7fff00');
      expect(numberToColor(11)).toBe('#ff0000');
    });
  });

  describe('convertToJapaneseUnits', () => {
    test('should convert the number to the correct Japanese unit', () => {
      expect(convertToJapaneseUnits(100000000)).toBe('1億');
      expect(convertToJapaneseUnits(10000000)).toBe('1000万');
      expect(convertToJapaneseUnits(1000000)).toBe('100万');
      expect(convertToJapaneseUnits(100000)).toBe('10万');
      expect(convertToJapaneseUnits(10000)).toBe('1万');
      expect(convertToJapaneseUnits(1000)).toBe('1000');
      expect(convertToJapaneseUnits(100)).toBe('100');
      expect(convertToJapaneseUnits(10)).toBe('10');
      expect(convertToJapaneseUnits(1)).toBe('1');
    });
  });
});
