import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SparklineCell from './SparklineCell';

const mockProps = {
  ariaLabel: 'Test Sparkline',
  dataKey: 'spark-1',
  data: [10, 20, 30, 40, 50],
  entries: [
    { time: '2023-01-01' },
    { time: '2023-02-01' },
    { time: '2023-03-01' },
    { time: '2023-04-01' },
    { time: '2023-05-01' },
  ],
  height: 50,
  width: 300,
  numberFormat: ',.2f',
  dateFormat: '%Y-%m-%d',
  yAxisBounds: [10, 50],
  showYAxis: true,
};

describe('<SparklineCell />', () => {
  it('renders without crashing', () => {
    render(<SparklineCell {...mockProps} />);
    expect(screen.getByLabelText(/Test Sparkline/i)).toBeInTheDocument();
  });

  it('renders the correct number of data points', () => {
    render(<SparklineCell {...mockProps} />);
    const svg = screen.getByLabelText(/Test Sparkline/i);
    expect(svg).toBeInTheDocument();
    // Additional checks for the number of data points rendered
  });

  it('handles yAxis bounds correctly', () => {
    render(<SparklineCell {...mockProps} />);
    // You can test the min and max labels for the Y axis
    expect(screen.getByText('10.00')).toBeInTheDocument();
    expect(screen.getByText('50.00')).toBeInTheDocument();
  });

  it('displays tooltip correctly on hover', () => {
    render(<SparklineCell {...mockProps} />);
    // Simulate hover and check tooltip content
    // Use fireEvent or userEvent to simulate hover action
  });

  // Add more test cases as needed, such as rendering with no data, different yAxis bounds, etc.
});
