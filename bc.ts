import React from 'react';
import { render } from '@testing-library/react';
import Calendar from './Calendar';
import '@testing-library/jest-dom/extend-expect';

describe('Calendar Component', () => {
  const defaultProps = {
    data: {
      data: {
        metric1: { 1535034236.0: 3, 1535034237.0: 5 },
      },
      domain: 'month',
      range: 12,
      start: Date.now(),
      subdomain: 'day',
    },
    height: 500,
    cellPadding: 3,
    cellRadius: 0,
    cellSize: 10,
    linearColorScheme: 'schemeBlues',
    showLegend: true,
    showMetricName: true,
    showValues: true,
    steps: 5,
    timeFormatter: value => value,
    valueFormatter: value => value,
    verboseMap: { metric1: 'Metric 1' },
    theme: { colors: { grayscale: { light5: '#ccc' } } },
  };

  test('renders the Calendar component with default props', () => {
    const { container } = render(<Calendar {...defaultProps} />);
    expect(container).toBeInTheDocument();
    expect(container.querySelector('.superset-legacy-chart-calendar')).toBeInTheDocument();
  });

  test('renders metric name when showMetricName is true', () => {
    const { getByText } = render(<Calendar {...defaultProps} />);
    expect(getByText('Metric: Metric 1')).toBeInTheDocument();
  });

  test('does not render metric name when showMetricName is false', () => {
    const { queryByText } = render(
      <Calendar {...defaultProps} showMetricName={false} />
    );
    expect(queryByText('Metric: Metric 1')).not.toBeInTheDocument();
  });

  test('renders the correct number of cells based on data', () => {
    const { container } = render(<Calendar {...defaultProps} />);
    // Check if the expected number of cells are rendered
    expect(container.querySelectorAll('.cal-heatmap-container .subdomain-cell').length).toBe(2);
  });

  test('renders the legend when showLegend is true', () => {
    const { container } = render(<Calendar {...defaultProps} showLegend={true} />);
    expect(container.querySelector('.cal-heatmap-container .legend')).toBeInTheDocument();
  });

  test('does not render the legend when showLegend is false', () => {
    const { container } = render(<Calendar {...defaultProps} showLegend={false} />);
    expect(container.querySelector('.cal-heatmap-container .legend')).not.toBeInTheDocument();
  });
});
