import transformProps from './path/to/your/transformProps'; // Adjust the import path as needed
import { getMetricLabel, getValueFormatter, getNumberFormatter } from '@superset-ui/core';
import moment from 'moment';
import { parseMetricValue } from './path/to/your/parseMetricValue'; // Adjust the import path as needed

// Mock dependencies
jest.mock('@superset-ui/core', () => ({
  getMetricLabel: jest.fn(),
  getValueFormatter: jest.fn(),
  getNumberFormatter: jest.fn(),
}));

jest.mock('./path/to/your/parseMetricValue'); // Adjust the import path as needed

describe('transformProps', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.resetAllMocks();
  });

  test('transforms chartProps correctly', () => {
    // Mock functions
    getMetricLabel.mockReturnValue('metric_label');
    getValueFormatter.mockReturnValue(value => `formatted_${value}`);
    getNumberFormatter.mockReturnValue(value => `${value}%`);
    parseMetricValue.mockImplementation(value => value);

    // Mock data
    const chartProps = {
      width: 800,
      height: 600,
      formData: {
        boldText: true,
        headerFontSize: 20,
        headerText: 'Header',
        metrics: ['metric'],
        yAxisFormat: '.2f',
        currencyFormat: 'USD',
        subheaderFontSize: 14,
        comparisonColorEnabled: true,
        timeComparison: 'y',
        adhocFilters: [],
        extraFormData: {},
        adhocCustom: '',
      },
      queriesData: [
        {
          data: [{ metric_label: 100 }],
        },
        {
          data: [{ metric_label: 80 }],
        },
      ],
      datasource: {
        currencyFormats: {},
        columnFormats: {},
      },
    };

    const result = transformProps(chartProps);

    // Assertions
    expect(result).toEqual({
      width: 800,
      height: 600,
      data: [{ metric_label: 100 }],
      metrics: ['metric'],
      metricName: 'metric_label',
      bigNumber: 'formatted_100',
      prevNumber: 'formatted_80',
      valueDifference: 'formatted_20',
      percentDifferenceFormattedString: '25%',
      boldText: true,
      headerFontSize: 20,
      subheaderFontSize: 14,
      headerText: 'Header',
      compType: 'Year',
      comparisonColorEnabled: true,
      percentDifferenceNumber: 0.25,
      comparatorText: ' ',
    });
  });

  test('handles empty data', () => {
    // Mock functions
    getMetricLabel.mockReturnValue('metric_label');
    getValueFormatter.mockReturnValue(value => `formatted_${value}`);
    getNumberFormatter.mockReturnValue(value => `${value}%`);
    parseMetricValue.mockImplementation(value => value);

    // Mock data
    const chartProps = {
      width: 800,
      height: 600,
      formData: {
        boldText: true,
        headerFontSize: 20,
        headerText: 'Header',
        metrics: ['metric'],
        yAxisFormat: '.2f',
        currencyFormat: 'USD',
        subheaderFontSize: 14,
        comparisonColorEnabled: true,
        timeComparison: 'y',
        adhocFilters: [],
        extraFormData: {},
        adhocCustom: '',
      },
      queriesData: [
        {
          data: [],
        },
        {
          data: [],
        },
      ],
      datasource: {
        currencyFormats: {},
        columnFormats: {},
      },
    };

    const result = transformProps(chartProps);

    // Assertions
    expect(result).toEqual({
      width: 800,
      height: 600,
      data: [],
      metrics: ['metric'],
      metricName: 'metric_label',
      bigNumber: 'formatted_0',
      prevNumber: 'formatted_0',
      valueDifference: 'formatted_0',
      percentDifferenceFormattedString: '0%',
      boldText: true,
      headerFontSize: 20,
      subheaderFontSize: 14,
      headerText: 'Header',
      compType: 'Year',
      comparisonColorEnabled: true,
      percentDifferenceNumber: 0,
      comparatorText: ' ',
    });
  });

  // Additional tests for other scenarios can be added here
});
