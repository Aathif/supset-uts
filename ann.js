import React from 'react';
import { render, screen } from '@testing-library/react';
import Calendar from './Calendar';
import { getSequentialSchemeRegistry } from '@superset-ui/core';

// Mock the CalHeatMap library
jest.mock('./vendor/cal-heatmap', () => {
  return jest.fn().mockImplementation(() => {
    return { init: jest.fn() };
  });
});

// Mock the getSequentialSchemeRegistry
jest.mock('@superset-ui/core', () => ({
  ...jest.requireActual('@superset-ui/core'),
  getSequentialSchemeRegistry: jest.fn(),
}));

describe('Calendar Component', () => {
  const mockProps = {
    data: {
      data: {
        metric1: {
          1535034236.0: 3,
          1535120636.0: 5,
        },
      },
      start: 1535034236000,
      domain: 'month',
      range: 3,
      subdomain: 'day',
    },
    height: 400,
    cellSize: 15,
    cellPadding: 2,
    cellRadius: 1,
    linearColorScheme: 'schemeRdYlBu',
    showLegend: true,
    showMetricName: true,
    showValues: true,
    steps: 5,
    timeFormatter: date => date.toISOString(),
    valueFormatter: value => `${value} units`,
    verboseMap: { metric1: 'Metric One' },
    theme: { colors: { grayscale: { light5: '#f2f2f2' } } },
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock the getSequentialSchemeRegistry return value
    getSequentialSchemeRegistry.mockReturnValue({
      get: jest.fn().mockReturnValue({
        createLinearScale: jest.fn().mockReturnValue(jest.fn()),
      }),
    });
  });

  test('renders without crashing', () => {
    render(<Calendar {...mockProps} />);
    expect(screen.getByText('Metric: Metric One')).toBeInTheDocument();
  });

  test('renders correct number of calendars based on metrics', () => {
    const propsWithMultipleMetrics = {
      ...mockProps,
      data: {
        ...mockProps.data,
        data: {
          ...mockProps.data.data,
          metric2: {
            1535034236.0: 2,
            1535120636.0: 4,
          },
        },
      },
      verboseMap: { ...mockProps.verboseMap, metric2: 'Metric Two' },
    };

    render(<Calendar {...propsWithMultipleMetrics} />);
    expect(screen.getByText('Metric: Metric One')).toBeInTheDocument();
    expect(screen.getByText('Metric: Metric Two')).toBeInTheDocument();
  });

  test('does not show metric name when showMetricName is false', () => {
    const propsWithoutMetricName = {
      ...mockProps,
      showMetricName: false,
    };

    render(<Calendar {...propsWithoutMetricName} />);
    expect(screen.queryByText('Metric: Metric One')).not.toBeInTheDocument();
  });

  test('calls CalHeatMap init with correct parameters', () => {
    render(<Calendar {...mockProps} />);

    const CalHeatMap = require('./vendor/cal-heatmap');
    const calHeatMapInstance = CalHeatMap.mock.instances[0];
    
    expect(calHeatMapInstance.init).toHaveBeenCalledWith(expect.objectContaining({
      start: mockProps.data.start,
      data: mockProps.data.data.metric1,
      cellSize: mockProps.cellSize,
      cellPadding: mockProps.cellPadding,
      cellRadius: mockProps.cellRadius,
      domain: mockProps.data.domain,
      subDomain: mockProps.data.subdomain,
      range: mockProps.data.range,
      displayLegend: mockProps.showLegend,
      valueFormatter: mockProps.valueFormatter,
      timeFormatter: mockProps.timeFormatter,
    }));
  });

  test('uses correct color scale', () => {
    render(<Calendar {...mockProps} />);

    expect(getSequentialSchemeRegistry).toHaveBeenCalled();
    const getSequentialScheme = getSequentialSchemeRegistry().get;
    expect(getSequentialScheme).toHaveBeenCalledWith(mockProps.linearColorScheme);
    expect(getSequentialScheme().createLinearScale).toHaveBeenCalled();
  });
});
