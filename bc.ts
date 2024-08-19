import React from 'react';
import { render } from '@testing-library/react';
import ScatterPlotGlowOverlay from './ScatterPlotGlowOverlay';
import { CanvasOverlay } from 'react-map-gl';
import roundDecimal from './utils/roundDecimal';
import luminanceFromRGB from './utils/luminanceFromRGB';

jest.mock('react-map-gl', () => ({
  CanvasOverlay: jest.fn(({ redraw }) => {
    redraw({
      width: 100,
      height: 100,
      ctx: {
        clearRect: jest.fn(),
        beginPath: jest.fn(),
        arc: jest.fn(),
        fill: jest.fn(),
        fillText: jest.fn(),
        measureText: jest.fn().mockReturnValue({ width: 10 }),
        createRadialGradient: jest.fn().mockReturnValue({
          addColorStop: jest.fn(),
        }),
      },
      project: jest.fn(lngLat => [lngLat[0] * 10, lngLat[1] * 10]),
      isDragging: false,
    });
    return <div>MockCanvasOverlay</div>;
  }),
}));

jest.mock('./utils/roundDecimal');
jest.mock('./utils/luminanceFromRGB');

describe('ScatterPlotGlowOverlay', () => {
  const defaultProps = {
    aggregation: 'sum',
    compositeOperation: 'source-over',
    dotRadius: 10,
    lngLatAccessor: location => [location[0], location[1]],
    locations: [
      {
        properties: {
          cluster: true,
          point_count: 5,
          sum: 10,
        },
        geometry: {
          coordinates: [10, 20],
        },
      },
      {
        properties: {
          cluster: false,
          metric: 3,
        },
        geometry: {
          coordinates: [30, 40],
        },
      },
    ],
    pointRadiusUnit: 'Pixels',
    renderWhileDragging: true,
    rgb: [255, 0, 0],
    zoom: 10,
  };

  beforeEach(() => {
    roundDecimal.mockImplementation((value) => value);
    luminanceFromRGB.mockImplementation(() => 100);
  });

  test('renders without crashing', () => {
    const { container } = render(<ScatterPlotGlowOverlay {...defaultProps} />);
    expect(container).toHaveTextContent('MockCanvasOverlay');
  });

  test('calls redraw with correct arguments', () => {
    render(<ScatterPlotGlowOverlay {...defaultProps} />);

    expect(CanvasOverlay).toHaveBeenCalled();
    const args = CanvasOverlay.mock.calls[0][0];
    const redrawFn = args.redraw;

    const mockContext = {
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      fillText: jest.fn(),
      measureText: jest.fn().mockReturnValue({ width: 10 }),
      createRadialGradient: jest.fn().mockReturnValue({
        addColorStop: jest.fn(),
      }),
    };

    const mockProject = jest.fn(lngLat => [lngLat[0] * 10, lngLat[1] * 10]);

    redrawFn({
      width: 100,
      height: 100,
      ctx: mockContext,
      isDragging: false,
      project: mockProject,
    });

    // Check that the drawing functions were called correctly
    expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 100, 100);
    expect(mockContext.beginPath).toHaveBeenCalled();
    expect(mockContext.arc).toHaveBeenCalled();
    expect(mockContext.fill).toHaveBeenCalled();
  });

  test('computes cluster label correctly based on aggregation', () => {
    const modifiedProps = {
      ...defaultProps,
      aggregation: 'mean',
    };
    render(<ScatterPlotGlowOverlay {...modifiedProps} />);

    expect(CanvasOverlay).toHaveBeenCalled();
    const args = CanvasOverlay.mock.calls[0][0];
    const redrawFn = args.redraw;

    const mockContext = {
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      fillText: jest.fn(),
      measureText: jest.fn().mockReturnValue({ width: 10 }),
      createRadialGradient: jest.fn().mockReturnValue({
        addColorStop: jest.fn(),
      }),
    };

    redrawFn({
      width: 100,
      height: 100,
      ctx: mockContext,
      isDragging: false,
      project: jest.fn(lngLat => [lngLat[0] * 10, lngLat[1] * 10]),
    });

    // Check that the cluster label computation works as expected
    expect(mockContext.fillText).toHaveBeenCalledWith(2, 100, 200);
  });

  test('draws text correctly based on luminance', () => {
    render(<ScatterPlotGlowOverlay {...defaultProps} />);

    expect(CanvasOverlay).toHaveBeenCalled();
    const args = CanvasOverlay.mock.calls[0][0];
    const redrawFn = args.redraw;

    const mockContext = {
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      fillText: jest.fn(),
      measureText: jest.fn().mockReturnValue({ width: 10 }),
      createRadialGradient: jest.fn().mockReturnValue({
        addColorStop: jest.fn(),
      }),
    };

    redrawFn({
      width: 100,
      height: 100,
      ctx: mockContext,
      isDragging: false,
      project: jest.fn(lngLat => [lngLat[0] * 10, lngLat[1] * 10]),
    });

    expect(mockContext.fillText).toHaveBeenCalledWith(5, 100, 200);
    expect(mockContext.fillStyle).toBe('black'); // Based on luminanceFromRGB mock
  });
});
