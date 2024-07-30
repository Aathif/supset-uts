
export function getPadding(showLegend, legendOrientation, addYAxisLabelOffset, zoomable, margin) {
  const yAxisOffset = addYAxisLabelOffset ? TIMESERIES_CONSTANTS.yAxisLabelTopOffset : 0;
  return getChartPadding(showLegend, legendOrientation, margin, {
    top: TIMESERIES_CONSTANTS.gridOffsetTop + yAxisOffset,
    bottom: zoomable ? TIMESERIES_CONSTANTS.gridOffsetBottomZoomable : TIMESERIES_CONSTANTS.gridOffsetBottom,
    left: TIMESERIES_CONSTANTS.gridOffsetLeft,
    right: showLegend && legendOrientation === LegendOrientation.Right ? 0 : TIMESERIES_CONSTANTS.gridOffsetRight
  });
}
