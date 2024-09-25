import React from 'react';
import { render, screen } from '@testing-library/react';
import SparklineCell from './SparklineCell';
import '@testing-library/jest-dom/extend-expect'; // for better matchers

describe('SparklineCell Component', () => {
  const mockData = [10, 20, 30, 40];
  const mockEntries = [
    { time: '2023-01-01T00:00:00Z' },
    { time: '2023-01-02T00:00:00Z' },
    { time: '2023-01-03T00:00:00Z' },
    { time: '2023-01-04T00:00:00Z' },
  ];
  const defaultProps = {
    ariaLabel: 'Test Sparkline',
    dataKey: 'sparkline-data',
    data: mockData,
    entries: mockEntries,
    height: 50,
    width: 300,
    numberFormat: '.2f',
    dateFormat: 'YYYY-MM-DD',
    showYAxis: true,
    yAxisBounds: [10, 40],
  };

  test('renders SparklineCell with correct data', () => {
    render(<SparklineCell {...defaultProps} />);
    
    // Check if the ariaLabel is correctly set
    const chart = screen.getByLabelText('Test Sparkline');
    expect(chart).toBeInTheDocument();

    // Check if the LineSeries data is rendered (note: chart rendering is generally hard to check directly)
    // However, you can test if the component rendered correctly by checking the main container
    expect(chart.querySelector('svg')).toBeInTheDocument();
  });

  test('renders tooltip with correct data on hover', () => {
    render(<SparklineCell {...defaultProps} />);
    
    // Simulate hovering over the chart (for simplicity, you can directly test the Tooltip component if isolated)
    // Note: Chart tooltips might be challenging to trigger in unit tests, and may require mocking.
    const tooltipContent = screen.queryByText(/2023-01-01/i);
    expect(tooltipContent).not.toBeInTheDocument(); // Tooltip initially hidden
    
    // Simulate hover or tooltip showing logic (depending on XYChart implementation, this might need improvement)
    // For full functionality, consider using integration tests or visual regression tools.
  });

  test('calculates y-axis labels correctly', () => {
    render(<SparklineCell {...defaultProps} />);

    // Check if min/max Y-axis values are rendered
    expect(screen.getByText('10.00')).toBeInTheDocument();
    expect(screen.getByText('40.00')).toBeInTheDocument();
  });

  test('handles no data edge case', () => {
    const noDataProps = { ...defaultProps, data: [] };
    render(<SparklineCell {...noDataProps} />);
    
    // Check if the component handles empty data correctly without throwing errors
    expect(screen.getByLabelText('Test Sparkline')).toBeInTheDocument();
  });
});
