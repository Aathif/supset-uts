import transformProps from './path-to-your-transformProps'; // Adjust the import path as necessary

describe('transformProps', () => {
  it('should transform chartProps correctly', () => {
    const chartProps = {
      height: 400,
      datasource: {
        columnFormats: { column1: '.2f', column2: '.3s' },
        verboseMap: { 'value1': 'Value 1', 'value2': 'Value 2' },
      },
      formData: {
        timeGrainSqla: 'P1D',
        groupby: ['column1'],
        columns: ['column1', 'column2'],
        numberFormat: '.2f',
        dateFormat: 'MM/DD/YYYY',
        customizeBgCondition: true,
        cellBgColor: '#ff0000',
        pageLength: 10,
        includeSearch: false,
        colsToHide: ['column2'],
        orderByCols: ['column1'],
      },
      queriesData: [
        {
          data: [
            { column1: 100, column2: 'data1' },
            { column1: 200, column2: 'data2' },
          ],
        },
      ],
    };

    const expectedOutput = {
      columnFormats: { column1: '.2f', column2: '.3s' },
      data: [
        { column1: 100, column2: 'data1' },
        { column1: 200, column2: 'data2' },
      ],
      dateFormat: 'MM/DD/YYYY',
      granularity: 'P1D',
      height: 400,
      numberFormat: '.2f',
      numGroups: 1, // Since groupby has one item
      verboseMap: { 'value1': 'Value 1', 'value2': 'Value 2' },
      customizeBgCondition: true,
      cellBgColor: '#ff0000',
      pageLength: 10,
      includeSearch: false,
      groupby: ['column1'],
      columns: ['column1', 'column2'],
      colsToHide: ['column2'],
      orderByCols: ['column1'],
    };

    const result = transformProps(chartProps);
    expect(result).toEqual(expectedOutput);
  });

  it('should handle empty datasource and formData', () => {
    const chartProps = {
      height: 400,
      datasource: {
        columnFormats: {},
        verboseMap: {},
      },
      formData: {
        timeGrainSqla: '',
        groupby: [],
        columns: [],
        numberFormat: '',
        dateFormat: '',
        customizeBgCondition: false,
        cellBgColor: '',
        pageLength: 0,
        includeSearch: false,
        colsToHide: [],
        orderByCols: [],
      },
      queriesData: [
        {
          data: [],
        },
      ],
    };

    const expectedOutput = {
      columnFormats: {},
      data: [],
      dateFormat: '',
      granularity: '',
      height: 400,
      numberFormat: '',
      numGroups: 0,
      verboseMap: {},
      customizeBgCondition: false,
      cellBgColor: '',
      pageLength: 0,
      includeSearch: false,
      groupby: [],
      columns: [],
      colsToHide: [],
      orderByCols: [],
    };

    const result = transformProps(chartProps);
    expect(result).toEqual(expectedOutput);
  });
});
