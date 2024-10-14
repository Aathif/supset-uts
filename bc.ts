import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Provides custom matchers
import HorizonChart from './HorizonChart';
import HorizonRow from './HorizonRow';

// Mock the HorizonRow component since we are testing HorizonChart
jest.mock('./HorizonRow', () => () => <div data-testid="horizon-row" />);

describe('HorizonChart', () => {
  const mockData = [
    {
      key: ['Series 1'],
      values: [{ y: 10 }, { y: 20 }],
    },
    {
      key: ['Series 2'],
      values: [{ y: 15 }, { y: 25 }],
    },
  ];

  const defaultProps = {
    className: 'test-class',
    width: 800,
    height: 600,
    seriesHeight: 20,
    data: mockData,
    bands: 3,
    colors: ['#ff0000', '#00ff00', '#0000ff'],
    colorScale: 'series',
    mode: 'offset',
    offsetX: 0,
  };

  it('renders HorizonChart component with correct number of rows', () => {
    render(<HorizonChart {...defaultProps} />);

    // Assert that the container is in the document
    const chartContainer = screen.getByClassName('superset-legacy-chart-horizon');
    expect(chartContainer).toBeInTheDocument();

    // Ensure HorizonRow is rendered for each data row
    const rows = screen.getAllByTestId('horizon-row');
    expect(rows.length).toBe(2); // 2 rows for mockData
  });

  it('renders with proper styling based on props', () => {
    render(<HorizonChart {...defaultProps} />);
    
    const chartContainer = screen.getByClassName('superset-legacy-chart-horizon');
    
    // Check if the height is set properly
    expect(chartContainer).toHaveStyle(`height: ${defaultProps.height}px`);
    
    // Check if the custom className is applied
    expect(chartContainer).toHaveClass(defaultProps.className);
  });

  it('renders correctly when colorScale is overall', () => {
    const updatedProps = { ...defaultProps, colorScale: 'overall' };
    render(<HorizonChart {...updatedProps} />);
    
    // HorizonRows should still render even when colorScale is overall
    const rows = screen.getAllByTestId('horizon-row');
    expect(rows.length).toBe(2);
  });

  it('renders with different seriesHeight for each row', () => {
    const updatedProps = { ...defaultProps, seriesHeight: 40 };
    render(<HorizonChart {...updatedProps} />);

    // Ensure HorizonRow is rendered with the correct height
    const rows = screen.getAllByTestId('horizon-row');
    rows.forEach(row => {
      expect(row).toHaveStyle(`height: ${updatedProps.seriesHeight}px`);
    });
  });

  it('renders empty component when data is empty', () => {
    render(<HorizonChart {...defaultProps} data={[]} />);

    const rows = screen.queryByTestId('horizon-row');
    expect(rows).toBeNull(); // No rows should be rendered when data is empty
  });
});
