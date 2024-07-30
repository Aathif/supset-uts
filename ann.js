import { Row } from 'react-table';
import { sortAlphanumericCaseInsensitive } from './sortAlphanumericCaseInsensitive';

describe('sortAlphanumericCaseInsensitive', () => {
  const createRow = (value) => ({
    values: {
      testColumn: value,
    },
  });

  it('should sort strings alphabetically in a case-insensitive manner', () => {
    const rowA = createRow('apple');
    const rowB = createRow('Banana');
    expect(sortAlphanumericCaseInsensitive(rowA, rowB, 'testColumn')).toBeLessThan(0);
    expect(sortAlphanumericCaseInsensitive(rowB, rowA, 'testColumn')).toBeGreaterThan(0);
    expect(sortAlphanumericCaseInsensitive(rowA, rowA, 'testColumn')).toBe(0);
  });

  it('should handle non-string values by placing them at the end', () => {
    const rowA = createRow('apple');
    const rowB = createRow(null);
    const rowC = createRow(undefined);
    const rowD = createRow(123);

    expect(sortAlphanumericCaseInsensitive(rowA, rowB, 'testColumn')).toBeGreaterThan(0);
    expect(sortAlphanumericCaseInsensitive(rowA, rowC, 'testColumn')).toBeGreaterThan(0);
    expect(sortAlphanumericCaseInsensitive(rowA, rowD, 'testColumn')).toBeLessThan(0);
    expect(sortAlphanumericCaseInsensitive(rowB, rowC, 'testColumn')).toBe(0);
    expect(sortAlphanumericCaseInsensitive(rowB, rowD, 'testColumn')).toBe(-1);
    expect(sortAlphanumericCaseInsensitive(rowC, rowD, 'testColumn')).toBe(-1);
  });

  it('should sort strings with different cases correctly', () => {
    const rowA = createRow('apple');
    const rowB = createRow('Apple');
    const rowC = createRow('Banana');
    const rowD = createRow('banana');

    expect(sortAlphanumericCaseInsensitive(rowA, rowB, 'testColumn')).toBe(0);
    expect(sortAlphanumericCaseInsensitive(rowB, rowC, 'testColumn')).toBeLessThan(0);
    expect(sortAlphanumericCaseInsensitive(rowC, rowD, 'testColumn')).toBe(0);
  });

  it('should handle empty strings correctly', () => {
    const rowA = createRow('');
    const rowB = createRow('Banana');
    const rowC = createRow('');

    expect(sortAlphanumericCaseInsensitive(rowA, rowB, 'testColumn')).toBeLessThan(0);
    expect(sortAlphanumericCaseInsensitive(rowB, rowA, 'testColumn')).toBeGreaterThan(0);
    expect(sortAlphanumericCaseInsensitive(rowA, rowC, 'testColumn')).toBe(0);
  });
});
