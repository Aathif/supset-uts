import transformProps from './transformProps'; // Adjust path as necessary

describe('transformProps', () => {
  it('should correctly transform the chartProps object', () => {
    const chartProps = {
      width: 800,
      height: 600,
      formData: {
        colorScheme: 'scheme1',
        dateTimeFormat: 'YYYY-MM-DD',
        numberFormat: '0,0',
        richTooltip: true,
        roseAreaProportion: false,
        sliceId: 'slice1',
      },
      queriesData: [
        {
          data: [
            { x: 1, y: 10 },
            { x: 2, y: 20 },
          ],
        },
      ],
    };

    const result = transformProps(chartProps);

    expect(result).toEqual({
      width: 800,
      height: 600,
      data: [
        { x: 1, y: 10 },
        { x: 2, y: 20 },
      ],
      colorScheme: 'scheme1',
      dateTimeFormat: 'YYYY-MM-DD',
      numberFormat: '0,0',
      useAreaProportions: false,
      useRichTooltip: true,
      sliceId: 'slice1',
    });
  });

  it('should handle missing formData properties', () => {
    const chartProps = {
      width: 800,
      height: 600,
      formData: {},
      queriesData: [
        {
          data: [
            { x: 1, y: 10 },
            { x: 2, y: 20 },
          ],
        },
      ],
    };

    const result = transformProps(chartProps);

    expect(result).toEqual({
      width: 800,
      height: 600,
      data: [
        { x: 1, y: 10 },
        { x: 2, y: 20 },
      ],
      colorScheme: undefined,
      dateTimeFormat: undefined,
      numberFormat: undefined,
      useAreaProportions: undefined,
      useRichTooltip: undefined,
      sliceId: undefined,
    });
  });

  it('should handle missing queriesData', () => {
    const chartProps = {
      width: 800,
      height: 600,
      formData: {
        colorScheme: 'scheme1',
        dateTimeFormat: 'YYYY-MM-DD',
        numberFormat: '0,0',
        richTooltip: true,
        roseAreaProportion: false,
        sliceId: 'slice1',
      },
      queriesData: [],
    };

    const result = transformProps(chartProps);

    expect(result).toEqual({
      width: 800,
      height: 600,
      data: undefined,
      colorScheme: 'scheme1',
      dateTimeFormat: 'YYYY-MM-DD',
      numberFormat: '0,0',
      useAreaProportions: false,
      useRichTooltip: true,
      sliceId: 'slice1',
    });
  });
});
