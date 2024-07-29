import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Calendar from './path_to_your_Calendar_component';
import { getSequentialSchemeRegistry } from '@superset-ui/core';

jest.mock('d3-selection', () => ({
  select: jest.fn(() => ({
    classed: jest.fn().mockReturnThis(),
    style: jest.fn().mockReturnThis(),
    selectAll: jest.fn(() => ({
      remove: jest.fn(),
    })),
    append: jest.fn(() => ({
      text: jest.fn(),
      node: jest.fn(),
    })),
  })),
}));

jest.mock('@superset-ui/core', () => ({
  getSequentialSchemeRegistry: jest.fn(() => ({
    get: jest.fn(() => ({
      createLinearScale: jest.fn(() => jest.fn()),
    })),
  })),
  t: jest.fn(str => str),
}));

jest.mock('./vendor/cal-heatmap', () => jest.fn(() => ({
  init: jest.fn(),
})));

describe('Calendar Component', () => {
  const props = {
    data: {
      data: {
        metric1: { 1535034236.0: 3 },
        metric2: { 1535034236.0: 5 },
      },
      domain: 'month',
      range: 12,
      start: 1627815600000,
      subdomain: 'day',
    },
    height: 500,
    cellPadding: 3,
    cellRadius: 0,
    cellSize: 10,
    linearColorScheme: 'schemeBlues',
    showLegend: true,
    showMetricName: true,
    showValues: false,
    steps: 5,
    timeFormatter: jest.fn(),
    valueFormatter: jest.fn(),
    verboseMap: {
      metric1: 'Metric 1',
      metric2: 'Metric 2',
    },
    theme: {
      colors: {
        grayscale: {
          light5: '#f0f0f0',
        },
      },
    },
  };

  it('should render the container with correct class and height', () => {
    const { container } = render(<Calendar {...props} />);
    expect(container.firstChild).toHaveClass('superset-legacy-chart-calendar');
    expect(container.firstChild).toHaveStyle('height: 500px');
  });

  it('should call the heatmap init method with correct arguments', () => {
    render(<Calendar {...props} />);
    expect(CalHeatMap).toHaveBeenCalledTimes(2); // Assuming two metrics
  });

  it('should display metric names if showMetricName is true', () => {
    const { getByText } = render(<Calendar {...props} />);
    expect(getByText('Metric: Metric 1')).toBeInTheDocument();
    expect(getByText('Metric: Metric 2')).toBeInTheDocument();
  });

  it('should not display metric names if showMetricName is false', () => {
    const newProps = { ...props, showMetricName: false };
    const { queryByText } = render(<Calendar {...newProps} />);
    expect(queryByText('Metric: Metric 1')).not.toBeInTheDocument();
    expect(queryByText('Metric: Metric 2')).not.toBeInTheDocument();
  });
});
