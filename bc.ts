import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { FastVizSwitcher } from './FastVizSwitcher';
import { FEATURED_CHARTS } from './FastVizSwitcher';
import { getChartKey } from 'src/explore/exploreUtils';

// Mock icons to avoid rendering real SVGs in tests
jest.mock('src/components/Icons', () => ({
  LineChartTile: () => <div>LineChartTile</div>,
  BarChartTile: () => <div>BarChartTile</div>,
  AreaChartTile: () => <div>AreaChartTile</div>,
  TableChartTile: () => <div>TableChartTile</div>,
  BigNumberChartTile: () => <div>BigNumberChartTile</div>,
  PieChartTile: () => <div>PieChartTile</div>,
  MonitorOutlined: () => <div>MonitorOutlined</div>,
  CheckSquareOutlined: () => <div>CheckSquareOutlined</div>,
}));

// Mock Redux and utils
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('src/explore/exploreUtils', () => ({
  getChartKey: jest.fn(),
}));

describe('FastVizSwitcher', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders featured charts', () => {
    useSelector.mockReturnValue(undefined); // No chart currently selected

    render(
      <FastVizSwitcher currentSelection={null} onChange={mockOnChange} />,
    );

    // Assert that all featured chart icons are rendered
    FEATURED_CHARTS.forEach(chart => {
      expect(screen.getByText(chart.icon.props.children)).toBeInTheDocument();
    });
  });

  it('renders the current selected chart if it is not in the featured list', () => {
    useSelector.mockReturnValue(undefined); // No chart currently rendered

    render(
      <FastVizSwitcher
        currentSelection="custom_chart"
        onChange={mockOnChange}
      />,
    );

    expect(screen.getByText('MonitorOutlined')).toBeInTheDocument();
  });

  it('renders the currently rendered chart if it is not in the featured list', () => {
    useSelector.mockReturnValue('custom_rendered_chart'); // Current chart rendered is not in featured list

    render(
      <FastVizSwitcher
        currentSelection="custom_chart"
        onChange={mockOnChange}
      />,
    );

    expect(screen.getByText('CheckSquareOutlined')).toBeInTheDocument();
  });

  it('calls onChange when a tile is clicked', () => {
    useSelector.mockReturnValue(undefined); // No chart currently selected

    render(
      <FastVizSwitcher currentSelection={null} onChange={mockOnChange} />,
    );

    // Click the first featured chart
    const firstChartTile = screen.getByText('LineChartTile');
    fireEvent.click(firstChartTile);

    expect(mockOnChange).toHaveBeenCalledWith('echarts_timeseries_line');
  });

  it('highlights the current selection', () => {
    useSelector.mockReturnValue(undefined); // No chart currently selected

    render(
      <FastVizSwitcher
        currentSelection="echarts_timeseries_line"
        onChange={mockOnChange}
      />,
    );

    // Assert that the current selection is highlighted
    const activeTile = screen.getByText('LineChartTile');
    expect(activeTile.parentElement).toHaveStyle('background-color: rgba(0,0,0,0.1)');
  });
});
