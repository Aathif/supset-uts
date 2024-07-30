import isEqualColumns from './isEqualColumns';
import { isEqualArray } from '@superset-ui/core';

jest.mock('@superset-ui/core', () => ({
  isEqualArray: jest.fn(),
}));

describe('isEqualColumns', () => {
  const mockTableChartProps = (overrides = {}) => ({
    datasource: {
      columnFormats: {},
      currencyFormats: {},
      verboseMap: {},
    },
    formData: {
      tableTimestampFormat: '',
      timeGrainSqla: '',
      columnConfig: {},
      metrics: [],
      extraFilters: [],
      extraFormData: {},
    },
    queriesData: [
      {
        colnames: [],
        coltypes: [],
      },
    ],
    rawFormData: {
      column_config: {},
    },
    ...overrides,
  });

  it('should return true for identical props', () => {
    const propsA = [mockTableChartProps()];
    const propsB = [mockTableChartProps()];

    isEqualArray.mockReturnValue(true);

    expect(isEqualColumns(propsA, propsB)).toBe(true);
  });

  it('should return false for different columnFormats', () => {
    const propsA = [mockTableChartProps({ datasource: { columnFormats: { a: 1 } } })];
    const propsB = [mockTableChartProps({ datasource: { columnFormats: { b: 2 } } })];

    isEqualArray.mockReturnValue(true);

    expect(isEqualColumns(propsA, propsB)).toBe(false);
  });

  it('should return false for different metrics', () => {
    const propsA = [mockTableChartProps({ formData: { metrics: [1] } })];
    const propsB = [mockTableChartProps({ formData: { metrics: [2] } })];

    isEqualArray.mockImplementation((a, b) => JSON.stringify(a) === JSON.stringify(b));

    expect(isEqualColumns(propsA, propsB)).toBe(false);
  });

  it('should return true for same metrics', () => {
    const propsA = [mockTableChartProps({ formData: { metrics: [1] } })];
    const propsB = [mockTableChartProps({ formData: { metrics: [1] } })];

    isEqualArray.mockImplementation((a, b) => JSON.stringify(a) === JSON.stringify(b));

    expect(isEqualColumns(propsA, propsB)).toBe(true);
  });

  it('should return false for different colnames', () => {
    const propsA = [mockTableChartProps({ queriesData: [{ colnames: ['a'] }] })];
    const propsB = [mockTableChartProps({ queriesData: [{ colnames: ['b'] }] })];

    isEqualArray.mockImplementation((a, b) => JSON.stringify(a) === JSON.stringify(b));

    expect(isEqualColumns(propsA, propsB)).toBe(false);
  });

  it('should return true for same colnames', () => {
    const propsA = [mockTableChartProps({ queriesData: [{ colnames: ['a'] }] })];
    const propsB = [mockTableChartProps({ queriesData: [{ colnames: ['a'] }] })];

    isEqualArray.mockImplementation((a, b) => JSON.stringify(a) === JSON.stringify(b));

    expect(isEqualColumns(propsA, propsB)).toBe(true);
  });

  // Add more test cases as needed
});
