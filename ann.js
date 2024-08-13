// PivotData.test.js
import { PivotData } from './path/to/your/PivotData';
import PropTypes from 'prop-types';
import { getSort, naturalSort, flatKey } from './utils';

jest.mock('prop-types', () => ({
  checkPropTypes: jest.fn(),
}));

jest.mock('./utils', () => ({
  getSort: jest.fn(),
  naturalSort: jest.fn(),
  flatKey: jest.fn(),
}));

describe('PivotData', () => {
  const defaultProps = {
    data: [
      { row: 'A', col: 'X', value: 10 },
      { row: 'B', col: 'Y', value: 20 },
    ],
    rows: ['row'],
    cols: ['col'],
    aggregatorName: 'Sum',
    vals: ['value'],
    aggregatorsFactory: jest.fn(() => ({
      Sum: jest.fn(() => ({
        push: jest.fn(),
        value: jest.fn(),
        format: jest.fn(),
      })),
    })),
    sorters: null,
    rowOrder: 'key_a_to_z',
    colOrder: 'key_a_to_z',
    customFormatters: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default and input properties', () => {
    const instance = new PivotData(defaultProps);

    expect(instance.props).toEqual(expect.objectContaining(defaultProps));
    expect(PropTypes.checkPropTypes).toHaveBeenCalled();
  });

  test('should call processRecord for each record', () => {
    const instance = new PivotData(defaultProps);

    const processRecordSpy = jest.spyOn(instance, 'processRecord');
    instance.props.data.forEach(record => {
      instance.processRecord(record);
    });

    expect(processRecordSpy).toHaveBeenCalledTimes(instance.props.data.length);
  });

  test('should sort row and column keys correctly', () => {
    const instance = new PivotData(defaultProps);

    const arrSortSpy = jest.spyOn(instance, 'arrSort');
    instance.sortKeys();

    expect(arrSortSpy).toHaveBeenCalledTimes(2);
  });

  test('should return sorted row and column keys', () => {
    const instance = new PivotData(defaultProps);

    const sortedRowKeys = instance.getRowKeys();
    const sortedColKeys = instance.getColKeys();

    expect(sortedRowKeys).toEqual(instance.rowKeys);
    expect(sortedColKeys).toEqual(instance.colKeys);
  });

  test('should return the correct aggregator for given row and col keys', () => {
    const instance = new PivotData(defaultProps);

    const rowKey = ['A'];
    const colKey = ['X'];
    const aggregator = instance.getAggregator(rowKey, colKey);

    expect(aggregator).toBeDefined();
  });

  test('should handle missing row or col key in getAggregator', () => {
    const instance = new PivotData(defaultProps);

    const aggregator = instance.getAggregator([], []);
    expect(aggregator.value()).toBeNull();
    expect(aggregator.format()).toBe('');
  });

  // Additional tests can be added to cover edge cases, formatted aggregators, and subtotal logic.
});
