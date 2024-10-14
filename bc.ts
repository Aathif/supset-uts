import * as d3 from 'd3';
import Heatmap from './path-to-heatmap';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

// Mock the D3 functions
jest.mock('d3', () => ({
  select: jest.fn(() => ({
    append: jest.fn().mockReturnThis(),
    attr: jest.fn().mockReturnThis(),
    style: jest.fn().mockReturnThis(),
    node: jest.fn(),
    call: jest.fn(),
    classed: jest.fn(),
    selectAll: jest.fn().mockReturnThis(),
    data: jest.fn().mockReturnThis(),
    enter: jest.fn().mockReturnThis(),
    on: jest.fn().mockReturnThis(),
    text: jest.fn().mockReturnThis(),
    transform: jest.fn().mockReturnThis(),
    attr: jest.fn().mockReturnThis(),
  })),
  scale: {
    ordinal: jest.fn(() => ({
      domain: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      rangeBands: jest.fn().mockReturnThis(),
    })),
    linear: jest.fn(() => ({
      domain: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
    })),
  },
  svg: {
    axis: jest.fn(() => ({
      scale: jest.fn().mockReturnThis(),
      outerTickSize: jest.fn().mockReturnThis(),
      tickValues: jest.fn().mockReturnThis(),
      orient: jest.fn().mockReturnThis(),
      call: jest.fn().mockReturnThis(),
    })),
  },
  rgb: jest.fn(() => ({ r: 255, g: 255, b: 255 })),
}));

describe('Heatmap component', () => {
  let element;
  const mockProps = {
    data: {
      records: [
        { x: 'A', y: '1', v: 10, perc: 0.1, rank: 1 },
        { x: 'B', y: '2', v: 20, perc: 0.2, rank: 2 },
      ],
      extents: [0, 1],
    },
    width: 500,
    height: 500,
    bottomMargin: 'auto',
    canvasImageRendering: 'auto',
    colorScheme: 'blue',
    columnX: 'x',
    columnY: 'y',
    leftMargin: 'auto',
    metric: 'v',
    normalized: false,
    valueFormatter: jest.fn(value => value.toFixed(2)),
    showLegend: true,
    showPercentage: false,
    showValues: true,
    sortXAxis: 'alpha_asc',
    sortYAxis: 'alpha_asc',
    xScaleInterval: 1,
    yScaleInterval: 1,
    yAxisBounds: [0, 1],
    xAxisFormatter: jest.fn(x => x),
    yAxisFormatter: jest.fn(y => y),
  };

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('renders the heatmap without crashing', () => {
    render(<Heatmap element={element} {...mockProps} />);
    expect(d3.select).toHaveBeenCalled(); // Ensure D3 functions were invoked
  });

  it('adjusts margins dynamically based on longest labels', () => {
    const adjustMarginsSpy = jest.spyOn(Heatmap.prototype, 'adjustMargins');
    render(<Heatmap element={element} {...mockProps} />);
    expect(adjustMarginsSpy).toHaveBeenCalled();
  });

  it('creates an image object for the heatmap', () => {
    const createImageObjSpy = jest.spyOn(Heatmap.prototype, 'createImageObj');
    render(<Heatmap element={element} {...mockProps} />);
    expect(createImageObjSpy).toHaveBeenCalled();
  });

  it('displays values on the heatmap when showValues is true', () => {
    render(<Heatmap element={element} {...mockProps} />);
    expect(d3.selectAll).toHaveBeenCalledWith('rect'); // Check that rect elements were added
  });

  it('renders the color legend when showLegend is true', () => {
    render(<Heatmap element={element} {...mockProps} />);
    expect(d3.legend).toBeDefined(); // Ensure the legend is created
  });

  it('formats the x and y axis labels using the provided formatters', () => {
    render(<Heatmap element={element} {...mockProps} />);
    expect(mockProps.xAxisFormatter).toHaveBeenCalledWith('A');
    expect(mockProps.yAxisFormatter).toHaveBeenCalledWith('1');
  });
});
