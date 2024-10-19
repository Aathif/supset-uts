import { getPadding } from './transformers';
import { TIMESERIES_CONSTANTS } from '../constants';
import { getChartPadding } from './utils/chartPadding'; // Assuming this is the file where getChartPadding is implemented

jest.mock('./utils/chartPadding', () => ({
  getChartPadding: jest.fn(),
}));

describe('getPadding', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockConstants = {
    yAxisLabelTopOffset: 10,
    gridOffsetTop: 20,
    gridOffsetBottomZoomable: 30,
    gridOffsetBottom: 40,
    gridOffsetLeft: 50,
    gridOffsetRight: 60,
  };

  TIMESERIES_CONSTANTS.yAxisLabelTopOffset = mockConstants.yAxisLabelTopOffset;
  TIMESERIES_CONSTANTS.gridOffsetTop = mockConstants.gridOffsetTop;
  TIMESERIES_CONSTANTS.gridOffsetBottomZoomable = mockConstants.gridOffsetBottomZoomable;
  TIMESERIES_CONSTANTS.gridOffsetBottom = mockConstants.gridOffsetBottom;
  TIMESERIES_CONSTANTS.gridOffsetLeft = mockConstants.gridOffsetLeft;
  TIMESERIES_CONSTANTS.gridOffsetRight = mockConstants.gridOffsetRight;

  test('should return correct padding when showLegend is true and legendOrientation is Right', () => {
    const showLegend = true;
    const legendOrientation = 'Right';
    const addYAxisLabelOffset = true;
    const zoomable = true;
    const margin = {};

    getPadding(showLegend, legendOrientation, addYAxisLabelOffset, zoomable, margin);

    expect(getChartPadding).toHaveBeenCalledWith(
      showLegend,
      legendOrientation,
      margin,
      {
        top: mockConstants.gridOffsetTop + mockConstants.yAxisLabelTopOffset,
        bottom: mockConstants.gridOffsetBottomZoomable,
        left: mockConstants.gridOffsetLeft,
        right: 0, // Since legendOrientation is Right
      }
    );
  });

  test('should return correct padding when showLegend is false and zoomable is false', () => {
    const showLegend = false;
    const legendOrientation = 'Top';
    const addYAxisLabelOffset = false;
    const zoomable = false;
    const margin = {};

    getPadding(showLegend, legendOrientation, addYAxisLabelOffset, zoomable, margin);

    expect(getChartPadding).toHaveBeenCalledWith(
      showLegend,
      legendOrientation,
      margin,
      {
        top: mockConstants.gridOffsetTop,
        bottom: mockConstants.gridOffsetBottom,
        left: mockConstants.gridOffsetLeft,
        right: mockConstants.gridOffsetRight,
      }
    );
  });

  test('should return correct padding when addYAxisLabelOffset is true', () => {
    const showLegend = true;
    const legendOrientation = 'Left';
    const addYAxisLabelOffset = true;
    const zoomable = false;
    const margin = {};

    getPadding(showLegend, legendOrientation, addYAxisLabelOffset, zoomable, margin);

    expect(getChartPadding).toHaveBeenCalledWith(
      showLegend,
      legendOrientation,
      margin,
      {
        top: mockConstants.gridOffsetTop + mockConstants.yAxisLabelTopOffset,
        bottom: mockConstants.gridOffsetBottom,
        left: mockConstants.gridOffsetLeft,
        right: mockConstants.gridOffsetRight,
      }
    );
  });

  test('should return correct padding when zoomable is true', () => {
    const showLegend = false;
    const legendOrientation = 'Bottom';
    const addYAxisLabelOffset = false;
    const zoomable = true;
    const margin = {};

    getPadding(showLegend, legendOrientation, addYAxisLabelOffset, zoomable, margin);

    expect(getChartPadding).toHaveBeenCalledWith(
      showLegend,
      legendOrientation,
      margin,
      {
        top: mockConstants.gridOffsetTop,
        bottom: mockConstants.gridOffsetBottomZoomable,
        left: mockConstants.gridOffsetLeft,
        right: mockConstants.gridOffsetRight,
      }
    );
  });
});
