import { sortByMonth } from './sortByMonth';

describe('sortByMonth', () => {
  it('should sort in ascending order by default', () => {
    const arr = [
      { x: 'Jan-2023' },
      { x: 'Mar-2023' },
      { x: 'Feb-2023' },
      { x: 'Apr-2022' },
    ];
    const sorted = sortByMonth(arr);
    expect(sorted).toEqual([
      { x: 'Apr-2022' },
      { x: 'Jan-2023' },
      { x: 'Feb-2023' },
      { x: 'Mar-2023' },
    ]);
  });

  it('should sort in descending order when specified', () => {
    const arr = [
      { x: 'Jan-2023' },
      { x: 'Mar-2023' },
      { x: 'Feb-2023' },
      { x: 'Apr-2022' },
    ];
    const sorted = sortByMonth(arr, 'desc');
    expect(sorted).toEqual([
      { x: 'Mar-2023' },
      { x: 'Feb-2023' },
      { x: 'Jan-2023' },
      { x: 'Apr-2022' },
    ]);
  });

  it('should handle months in the same year correctly', () => {
    const arr = [
      { x: 'Feb-2023' },
      { x: 'Jan-2023' },
      { x: 'Mar-2023' },
    ];
    const sorted = sortByMonth(arr);
    expect(sorted).toEqual([
      { x: 'Jan-2023' },
      { x: 'Feb-2023' },
      { x: 'Mar-2023' },
    ]);
  });

  it('should handle months in the same year correctly in descending order', () => {
    const arr = [
      { x: 'Feb-2023' },
      { x: 'Jan-2023' },
      { x: 'Mar-2023' },
    ];
    const sorted = sortByMonth(arr, 'desc');
    expect(sorted).toEqual([
      { x: 'Mar-2023' },
      { x: 'Feb-2023' },
      { x: 'Jan-2023' },
    ]);
  });

  it('should sort correctly with mixed years', () => {
    const arr = [
      { x: 'Mar-2022' },
      { x: 'Jan-2023' },
      { x: 'Feb-2022' },
      { x: 'Apr-2023' },
    ];
    const sorted = sortByMonth(arr);
    expect(sorted).toEqual([
      { x: 'Feb-2022' },
      { x: 'Mar-2022' },
      { x: 'Jan-2023' },
      { x: 'Apr-2023' },
    ]);
  });

  it('should handle an empty array', () => {
    const arr = [];
    const sorted = sortByMonth(arr);
    expect(sorted).toEqual([]);
  });
});
