import { GeoJsonLayer } from 'deck.gl/typed';
import { getLayer } from './your-file-name';
import { hexToRGB } from '../../utils/colors';
import sandboxedEval from '../../utils/sandbox';
import { commonLayerProps } from '../common';

jest.mock('../../utils/colors', () => ({
  hexToRGB: jest.fn(),
}));

jest.mock('../../utils/sandbox', () => jest.fn());

jest.mock('../common', () => ({
  commonLayerProps: jest.fn(),
}));

describe('getLayer', () => {
  const mockFormData = {
    slice_id: 1,
    fill_color_picker: { r: 255, g: 0, b: 0, a: 1 },
    stroke_color_picker: { r: 0, g: 0, b: 255, a: 1 },
    extruded: true,
    filled: true,
    stroked: true,
    line_width: 2,
    point_radius_scale: 10,
    line_width_unit: 'pixels',
    js_data_mutator: '',
  };
  
  const mockPayload = {
    data: {
      features: [
        {
          geometry: {},
          properties: { fillColor: '#ff0000', strokeColor: '#0000ff' },
        },
      ],
      mapboxApiKey: 'test_key',
    },
  };

  const mockOnAddFilter = jest.fn();
  const mockSetTooltip = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    hexToRGB.mockImplementation(color => color); // Simplified for testing
    commonLayerProps.mockReturnValue({});
  });

  it('should return a GeoJsonLayer with correct properties', () => {
    const layer = getLayer(mockFormData, mockPayload, mockOnAddFilter, mockSetTooltip);

    expect(layer).toBeInstanceOf(GeoJsonLayer);
    expect(layer.props.id).toBe('geojson-layer-1');
    expect(layer.props.data).toEqual(mockPayload.data.features);
    expect(layer.props.extruded).toBe(true);
    expect(layer.props.filled).toBe(true);
    expect(layer.props.stroked).toBe(true);
    expect(layer.props.getLineWidth).toBe(2);
    expect(layer.props.pointRadiusScale).toBe(10);
    expect(layer.props.lineWidthUnits).toBe('pixels');
    expect(layer.props.getFillColor).toBeInstanceOf(Function);
    expect(layer.props.getLineColor).toBeInstanceOf(Function);
    expect(commonLayerProps).toHaveBeenCalled();
  });

  it('should correctly apply fillColor and strokeColor overrides', () => {
    const layer = getLayer(mockFormData, mockPayload, mockOnAddFilter, mockSetTooltip);

    const fillColor = layer.props.getFillColor(mockPayload.data.features[0]);
    const lineColor = layer.props.getLineColor(mockPayload.data.features[0]);

    expect(hexToRGB).toHaveBeenCalledWith('#ff0000');
    expect(hexToRGB).toHaveBeenCalledWith('#0000ff');
    expect(fillColor).toBe('#ff0000');
    expect(lineColor).toBe('#0000ff');
  });

  it('should apply a JavaScript data mutator if provided', () => {
    const mutator = jest.fn(data => data.slice(1));
    sandboxedEval.mockReturnValue(mutator);

    const formDataWithMutator = {
      ...mockFormData,
      js_data_mutator: 'dummy mutator',
    };

    const layer = getLayer(formDataWithMutator, mockPayload, mockOnAddFilter, mockSetTooltip);

    expect(sandboxedEval).toHaveBeenCalledWith('dummy mutator');
    expect(mutator).toHaveBeenCalledWith(expect.any(Array));
    expect(layer.props.data).toEqual(mockPayload.data.features.slice(1));
  });

  it('should handle empty or undefined data', () => {
    const emptyPayload = { data: { features: [] } };

    const layer = getLayer(mockFormData, emptyPayload, mockOnAddFilter, mockSetTooltip);

    expect(layer).toBeInstanceOf(GeoJsonLayer);
    expect(layer.props.data).toEqual([]);
  });

  it('should return a GeoJsonLayer even if optional fields are missing', () => {
    const minimalFormData = {
      slice_id: 1,
      fill_color_picker: { r: 0, g: 0, b: 0, a: 0 },
      stroke_color_picker: { r: 0, g: 0, b: 0, a: 0 },
    };

    const layer = getLayer(minimalFormData, mockPayload, mockOnAddFilter, mockSetTooltip);

    expect(layer).toBeInstanceOf(GeoJsonLayer);
    expect(layer.props.id).toBe('geojson-layer-1');
    expect(layer.props.data).toEqual(mockPayload.data.features);
  });
});
