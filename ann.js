import extent from './extent';

describe('extent', () => {
  it('should return [undefined, undefined] for an empty array', () => {
    expect(extent([])).toEqual([undefined, undefined]);
  });

  it('should return the correct min and max for an array of numbers', () => {
    const values = [3, 1, 4, 1, 5, 9];
    expect(extent(values)).toEqual([1, 9]);
  });

  it('should return the correct min and max for an array of strings', () => {
    const values = ['c', 'a', 'd', 'b'];
    expect(extent(values)).toEqual(['a', 'd']);
  });

  it('should return the correct min and max for an array of dates', () => {
    const values = [
      new Date('2020-01-01'),
      new Date('2019-01-01'),
      new Date('2021-01-01'),
    ];
    expect(extent(values)).toEqual([
      new Date('2019-01-01'),
      new Date('2021-01-01'),
    ]);
  });

  it('should ignore null values', () => {
    const values = [3, null, 1, 4, null, 1, 5, 9];
    expect(extent(values)).toEqual([1, 9]);
  });

  it('should ignore undefined values', () => {
    const values = [3, undefined, 1, 4, undefined, 1, 5, 9];
    expect(extent(values)).toEqual([1, 9]);
  });

  it('should handle an array with only null or undefined values', () => {
    expect(extent([null, null, undefined])).toEqual([undefined, undefined]);
  });

  it('should handle an array with a single value', () => {
    expect(extent([5])).toEqual([5, 5]);
  });

  it('should handle an array with multiple identical values', () => {
    expect(extent([7, 7, 7, 7])).toEqual([7, 7]);
  });

  it('should handle mixed types in the array', () => {
    const values = [3, 'a', new Date('2020-01-01')];
    // This is not a typical use case, but it tests the robustness of the function
    expect(extent(values)).toEqual([3, new Date('2020-01-01')]);
  });
});
