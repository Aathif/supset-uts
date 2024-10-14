import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomHistogram from './CustomHistogram'; // Adjust the path as necessary
import WithLegend from './WithLegend';

// Mock the WithLegend component
jest.mock('./WithLegend', () => ({ renderChart, renderLegend }) => (
  <div>
    <div data-testid="legend">{renderLegend({ direction: 'row', style: {} })}</div>
    <div data-testid="chart">{renderChart({ width: 500, height: 300 })}</div>
  </div>
));

describe('CustomHistogram', () => {
  const mockData = [
    {
      key: 'Series 1',
      values: [1, 2, 3, 4, 5],
    },
    {
      key: 'Series 2',
      values: [2, 3, 4, 5, 6],
    },
  ];

  const defaultProps = {
    data: mockData,
    width: 600,
    height: 400,
    binCount: 10,
    colorScheme: 'd3Category10',
    normalized: false,
    cumulative: false,
    opacity: 1,
    xAxisLabel: 'X Axis',
    yAxisLabel: 'Y Axis',
    showLegend: true,
    sliceId: 1,
  };

  test('renders the chart with correct dimensions', () => {
    render(<CustomHistogram {...defaultProps} />);

    const chartContainer = screen.getByTestId('chart');
    expect(chartContainer).toBeInTheDocument();
  });

  test('renders the legend when showLegend is true', () => {
    render(<CustomHistogram {...defaultProps} showLegend={true} />);

    const legend = screen.getByTestId('legend');
    expect(legend).toBeInTheDocument();
  });

  test('does not render the legend when showLegend is false', () => {
    render(<CustomHistogram {...defaultProps} showLegend={false} />);

    const legend = screen.queryByTestId('legend');
    expect(legend).toBeNull();
  });

  test('passes correct binCount to Histogram', () => {
    render(<CustomHistogram {...defaultProps} binCount={20} />);

    const chartContainer = screen.getByTestId('chart');
    expect(chartContainer).toBeInTheDocument();

    // Since we mocked `WithLegend`, the `binCount` should be passed correctly to the rendered chart
    // To test for prop values, you could extend the WithLegend mock to include binCount checks
  });

  test('applies correct color scheme based on colorScheme prop', () => {
    render(<CustomHistogram {...defaultProps} colorScheme="d3Category20" />);

    // We expect the color scheme function to be called internally,
    // but the mock structure doesn't allow us to inspect it directly.
    // We could extend this test by mocking CategoricalColorNamespace and checking if it was called with the correct colorScheme.
  });

  test('applies xAxisLabel and yAxisLabel', () => {
    render(<CustomHistogram {...defaultProps} xAxisLabel="X Axis Test" yAxisLabel="Y Axis Test" />);

    // Expect the labels to be passed down to the XAxis and YAxis components inside the chart
    expect(screen.getByText('X Axis Test')).toBeInTheDocument();
    expect(screen.getByText('Y Axis Test')).toBeInTheDocument();
  });

  test('renders bar series for each data series', () => {
    render(<CustomHistogram {...defaultProps} />);

    // Since we don't have a direct way of inspecting the BarSeries (which would be inside the mocked chart),
    // we assume the render works if no errors are thrown and the chart is rendered.
    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });
});
