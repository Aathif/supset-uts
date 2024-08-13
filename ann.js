// utils.test.js
import { getSort, naturalSort } from './path/to/your/module';

describe('getSort', () => {
  test('returns sort function from sorters function', () => {
    const customSort = jest.fn(() => (a, b) => a - b);
    const sorters = jest.fn(() => customSort);
    const result = getSort(sorters, 'someAttr');
    expect(sorters).toHaveBeenCalledWith('someAttr');
    expect(result).toBe(customSort);
  });

  test('returns a specific sort function from sorters object', () => {
    const customSort = jest.fn((a, b) => a - b);
    const sorters = {
      someAttr: customSort,
    };
    const result = getSort(sorters, 'someAttr');
    expect(result).toBe(customSort);
  });

  test('returns naturalSort when sorters is a function returning non-function', () => {
    const sorters = jest.fn(() => 'not a function');
    const result = getSort(sorters, 'someAttr');
    expect(sorters).toHaveBeenCalledWith('someAttr');
    expect(result).toBe(naturalSort);
  });

  test('returns naturalSort when attr is not in sorters object', () => {
    const sorters = {
      anotherAttr: jest.fn((a, b) => a - b),
    };
    const result = getSort(sorters, 'someAttr');
    expect(result).toBe(naturalSort);
  });

  test('returns naturalSort when sorters is null or undefined', () => {
    const resultNull = getSort(null, 'someAttr');
    const resultUndefined = getSort(undefined, 'someAttr');
    expect(resultNull).toBe(naturalSort);
    expect(resultUndefined).toBe(naturalSort);
  });

  test('returns naturalSort when no sorters is provided', () => {
    const result = getSort();
    expect(result).toBe(naturalSort);
  });
});
