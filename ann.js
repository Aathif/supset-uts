// utils.test.js
import { naturalSort } from './path/to/your/module';

describe('naturalSort', () => {
  test('sorts nulls first', () => {
    const arr = [3, null, 2, 1];
    arr.sort(naturalSort);
    expect(arr).toEqual([null, 1, 2, 3]);
  });

  test('sorts NaNs before valid numbers', () => {
    const arr = [NaN, 3, NaN, 1];
    arr.sort(naturalSort);
    expect(arr).toEqual([NaN, NaN, 1, 3]);
  });

  test('sorts numbers and number-like strings correctly', () => {
    const arr = ['10', 2, '1', 3];
    arr.sort(naturalSort);
    expect(arr).toEqual([2, 3, '1', '10']);
  });

  test('sorts pure numbers before number-like strings', () => {
    const arr = [2, '3', 1, '10'];
    arr.sort(naturalSort);
    expect(arr).toEqual([1, 2, '10', '3']);
  });

  test('sorts strings containing digits correctly', () => {
    const arr = ['file10', 'file2', 'file1'];
    arr.sort(naturalSort);
    expect(arr).toEqual(['file1', 'file2', 'file10']);
  });

  test('sorts strings lexically if they do not contain digits', () => {
    const arr = ['apple', 'banana', 'cherry'];
    arr.sort(naturalSort);
    expect(arr).toEqual(['apple', 'banana', 'cherry']);
  });

  test('handles mixed inputs (null, NaN, numbers, strings)', () => {
    const arr = [null, 'file10', NaN, 2, 'file2', 3, NaN, 'file1'];
    arr.sort(naturalSort);
    expect(arr).toEqual([null, NaN, NaN, 2, 3, 'file1', 'file2', 'file10']);
  });
});
