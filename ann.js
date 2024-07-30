// extent.test.js
import extent from './extent';

describe('extent', () => {
  test('should return [undefined, undefined] for an empty array', () => {
    expect(extent([])).toEqual([undefined, undefined]);
  });

  test('should handle array with numbers', () => {
    expect(extent([1, 3, 2, 5, 4])).toEqual([1, 5]);
    expect(extent([1, -3, 2, -5, 4])).toEqual([-5, 4]);
  });

  test('should handle array with strings', () => {
    expect(extent(['apple', 'banana', 'cherry'])).toEqual(['apple', 'cherry']);
    expect(extent(['cherry', 'banana', 'apple'])).toEqual(['apple', 'cherry']);
  });

  test('should handle array with dates', () => {
    const date1 = new Date('2024-01-01');
    const date2 = new Date('2024-02-01');
    const date3 = new Date('2024-03-01');
    expect(extent([date2, date1, date3])).toEqual([date1, date3]);
  });

  test('should handle array with mixed types', () => {
    expect(extent([1, 'apple', null, 3, 'banana'])).toEqual([1, 3]);
    expect(extent(['banana', 2, null, 'apple', 1])).toEqual([1, 'banana']);
  });

  test('should handle array with undefined and null values', () => {
    expect(extent([null, undefined, 2, null, 3])).toEqual([2, 3]);
    expect(extent([null, undefined, 'a', null, 'b'])).toEqual(['a', 'b']);
  });

  test('should return undefined for all null values', () => {
    expect(extent([null, null, null])).toEqual([undefined, undefined]);
  });
});
