// isEqualArray.test.js
import isEqualArray from './isEqualArray'; // Adjust the import path

describe('isEqualArray', () => {
  test('should return true for arrays with the same reference', () => {
    const arr = [1, 2, 3];
    expect(isEqualArray(arr, arr)).toBe(true);
  });

  test('should return true for both null arrays', () => {
    expect(isEqualArray(null, null)).toBe(true);
  });

  test('should return true for both undefined arrays', () => {
    expect(isEqualArray(undefined, undefined)).toBe(true);
  });

  test('should return true for equal arrays', () => {
    const arrA = [1, 2, 3];
    const arrB = [1, 2, 3];
    expect(isEqualArray(arrA, arrB)).toBe(true);
  });

  test('should return false for arrays with different lengths', () => {
    const arrA = [1, 2, 3];
    const arrB = [1, 2];
    expect(isEqualArray(arrA, arrB)).toBe(false);
  });

  test('should return false for arrays with different elements', () => {
    const arrA = [1, 2, 3];
    const arrB = [1, 2, 4];
    expect(isEqualArray(arrA, arrB)).toBe(false);
  });

  test('should return false for one null and one array', () => {
    const arr = [1, 2, 3];
    expect(isEqualArray(arr, null)).toBe(false);
    expect(isEqualArray(null, arr)).toBe(false);
  });

  test('should return false for one undefined and one array', () => {
    const arr = [1, 2, 3];
    expect(isEqualArray(arr, undefined)).toBe(false);
    expect(isEqualArray(undefined, arr)).toBe(false);
  });
});
