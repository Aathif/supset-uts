import { getNumberFormatter } from '@superset-ui/core';
import { getFormattedUTCTime } from './utils';
import transformProps from './transformProps';

jest.mock('@superset-ui/core', () => ({
  getNumberFormatter: jest.fn(),
}));

jest.mock('./utils', () => ({
  getFormattedUTCTime: jest.fn(),
}));

describe('transformProps', () => {
  it('should transform chartProps correctly', () => {
    const mockGetNumberFormatter = jest.fn(value => value);
    getNumberFormatter.mockImplementation(() => mockGetNumberFormatter);

    const mockGetFormattedUTCTime = jest.fn((ts, format) => `${ts}-${format}`);
    getFormattedUTCTime.mockImplementation(mockGetFormattedUTCTime);

    const chartProps = {
      height: 400,
      formData: {
        cellPadding: 3,
        cellRadius: 0,
        cellSize: 10,
        domainGranularity: 'month',
        linearColorScheme: 'schemeBlues',
        showLegend: true,
        showMetricName: true,
        showValues: false,
        steps: 5,
        subdomainGranularity: 'day',
        xAxisTimeFormat: 'YYYY-MM-DD',
        yAxisFormat: '.2f',
      },
      queriesData: [
        {
          data: {
            data: { metric1: { 1535034236.0: 3 }, metric2: { 1535034236.0: 5 } },
            domain: 'month',
            range: 12,
            start: 1627815600000,
            subdomain: 'day',
          },
        },
      ],
      datasource: {
        verboseMap: {
          metric1: 'Metric 1',
          metric2: 'Metric 2',
        },
      },
    };

    const expectedTransformedProps = {
      height: 400,
      data: {
        data: { metric1: { 1535034236.0: 3 }, metric2: { 1535034236.0: 5 } },
        domain: 'month',
        range: 12,
        start: 1627815600000,
        subdomain: 'day',
      },
      cellPadding: 3,
      cellRadius: 0,
      cellSize: 10,
      domainGranularity: 'month',
      linearColorScheme: 'schemeBlues',
      showLegend: true,
      showMetricName: true,
      showValues: false,
      steps: 5,
      subdomainGranularity: 'day',
      timeFormatter: expect.any(Function),
      valueFormatter: expect.any(Function),
      verboseMap: {
        metric1: 'Metric 1',
        metric2: 'Metric 2',
      },
    };

    const result = transformProps(chartProps);

    expect(result).toMatchObject(expectedTransformedProps);

    // Check if timeFormatter and valueFormatter work correctly
    const timeFormatter = result.timeFormatter;
    const valueFormatter = result.valueFormatter;

    expect(timeFormatter(1535034236000)).toBe('1535034236000-YYYY-MM-DD');
    expect(mockGetFormattedUTCTime).toHaveBeenCalledWith(1535034236000, 'YYYY-MM-DD');

    expect(valueFormatter('.2f')).toBe('.2f');
    expect(mockGetNumberFormatter).toHaveBeenCalledWith('.2f');
  });
});
