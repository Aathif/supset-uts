import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // for the "toBeInTheDocument" matcher
import TimeTable from './TimeTable'; // Import the component to be tested
import { scaleLinear } from 'd3-scale';

// Mock external components
jest.mock('src/components/TableView', () => () => <div>TableView Component</div>);
jest.mock('src/utils/sortNumericValues', () => jest.fn());
jest.mock('mustache', () => ({
  render: jest.fn((url, context) => `${url}?metric=${context.metric.label || context.metric.metric_name}`),
}));
jest.mock('d3-scale', () => ({
  scaleLinear: jest.fn(() => jest.fn(() => '#ca0020')), // Mock color scale
}));

describe('TimeTable Component', () => {
  const mockProps = {
    className: 'mock-class',
    height: 500,
    data: {
      '2023-01-01 00:00:00': { 'SUM(metric_value)': 100 },
      '2023-01-02 00:00:00': { 'SUM(metric_value)': 200 },
    },
    columnConfigs: [
      {
        colType: 'spark',
        key: 'SUM(metric_value)',
        label: 'Metric Value',
        timeLag: 1,
        d3format: '.2f',
        tooltip: 'Test Tooltip',
      },
    ],
    rowType: 'metric',
    rows: [{ metric_name: 'test_metric' }],
    url: '/explore',
  };

  test('renders without crashing', () => {
    render(<TimeTable {...mockProps} />);
    expect(screen.getByTestId('time-table')).toBeInTheDocument();
  });

  test('displays correct columns and rows', () => {
    render(<TimeTable {...mockProps} />);
    
    // Check that TableView is rendered
    expect(screen.getByText('TableView Component')).toBeInTheDocument();

    // Check that the column label is rendered correctly
    expect(screen.getByText('Metric Value')).toBeInTheDocument();

    // Check that the tooltip is rendered
    const tooltip = screen.getByLabelText('tt-col-0');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveAttribute('aria-label', 'tt-col-0');
  });

  test('renders sparkline cells with data', () => {
    render(<TimeTable {...mockProps} />);

    // Ensure the SparklineCell component is being rendered (mocked)
    expect(screen.getByLabelText('spark-test_metric')).toBeInTheDocument();
  });

  test('calls Mustache.render correctly for metric URL', () => {
    render(<TimeTable {...mockProps} />);

    // Check that Mustache.render has been called with the correct arguments
    expect(Mustache.render).toHaveBeenCalledWith(mockProps.url, { metric: { metric_name: 'test_metric' } });
  });

  test('applies color bounds correctly', () => {
    render(<TimeTable {...mockProps} />);

    // Ensure that the color scale is being applied based on bounds
    expect(scaleLinear).toHaveBeenCalledWith([100, 150, 200]); // Example of domain calculation
  });
});
