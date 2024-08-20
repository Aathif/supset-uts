import { GridLayer } from 'deck.gl/typed';
import { CategoricalColorNamespace } from '@superset-ui/core';
import { getLayer } from './your-file-name';
import { hexToRGB } from '../../utils/colors';
import { commonLayerProps, getAggFunc } from '../common';
import sandboxedEval from '../../utils/sandbox';

jest.mock('@superset-ui/core', () => ({
  CategoricalColorNamespace: {
    getScale: jest.fn(),
  },
}));

jest.mock('../../utils/colors', () => ({
  hexToRGB: jest.fn(),
}));

jest.mock('../../utils/sandbox', () => jest.fn());
jest.mock('../common', () => ({
  commonLayerProps: jest.fn(),
  getAggFunc: jest.fn(),
}));

describe('getLayer', () => {
  const mockFormData = {
    slice_id: 1,
    color_scheme: 'scheme',
    grid_size: 10,
    extruded: true,
    js_data_mutator: '',
    js_agg_function: '',
  };
  const mockPayload = {
    data: {
      features: [
        { position: [0, 0], weight: 1 },
        { position: [1, 1], weight: 2 },
      ],
    },
  };
  const mockColorScale = jest.fn();
  const mockOnAddFilter = jest.fn();
  const mockSetTooltip = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    CategoricalColorNamespace.getScale.mockReturnValue(mockColorScale);
    mockColorScale.range = jest.fn(() => ['#ff0000', '#00ff00']);
    hexToRGB.mockImplementation(color => color); // assuming hexToRGB is identity for simplicity
    getAggFunc.mockReturnValue(data => data.map(p => p.weight));
    commonLayerProps.mockReturnValue({});
  });

  it('should return a GridLayer with correct properties', () => {
    const layer = getLayer(mockFormData, mockPayload, mockOnAddFilter, mockSetTooltip);

    expect(layer).toBeInstanceOf(GridLayer);
    expect(layer.props.id).toBe('grid-layer-1');
    expect(layer.props.data).toEqual(mockPayload.data.features);
    expect(layer.props.cellSize).toBe(mockFormData.grid_size);
    expect(layer.props.extruded).toBe(true);
    expect(layer.props.colorRange).toEqual(['#ff0000', '#00ff00']);
    expect(layer.props.getElevationValue).toBeInstanceOf(Function);
    expect(layer.props.getColorValue).toBeInstanceOf(Function);
    expect(commonLayerProps).toHaveBeenCalled();
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
    expect(mutator).toHaveBeenCalledWith(mockPayload.data.features);
    expect(layer.props.data).toEqual(mockPayload.data.features.slice(1));
  });

  it('should correctly handle the aggregation function', () => {
    const mockAggFunc = jest.fn(data => data.reduce((sum, p) => sum + p.weight, 0));
    getAggFunc.mockReturnValue(mockAggFunc);

    const layer = getLayer(mockFormData, mockPayload, mockOnAddFilter, mockSetTooltip);

    expect(getAggFunc).toHaveBeenCalledWith(mockFormData.js_agg_function, expect.any(Function));
    expect(layer.props.getElevationValue).toBe(mockAggFunc);
    expect(layer.props.getColorValue).toBe(mockAggFunc);
  });

  it('should return a GridLayer even with empty data', () => {
    const emptyPayload = { data: { features: [] } };

    const layer = getLayer(mockFormData, emptyPayload, mockOnAddFilter, mockSetTooltip);

    expect(layer).toBeInstanceOf(GridLayer);
    expect(layer.props.data).toEqual([]);
  });

  it('should handle cases where js_data_mutator or js_agg_function is not defined', () => {
    const formDataWithoutMutator = {
      ...mockFormData,
      js_data_mutator: undefined,
      js_agg_function: undefined,
    };

    const layer = getLayer(formDataWithoutMutator, mockPayload, mockOnAddFilter, mockSetTooltip);

    expect(sandboxedEval).not.toHaveBeenCalled();
    expect(getAggFunc).toHaveBeenCalled();
    expect(layer).toBeInstanceOf(GridLayer);
  });
});
