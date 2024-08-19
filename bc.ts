import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import MapBox from './MapBox';
import ScatterPlotGlowOverlay from './ScatterPlotGlowOverlay';
import MapGL from 'react-map-gl';
import ViewportMercator from 'viewport-mercator-project';

jest.mock('react-map-gl', () => jest.fn((props) => <div>{props.children}</div>));
jest.mock('./ScatterPlotGlowOverlay', () => jest.fn(() => <div>MockScatterPlotGlowOverlay</div>));

describe('MapBox Component', () => {
  const defaultProps = {
    width: 800,
    height: 600,
    aggregatorName: 'sum',
    clusterer: {
      getClusters: jest.fn(() => [
        {
          geometry: {
            coordinates: [10, 20],
          },
          properties: {
            cluster: true,
            point_count: 5,
          },
        },
        {
          geometry: {
            coordinates: [30, 40],
          },
          properties: {
            cluster: false,
            point_count: 3,
          },
        },
      ]),
    },
    globalOpacity: 0.8,
    hasCustomMetric: false,
    mapStyle: 'mapbox://styles/mapbox/streets-v11',
    mapboxApiKey: 'your-mapbox-api-key',
    onViewportChange: jest.fn(),
    pointRadius: 50,
    pointRadiusUnit: 'Pixels',
    renderWhileDragging: true,
    rgb: [255, 0, 0],
    bounds: [
      [-73.9876, 40.7661],
      [-73.9397, 40.8002],
    ],
  };

  beforeEach(() => {
    ViewportMercator.prototype.fitBounds = jest.fn().mockReturnValue({
      latitude: 40.7831,
      longitude: -73.9712,
      zoom: 12,
    });
  });

  test('renders without crashing', () => {
    const { container } = render(<MapBox {...defaultProps} />);
    expect(container).toHaveTextContent('MockScatterPlotGlowOverlay');
  });

  test('initializes viewport based on bounds', () => {
    const { container } = render(<MapBox {...defaultProps} />);
    expect(ViewportMercator.prototype.fitBounds).toHaveBeenCalledWith([
      [-73.9876, 40.7661],
      [-73.9397, 40.8002],
    ]);
    expect(container).toHaveTextContent('MockScatterPlotGlowOverlay');
  });

  test('handles viewport change', () => {
    const { getByText } = render(<MapBox {...defaultProps} />);
    const mockNewViewport = {
      longitude: -73.9551,
      latitude: 40.7762,
      zoom: 14,
    };
    fireEvent.change(getByText('MockScatterPlotGlowOverlay'), {
      target: { value: mockNewViewport },
    });
    expect(defaultProps.onViewportChange).toHaveBeenCalledWith(mockNewViewport);
  });

  test('calls getClusters with correct parameters', () => {
    render(<MapBox {...defaultProps} />);
    expect(defaultProps.clusterer.getClusters).toHaveBeenCalledWith(
      expect.any(Array),
      12 // The zoom level is mocked in fitBounds as 12
    );
  });

  test('renders MapGL and ScatterPlotGlowOverlay with correct props', () => {
    render(<MapBox {...defaultProps} />);

    expect(MapGL).toHaveBeenCalledWith(
      expect.objectContaining({
        mapStyle: 'mapbox://styles/mapbox/streets-v11',
        width: 800,
        height: 600,
        mapboxApiAccessToken: 'your-mapbox-api-key',
      }),
      expect.anything()
    );

    expect(ScatterPlotGlowOverlay).toHaveBeenCalledWith(
      expect.objectContaining({
        isDragging: false,
        locations: expect.any(Array),
        dotRadius: 50,
        pointRadiusUnit: 'Pixels',
        rgb: [255, 0, 0],
        globalOpacity: 0.8,
        compositeOperation: 'screen',
        renderWhileDragging: true,
        aggregation: null, // hasCustomMetric is false, so aggregation should be null
      }),
      expect.anything()
    );
  });
});
