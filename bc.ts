import { AdhocFilter, isSimpleAdhocFilter, isFreeFormAdhocFilter } from '@superset-ui/core';
import { translateToSql, OPERATORS_TO_SQL } from './translateToSql';
import { Operators } from 'src/explore/constants';
import { getSimpleSQLExpression } from 'src/explore/exploreUtils';

jest.mock('src/explore/exploreUtils', () => ({
  getSimpleSQLExpression: jest.fn(),
}));

describe('translateToSql', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should translate a simple AdhocFilter into a SQL expression', () => {
    const simpleFilter: AdhocFilter = {
      subject: 'age',
      operator: '>=',
      comparator: 18,
    };

    (getSimpleSQLExpression as jest.Mock).mockReturnValue(
      `"age" >= 18`,
    );

    const result = translateToSql(simpleFilter);

    expect(isSimpleAdhocFilter(simpleFilter)).toBe(true);
    expect(getSimpleSQLExpression).toHaveBeenCalledWith('age', '>=', 18);
    expect(result).toEqual('"age" >= 18');
  });

  it('should translate a simple AdhocFilter with LATEST PARTITION into a SQL expression', () => {
    const latestPartitionFilter: AdhocFilter = {
      subject: 'partition_column',
      operator: 'LATEST PARTITION',
      datasource: {
        schema: 'schema1',
        datasource_name: 'table1',
      },
    };

    const result = translateToSql(latestPartitionFilter);

    expect(result).toEqual(
      `= '{{ presto.latest_partition('schema1.table1') }}'`,
    );
  });

  it('should return a free form SQL expression when AdhocFilter is free form', () => {
    const freeFormFilter: AdhocFilter = {
      sqlExpression: "state = 'CA'",
    };

    const result = translateToSql(freeFormFilter);

    expect(isFreeFormAdhocFilter(freeFormFilter)).toBe(true);
    expect(result).toEqual("state = 'CA'");
  });

  it('should return an empty string when AdhocFilter is neither simple nor free form', () => {
    const emptyFilter: AdhocFilter = {
      subject: '',
      operator: '',
    };

    const result = translateToSql(emptyFilter);

    expect(result).toEqual('');
  });

  it('should translate with `useSimple` set to true even if the filter is not simple', () => {
    const simpleFilter: AdhocFilter = {
      subject: 'age',
      operator: '>=',
      comparator: 18,
    };

    (getSimpleSQLExpression as jest.Mock).mockReturnValue(
      `"age" >= 18`,
    );

    const result = translateToSql(simpleFilter, { useSimple: true });

    expect(getSimpleSQLExpression).toHaveBeenCalledWith('age', '>=', 18);
    expect(result).toEqual('"age" >= 18');
  });
});
