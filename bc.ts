import { select as d3Select } from 'd3-selection';
import { getSequentialSchemeRegistry } from '@superset-ui/core';
import CalHeatMap from './vendor/cal-heatmap';
import Calendar from './Calendar';

// Mock external dependencies
jest.mock('d3-selection', () => ({
  select: jest.fn(() => ({
    classed: jest.fn().mockReturnThis(),
    style: jest.fn().mockReturnThis(),
    selectAll: jest.fn(() => ({
      remove: jest.fn(),
    })),
    append: jest.fn(() => ({
      append: jest.fn(() => ({
        node: jest.fn(),
      })),
    })),
  })),
}));

jest.mock('@superset-ui/core', () => ({
  getSequentialSchemeRegistry: jest.fn(() => ({
    get: jest.fn(() => ({
      createLinearScale: jest.fn(() => jest.fn()),
    })),
  })),
  t: jest.fn(),
}));

jest.mock('./vendor/cal-heatmap', () => {
  return jest.fn().mockImplementation(() => ({
    init: jest.fn(),
  }));
});

describe('Calendar', () => {
  const props = {
    data: {
      data: {
        metric1: { 1535034236: 3, 1535034237: 5 },
      },
      domain: 'day',
      range: 1,
      start: 1535034236000,
      subdomain: 'hour',
    },
    height: 500,
    cellPadding: 3,
    cellRadius: 0,
    cellSize: 10,
    linearColorScheme: 'scheme1',
    showLegend: true,
    showMetricName: true,
    showValues: true,
    steps: 5,
    timeFormatter: jest.fn(),
    valueFormatter: jest.fn(),
    verboseMap: { metric1: 'Metric 1' },
    theme: {
      colors: {
        grayscale: {
          light5: '#f0f0f0',
        },
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render and initialize the CalHeatMap with the correct props', () => {
    const element = document.createElement('div');

    // Call the Calendar function
    Calendar(element, props);

    // Test D3 interactions
    expect(d3Select).toHaveBeenCalledWith(element);
    expect(d3Select(element).classed).toHaveBeenCalledWith('superset-legacy-chart-calendar', true);
    expect(d3Select(element).style).toHaveBeenCalledWith('height', 500);

    // Ensure CalHeatMap is initialized
    expect(CalHeatMap).toHaveBeenCalledTimes(1);

    // Ensure CalHeatMap init is called with correct parameters
    expect(CalHeatMap.mock.instances[0].init).toHaveBeenCalledWith(
      expect.objectContaining({
        start: 1535034236000,
        data: { 1535034236: 3, 1535034237: 5 },
        cellSize: 10,
        cellPadding: 3,
        cellRadius: 0,
        legendVerticalPosition: 'top',
        displayLegend: true,
      })
    );
  });

  it('should format subdomain text if showValues is true', () => {
    const element = document.createElement('div');

    // Call the Calendar function
    Calendar(element, props);

    // Ensure valueFormatter is used when showValues is true
    expect(props.valueFormatter).toHaveBeenCalledWith(3);
    expect(props.valueFormatter).toHaveBeenCalledWith(5);
  });

  it('should handle color scale from getSequentialSchemeRegistry', () => {
    const element = document.createElement('div');

    // Call the Calendar function
    Calendar(element, props);

    // Ensure color scale registry is called
    expect(getSequentialSchemeRegistry).toHaveBeenCalled();
    expect(getSequentialSchemeRegistry().get).toHaveBeenCalledWith('scheme1');
  });
});
