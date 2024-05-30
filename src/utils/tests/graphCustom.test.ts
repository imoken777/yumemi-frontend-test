import { convertToJapaneseUnits, numberToColor } from '../graphCustom';

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
