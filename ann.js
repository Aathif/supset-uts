import { getPadding } from './getPadding'; // Adjust the import path as needed
import { getChartPadding } from './path-to-getChartPadding'; // Adjust import path
import { TIMESERIES_CONSTANTS, LegendOrientation } from './constants'; // Adjust import path

// Mock the getChartPadding function and TIMESERIES_CONSTANTS
jest.mock('./path-to-getChartPadding', () => ({
  getChartPadding: jest.fn((showLegend, legendOrientation, margin, padding) => ({
    showLegend,
    legendOrientation,
    margin,
    padding,
  })),
}));

jest.mock('./constants', () => ({
  TIMESERIES_CONSTANTS: {
    yAxisLabelTopOffset: 10,
    gridOffsetTop: 20,
    gridOffsetBottomZoomable: 30,
    gridOffsetBottom: 40,
    gridOffsetLeft: 50,
    gridOffsetRight: 60,
  },
  LegendOrientation: {
    Right: 'right',
  },
}));

describe('getPadding', () => {
  it('should return padding with yAxisLabelOffset when addYAxisLabelOffset is true', () => {
    const result = getPadding(true, LegendOrientation.Right, true, false, 5);
    expect(result.padding).toEqual({
      top: TIMESERIES_CONSTANTS.gridOffsetTop + TIMESERIES_CONSTANTS.yAxisLabelTopOffset,
      bottom: TIMESERIES_CONSTANTS.gridOffsetBottom,
      left: TIMESERIES_CONSTANTS.gridOffsetLeft,
      right: 0,
    });
  });

  it('should return padding without yAxisLabelOffset when addYAxisLabelOffset is false', () => {
    const result = getPadding(true, LegendOrientation.Right, false, false, 5);
    expect(result.padding).toEqual({
      top: TIMESERIES_CONSTANTS.gridOffsetTop,
      bottom: TIMESERIES_CONSTANTS.gridOffsetBottom,
      left: TIMESERIES_CONSTANTS.gridOffsetLeft,
      right: 0,
    });
  });

  it('should return padding with zoomable bottom offset when zoomable is true', () => {
    const result = getPadding(true, LegendOrientation.Right, false, true, 5);
    expect(result.padding).toEqual({
      top: TIMESERIES_CONSTANTS.gridOffsetTop,
      bottom: TIMESERIES_CONSTANTS.gridOffsetBottomZoomable,
      left: TIMESERIES_CONSTANTS.gridOffsetLeft,
      right: 0,
    });
  });

  it('should return padding with default bottom offset when zoomable is false', () => {
    const result = getPadding(true, LegendOrientation.Right, false, false, 5);
    expect(result.padding).toEqual({
      top: TIMESERIES_CONSTANTS.gridOffsetTop,
      bottom: TIMESERIES_CONSTANTS.gridOffsetBottom,
      left: TIMESERIES_CONSTANTS.gridOffsetLeft,
      right: 0,
    });
  });

  it('should return padding with gridOffsetRight when showLegend is false', () => {
    const result = getPadding(false, LegendOrientation.Right, false, false, 5);
    expect(result.padding).toEqual({
      top: TIMESERIES_CONSTANTS.gridOffsetTop,
      bottom: TIMESERIES_CONSTANTS.gridOffsetBottom,
      left: TIMESERIES_CONSTANTS.gridOffsetLeft,
      right: TIMESERIES_CONSTANTS.gridOffsetRight,
    });
  });

  it('should return padding with gridOffsetRight when legendOrientation is not right', () => {
    const result = getPadding(true, 'left', false, false, 5);
    expect(result.padding).toEqual({
      top: TIMESERIES_CONSTANTS.gridOffsetTop,
      bottom: TIMESERIES_CONSTANTS.gridOffsetBottom,
      left: TIMESERIES_CONSTANTS.gridOffsetLeft,
      right: TIMESERIES_CONSTANTS.gridOffsetRight,
    });
  });
});
