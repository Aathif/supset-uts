import React from 'react';
import { render, screen } from '@testing-library/react';
import WithLegend from './WithLegend'; // Adjust this path based on your project structure
import '@testing-library/jest-dom';

// Mock the ParentSize from '@vx/responsive' to return a default width and height
jest.mock('@vx/responsive', () => ({
  ParentSize: ({ children }) => children({ width: 500, height: 300 }),
}));

describe('WithLegend component', () => {
  const mockRenderChart = jest.fn();
  const mockRenderLegend = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    mockRenderChart.mockClear();
    mockRenderLegend.mockClear();
  });

  test('renders the chart and legend', () => {
    render(
      <WithLegend
        renderChart={mockRenderChart}
        renderLegend={mockRenderLegend}
      />
    );

    // Check that the chart and legend rendering functions are called
    expect(mockRenderChart).toHaveBeenCalled();
    expect(mockRenderLegend).toHaveBeenCalled();
  });

  test('handles legend positioning (top)', () => {
    render(
      <WithLegend
        position="top"
        renderChart={mockRenderChart}
        renderLegend={mockRenderLegend}
      />
    );

    // The parent element should have 'flex-direction: column' when legend is on top
    const container = screen.getByRole('figure');
    expect(container).toHaveStyle('flex-direction: column');
  });

  test('handles legend positioning (left)', () => {
    render(
      <WithLegend
        position="left"
        renderChart={mockRenderChart}
        renderLegend={mockRenderLegend}
      />
    );

    // The parent element should have 'flex-direction: row' when legend is on the left
    const container = screen.getByRole('figure');
    expect(container).toHaveStyle('flex-direction: row');
  });

  test('respects the legendJustifyContent prop', () => {
    render(
      <WithLegend
        legendJustifyContent="flex-start"
        renderChart={mockRenderChart}
        renderLegend={mockRenderLegend}
      />
    );

    // Check the legend container's style for justifyContent
    const legendContainer = screen.getByText(/legend/i).parentNode;
    expect(legendContainer).toHaveStyle('justify-content: flex-start');
  });

  test('only renders chart when parent size is non-zero', () => {
    render(
      <WithLegend
        renderChart={mockRenderChart}
        renderLegend={mockRenderLegend}
      />
    );

    // Ensure that renderChart is called since the parent size mock returns non-zero width/height
    expect(mockRenderChart).toHaveBeenCalled();
  });

  test('applies custom className when provided', () => {
    const { container } = render(
      <WithLegend
        className="custom-class"
        renderChart={mockRenderChart}
        renderLegend={mockRenderLegend}
      />
    );

    // Check that the custom class is applied
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
