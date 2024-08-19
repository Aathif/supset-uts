import transformProps from './transformProps';
import supercluster from 'supercluster';
import { DEFAULT_POINT_RADIUS, DEFAULT_MAX_ZOOM } from './MapBox';

jest.mock('supercluster');

describe('transformProps', () => {
  const defaultChartProps = {
    width: 800,
    height: 600,
    formData: {
      clusteringRadius: 40,
      globalOpacity: 0.8,
      mapboxColor: 'rgb(255, 0, 0)',
      mapboxStyle: 'mapbox://styles/mapbox/light-v10',
      pandasAggfunc: 'sum',
      pointRadius: 'Auto',
      pointRadiusUnit: 'Pixels',
      renderWhileDragging: true,
    },
    hooks: {
      onError: jest.fn(),
      setControlValue: jest.fn(),
    },
    queriesData: [
      {
        data: {
          bounds: [[-73.9876, 40.7661], [-73.9397, 40.8002]],
          geoJSON: {
            type: 'FeatureCollection',
            features: [],
          },
          hasCustomMetric: false,
          mapboxApiKey: 'your-mapbox-api-key',
        },
      },
    ],
  };

  beforeEach(() => {
    supercluster.mockClear();
  });

  test('returns expected props when valid inputs are provided', () => {
    const result = transformProps(defaultChartProps);

    expect(result.width).toBe(800);
    expect(result.height).toBe(600);
    expect(result.aggregatorName).toBe('sum');
    expect(result.bounds).toEqual([[-73.9876, 40.7661], [-73.9397, 40.8002]]);
    expect(result.globalOpacity).toBe(0.8);
    expect(result.hasCustomMetric).toBe(false);
    expect(result.mapboxApiKey).toBe('your-mapbox-api-key');
    expect(result.mapStyle).toBe('mapbox://styles/mapbox/light-v10');
    expect(result.pointRadius).toBe(DEFAULT_POINT_RADIUS);
    expect(result.pointRadiusUnit).toBe('Pixels');
    expect(result.renderWhileDragging).toBe(true);
    expect(result.rgb).toEqual(['255', '0', '0']);
  });

  test('calls onError when mapboxColor is invalid', () => {
    const chartProps = {
      ...defaultChartProps,
      formData: {
        ...defaultChartProps.formData,
        mapboxColor: 'invalid-color',
      },
    };

    const result = transformProps(chartProps);
    expect(chartProps.hooks.onError).toHaveBeenCalledWith("Color field must be of form 'rgb(%d, %d, %d)'");
    expect(result).toEqual({});
  });

  test('returns custom metric settings when hasCustomMetric is true', () => {
    const chartProps = {
      ...defaultChartProps,
      queriesData: [
        {
          data: {
            ...defaultChartProps.queriesData[0].data,
            hasCustomMetric: true,
          },
        },
      ],
    };

    const result = transformProps(chartProps);

    expect(result.clusterer).toBeDefined();
    expect(supercluster).toHaveBeenCalledWith({
      maxZoom: DEFAULT_MAX_ZOOM,
      radius: 40,
      initial: expect.any(Function),
      map: expect.any(Function),
      reduce: expect.any(Function),
    });
  });

  test('returns pointRadius as specified when not "Auto"', () => {
    const chartProps = {
      ...defaultChartProps,
      formData: {
        ...defaultChartProps.formData,
        pointRadius: 15,
      },
    };

    const result = transformProps(chartProps);
    expect(result.pointRadius).toBe(15);
  });

  test('handles onViewportChange and calls setControlValue', () => {
    const result = transformProps(defaultChartProps);
    const onViewportChange = result.onViewportChange;

    onViewportChange({ latitude: 40.7128, longitude: -74.0060, zoom: 12 });

    expect(defaultChartProps.hooks.setControlValue
