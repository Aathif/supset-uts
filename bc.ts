import transformProps from './transformProps';
import { getNumberFormatter, getTimeFormatterForGranularity } from '@superset-ui/core';

jest.mock('@superset-ui/core', () => ({
  getTimeFormatterForGranularity: jest.fn(),
  getNumberFormatter: jest.fn(),
  NumberFormats: {
    PERCENT_SIGNED_1_POINT: '0.1%'
  }
}));

describe('transformProps', () => {
  it('should transform chartProps correctly', () => {
    // Mock formatters
    const mockNumberFormatter = jest.fn(value => `formatted-${value}`);
    const mockTimeFormatter = jest.fn(value => `formatted-time-${value}`);

    getNumberFormatter.mockReturnValue(mockNumberFormatter);
    getTimeFormatterForGranularity.mockReturnValue(mockTimeFormatter);

    const chartProps = {
      width: 800,
      height: 600,
      queriesData: [{
        data: [
          { __timestamp: 1633024800000, value: 100 },
          { __timestamp: 1633111200000, value: 120 },
          { __timestamp: 1633197600000, value: 110 },
        ],
        from_dttm: '2021-09-30T00:00:00',
        to_dttm: '2021-10-02T00:00:00',
      }],
      formData: {
        colorPicker: { r: 255, g: 0, b: 0 },
        compareLag: 1,
        compareSuffix: '%',
        headerFontSize: 12,
        metrics: 'value',
        showTrendLine: true,
        subheader: '',
        subheaderFontSize: 10,
        timeGrainSqla: 'P1D',
        vizType: 'card_widget',
        comparator: null,
        operatorColor: null,
        cellBgColor: null,
        cellBgColor1: null,
        targetName: 'target',
        targetValue: 150,
        yAxisFormat: '0,0',
        timeRangeFixed: false,
      }
    };

    const transformedProps = transformProps(chartProps);

    expect(transformedProps).toEqual({
      width: 800,
      height: 600,
      CardWidget: 120,
      data: [
        { __timestamp: 1633024800000, value: 100 },
        { __timestamp: 1633111200000, value: 120 },
        { __timestamp: 1633197600000, value: 110 },
      ],
      CardWidgetFallback: undefined,
      className: 'positive',
      formatNumber: mockNumberFormatter,
      formatTime: mockTimeFormatter,
      headerFontSize: 12,
      subheaderFontSize: 10,
      mainColor: '#ff0000',
      showTrendLine: true,
      startYAxisAtZero: undefined,
      subheader: 'formatted-0.2000 %',
      trendLineData: [
        { x: 1633024800000, y: 100 },
        { x: 1633111200000, y: 120 },
        { x: 1633197600000, y: 110 },
      ],
      fromDatetime: '2021-09-30T00:00:00',
      toDatetime: '2021-10-02T00:00:00',
      timeRangeFixed: false,
      comparator: null,
      operatorColor: null,
      cellBgColor: null,
      cellBgColor1: null,
      targetName: 'target',
      targetValue: 150
    });

    // Check if the formatters were called correctly
    expect(getNumberFormatter).toHaveBeenCalledWith('0,0');
    expect(getTimeFormatterForGranularity).toHaveBeenCalledWith('P1D');
  });
});
