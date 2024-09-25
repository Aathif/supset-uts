
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CartesianGrid, ComposedChart as RechartsComposedChart, Legend, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts';
import { styled } from '@superset-ui/core';
import ComposedChartTooltip from './ComposedChartTooltip';
import { Layout, LegendPosition, NORM_SPACE, ChartType } from './types';
import { debounce, getResultColor, isStackedBar, Z_SEPARATOR } from './utils';
import { getCartesianGridProps, getLegendProps, getXAxisProps, getYAxisProps, renderChartElement } from './chartUtils';
import { useCurrentData, useDataPreparation, useZAxisRange } from './state';
import ScatterChartTooltip from './ScatterChartTooltip';
const Breadcrumb = styled.div`
  display: flex;
`;
const StyledLink = styled.div`
  cursor: pointer;
  color: #4b31af;
  padding-right: 5px;
  &:not(:last-child):after {
    color: black;
    content: ' / ';
  }
`;
const Styles = styled.div`
  position: relative;
  height: ${({
  height
}) => height}px;
  width: ${({
  width
}) => width}px;
  overflow: auto;

  .recharts-cartesian-axis-tick-line {
    display: none;
  }

  .recharts-bar-rectangle {
    ${({
  isClickable
}) => isClickable && 'cursor: pointer'};
  }

  .recharts-legend-item {
    cursor: pointer;
    white-space: nowrap;
  }
`;

const ComposedChart = props => {
  var _rootRef$current, _rootRef$current$quer, _rootRef$current2, _rootRef$current2$que, _rootRef$current3, _rootRef$current3$que, _drillDown$deepness$m, _drillDown$deepness, _yAxis$tickLabelAngle, _yAxis$labelAngle, _y2Axis$tickLabelAngl, _y2Axis$labelAngle;

  const {
    data: initData,
    height,
    width,
    layout,
    yColumns: initYColumns,
    chartType,
    xAxis,
    chartSubType,
    yAxis,
    isAnimationActive,
    labelsColor,
    y2Axis,
    numbersFormat,
    timeFormat,
    timeFormatDay,
    timeFormatWeek,
    timeFormatMonth,
    legend,
    yColumnsMeta,
    hasTimeSeries,
    xColumns,
    bubbleChart,
    colorSchemes = {},
    handleChartClick,
    handleChartDoubleClick,
    drillDown,
    emitFilterControl,
    normChart,
    columnNames,
    timeRangeValue,
    timeRangeValuechart,
    timeRangeFormat,
    timeRangeFormatDashbord,
    barChart = {},
    chartFormat,
    useCustomMetricEnabled,
    emitCrossFilters,
  } = props;

  const {
    breakdowns,
    yColumns,
    data
  } = useDataPreparation({
    columnNames,
    yColumns: initYColumns,
    yColumnsMeta,
    data: initData,
    numbersFormat,
    timeFormat,
    timeFormatDay,
    timeFormatWeek,
    timeFormatMonth,
    hasTimeSeries,
    xColumns,
    normChart,
    timeRangeValue,
    timeRangeValuechart,
    timeRangeFormat,
    timeRangeFormatDashbord,
    hiddenTickLabels: xAxis.hiddenTickLabels,
    zDimension: bubbleChart.zDimension,
    chartType
  });
  let resultColors = {};
  breakdowns.forEach(b => {
    resultColors = { ...resultColors,
      ...getResultColor(b, colorSchemes, resultColors)
    };
  });
  const {
    yColumnSortingType,
    hasTotals = false,
    minBarWidth,
    stickyScatters
  } = barChart;
  const [disabledDataKeys, setDisabledDataKeys] = useState([]);
  const [updater, setUpdater] = useState(0);
  const [visible, setVisible] = useState(false);
  const [barsUIPositions, setBarsUIPositions] = useState({});
  const barsUIPositionsRef = useRef({});
  const [resetProps, setResetProps] = useState({});
  const rootRef = useRef(null);
  const forceUpdate = useCallback(() => setUpdater(Math.random()), []);
  const xAxisClientRect = (_rootRef$current = rootRef.current) === null || _rootRef$current === void 0 ? void 0 : (_rootRef$current$quer = _rootRef$current.querySelector('.xAxis .recharts-cartesian-axis-ticks')) === null || _rootRef$current$quer === void 0 ? void 0 : _rootRef$current$quer.getBoundingClientRect();
  const xAxisHeight = Math.ceil((xAxisClientRect === null || xAxisClientRect === void 0 ? void 0 : xAxisClientRect.height) || 1);
  const xAxisWidth = Math.ceil((xAxisClientRect === null || xAxisClientRect === void 0 ? void 0 : xAxisClientRect.width) || 1);
  const yAxisClientRect = (_rootRef$current2 = rootRef.current) === null || _rootRef$current2 === void 0 ? void 0 : (_rootRef$current2$que = _rootRef$current2.querySelector('.yAxis .recharts-cartesian-axis-ticks')) === null || _rootRef$current2$que === void 0 ? void 0 : _rootRef$current2$que.getBoundingClientRect();
  const yAxisHeight = Math.ceil((yAxisClientRect === null || yAxisClientRect === void 0 ? void 0 : yAxisClientRect.height) || 1);
  const yAxisWidth = Math.ceil((yAxisClientRect === null || yAxisClientRect === void 0 ? void 0 : yAxisClientRect.width) || 1);
  const y2AxisClientRect = (_rootRef$current3 = rootRef.current) === null || _rootRef$current3 === void 0 ? void 0 : (_rootRef$current3$que = _rootRef$current3.querySelectorAll('.yAxis .recharts-cartesian-axis-ticks')[1]) === null || _rootRef$current3$que === void 0 ? void 0 : _rootRef$current3$que.getBoundingClientRect();
  const y2AxisHeight = Math.ceil((y2AxisClientRect === null || y2AxisClientRect === void 0 ? void 0 : y2AxisClientRect.height) || 1);
  const y2AxisWidth = Math.ceil((y2AxisClientRect === null || y2AxisClientRect === void 0 ? void 0 : y2AxisClientRect.width) || 1);
  const {
    excludedMetricsForStackedBars,
    includedMetricsForStackedBars,
    isMainChartStacked
  } = useMemo(() => {
    const excludedMetricsForStackedBars = yColumns.filter(metric => {
      var _yColumnsMeta$metric;

      return (yColumnsMeta === null || yColumnsMeta === void 0 ? void 0 : (_yColumnsMeta$metric = yColumnsMeta[metric]) === null || _yColumnsMeta$metric === void 0 ? void 0 : _yColumnsMeta$metric.chartType) && !isStackedBar(yColumnsMeta === null || yColumnsMeta === void 0 ? void 0 : yColumnsMeta[metric]);
    });
    const includedMetricsForStackedBars = yColumns.filter(metric => {
      var _yColumnsMeta$metric2;

      return (yColumnsMeta === null || yColumnsMeta === void 0 ? void 0 : (_yColumnsMeta$metric2 = yColumnsMeta[metric]) === null || _yColumnsMeta$metric2 === void 0 ? void 0 : _yColumnsMeta$metric2.chartType) && isStackedBar(yColumnsMeta === null || yColumnsMeta === void 0 ? void 0 : yColumnsMeta[metric]);
    });
    return {
      excludedMetricsForStackedBars,
      includedMetricsForStackedBars,
      isMainChartStacked: isStackedBar({
        chartType,
        chartSubType
      })
    };
  }, [chartSubType, chartType, yColumnsMeta, yColumns]);
  const currentData = useCurrentData(data, disabledDataKeys, breakdowns, hasTotals, yColumns, excludedMetricsForStackedBars, includedMetricsForStackedBars, isMainChartStacked, yColumnSortingType); // eslint-disable-next-line react-hooks/exhaustive-deps

  const updateVisibility = useCallback(debounce(() => {
    forceUpdate();
    setVisible(true);
    setResetProps({});
  }, 5), []); // eslint-disable-next-line react-hooks/exhaustive-deps

  const updateUI = useCallback(debounce(() => {
    forceUpdate();
    updateVisibility();
  }, 1), []);
  useEffect(() => {
    setResetProps({
      xAxisTicks: true
    });
    updateUI();
  }, [props, forceUpdate, updateUI, currentData]);

  const handleLegendClick = ({
    id
  }) => {
    let resultKeys;

    if (disabledDataKeys.includes(id)) {
      resultKeys = disabledDataKeys.filter(item => item !== id);
    } else {
      resultKeys = [...disabledDataKeys];
      resultKeys.push(id);
    }

    setDisabledDataKeys(resultKeys);
  };

  let xMarginLeft = xAxis.tickLabelAngle === -45 && layout === Layout.horizontal && (legend === null || legend === void 0 ? void 0 : legend.position) !== LegendPosition.left && !yAxis.label ? xAxisHeight / 2 - yAxisWidth + 5 : 10;
  let yMarginBottom = yAxis.tickLabelAngle === -45 && layout === Layout.vertical ? yAxisWidth - xAxisHeight - 10 : xAxisHeight;
  const hasNormChart = [...Object.values(yColumnsMeta !== null && yColumnsMeta !== void 0 ? yColumnsMeta : {}).map(({
    chartType
  }) => chartType), chartType].includes(ChartType.normChart);

  if (hasNormChart && layout === Layout.horizontal) {
    yMarginBottom += NORM_SPACE * 2;
  }

  if (hasNormChart && layout === Layout.vertical) {
    xMarginLeft += NORM_SPACE * 2;
  }

  let newWidth = width;
  let newHeight = height;

  if (layout === Layout.horizontal) {
    newWidth = minBarWidth ? currentData.length * (Number(minBarWidth) + 4) : width;
    newWidth = width > newWidth ? width : newWidth;
  } else if (layout === Layout.vertical) {
    newHeight = minBarWidth ? currentData.length * (Number(minBarWidth) + 4) : height;
    newHeight = height > newHeight ? height : newHeight;
  }

  const getZAxisRange = useZAxisRange(currentData, bubbleChart.size);
  let ChartContainer = RechartsComposedChart;
  let tooltipContent = /*#__PURE__*/React.createElement(ComposedChartTooltip, {
    numbersFormat: numbersFormat,
    timeFormat: timeFormat, 
    timeFormatDay:timeFormatDay,
    timeFormatWeek:timeFormatWeek,
    timeFormatMonth:timeFormatMonth,
    yColumns: yColumns,
    yColumnSortingType: yColumnSortingType,
    hasTimeSeries: hasTimeSeries,
    zDimension: bubbleChart === null || bubbleChart === void 0 ? void 0 : bubbleChart.zDimension,
    breakdowns: breakdowns,
    resultColors: resultColors,
    hasExcludedBars: !!excludedMetricsForStackedBars.length,
    chartFormat: chartFormat,
    useCustomMetricEnabled: useCustomMetricEnabled
  });

  if (chartType === ChartType.bubbleChart && !Object.values(yColumnsMeta !== null && yColumnsMeta !== void 0 ? yColumnsMeta : {}).some(({
    chartType
  }) => chartType)) {
    ChartContainer = ScatterChart;
    tooltipContent = /*#__PURE__*/React.createElement(ScatterChartTooltip, {
      breakdowns: breakdowns,
      numbersFormat: numbersFormat,
      timeFormat: timeFormat,
      timeFormatDay:timeFormatDay,
      timeFormatWeek:timeFormatWeek,
      timeFormatMonth:timeFormatMonth,
      yColumns: yColumns,
      zDimension: bubbleChart === null || bubbleChart === void 0 ? void 0 : bubbleChart.zDimension,
      resultColors: resultColors
    });
  }

  return /*#__PURE__*/React.createElement(Styles, {
    isClickable: (!(emitFilterControl === null || emitFilterControl === void 0 ? void 0 : emitFilterControl.disabled) && !!emitFilterControl) || (!(drillDown === null || drillDown === void 0 ? void 0 : drillDown.disabled) && !!handleChartClick),
    key: updater,
    height: height,
    width: width,
    legendPosition: legend === null || legend === void 0 ? void 0 : legend.position,
    ref: rootRef,
    style: {
      overflowX: newWidth === width ? 'hidden' : 'auto',
      overflowY: newHeight === height ? 'hidden' : 'auto'
    }
  }, /*#__PURE__*/React.createElement(Breadcrumb, null, (_drillDown$deepness$m = drillDown === null || drillDown === void 0 ? void 0 : (_drillDown$deepness = drillDown.deepness) === null || _drillDown$deepness === void 0 ? void 0 : _drillDown$deepness.map((deep, index) =>
  /*#__PURE__*/
  // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/interactive-supports-focus
  React.createElement(StyledLink, {
    onClick: () => {
      handleChartClick === null || handleChartClick === void 0 ? void 0 : handleChartClick({
        index
      });
    },
    onDoubleClick: () => {
      handleChartDoubleClick === null || handleChartDoubleClick === void 0 ? void 0 : handleChartDoubleClick({
        index
      });
    },
  }, deep === null || deep === void 0 ? void 0 : deep.label))) !== null && _drillDown$deepness$m !== void 0 ? _drillDown$deepness$m : null), /*#__PURE__*/React.createElement(ChartContainer, {
    key: updater,
    width: newWidth,
    height: newHeight,
    layout: layout,
    style: {
      visibility: visible ? 'visible' : 'hidden'
    },
    margin: {
      right: layout === Layout.vertical ? 10 : 20,
      left: xMarginLeft > 0 ? xMarginLeft : 10,
      top: 15,
      bottom: ((legend === null || legend === void 0 ? void 0 : legend.position) === LegendPosition.bottom ? 0 : yMarginBottom) + 16
    },
    data: currentData
  }, legend && /*#__PURE__*/React.createElement(Legend, Object.assign({
    onClick: handleLegendClick
  }, getLegendProps(legend, height, newWidth, breakdowns, disabledDataKeys, yColumns, xAxisHeight, yAxisWidth, yColumnsMeta, resultColors, chartType), {
    iconType: "circle",
    iconSize: 10
  })), /*#__PURE__*/React.createElement(CartesianGrid, getCartesianGridProps({
    layout,
    chartType
  })), /*#__PURE__*/React.createElement(XAxis, getXAxisProps({
    resetProps,
    numbersFormat,
    timeFormat,
    timeFormatDay,
    timeFormatWeek,
    timeFormatMonth,
    layout,
    currentData,
    interval: xAxis.interval,
    tickLabelAngle: xAxis.tickLabelAngle,
    axisHeight: xAxisHeight,
    axisWidth: xAxisWidth,
    xAxisClientRect,
    label: xAxis.label,
    hasTimeSeries,
    xColumns,
    rootRef,
    chartType,
    timeRangeValue,
    timeRangeFormat,
    timeRangeFormatDashbord,
    timeRangeValuechart,
    fontSize: xAxis.fontSize,
    margin: xAxis.margin
  })), /*#__PURE__*/React.createElement(YAxis, getYAxisProps({
    rootRef,
    numbersFormat,
    timeFormat,
    timeFormatDay,
    timeFormatWeek,
    timeFormatMonth,
    currentData,
    layout,
    height: newHeight,
    tickLabelAngle: (_yAxis$tickLabelAngle = yAxis.tickLabelAngle) !== null && _yAxis$tickLabelAngle !== void 0 ? _yAxis$tickLabelAngle : 0,
    labelAngle: (_yAxis$labelAngle = yAxis.labelAngle) !== null && _yAxis$labelAngle !== void 0 ? _yAxis$labelAngle : 0,
    label: yAxis.label,
    axisHeight: yAxisHeight,
    axisWidth: yAxisWidth,
    chartType
  })), chartType === ChartType.bubbleChart && breakdowns.map((breakdown, i) =>
  /*#__PURE__*/
  // eslint-disable-next-line no-underscore-dangle
  React.createElement(ZAxis, {
    type: "number",
    zAxisId: i,
    range: getZAxisRange(breakdown),
    dataKey: `${breakdown}${Z_SEPARATOR}`
  })), y2Axis && /*#__PURE__*/React.createElement(YAxis, getYAxisProps({
    rootRef,
    numbersFormat: useCustomMetricEnabled[Object.keys(useCustomMetricEnabled)[1]] ? {digits: undefined, type: chartFormat[Object.keys(chartFormat)[1]] || numbersFormat} : numbersFormat,
    timeFormat,
    timeFormatDay,
    timeFormatWeek,
    timeFormatMonth,
    layout,
    currentData,
    height: newHeight,
    isSecondAxis: true,
    dataKey: initYColumns[initYColumns.length - 1],
    tickLabelAngle: (_y2Axis$tickLabelAngl = y2Axis === null || y2Axis === void 0 ? void 0 : y2Axis.tickLabelAngle) !== null && _y2Axis$tickLabelAngl !== void 0 ? _y2Axis$tickLabelAngl : 0,
    label: y2Axis === null || y2Axis === void 0 ? void 0 : y2Axis.label,
    labelAngle: (_y2Axis$labelAngle = y2Axis === null || y2Axis === void 0 ? void 0 : y2Axis.labelAngle) !== null && _y2Axis$labelAngle !== void 0 ? _y2Axis$labelAngle : 0,
    axisHeight: y2AxisHeight,
    axisWidth: y2AxisWidth,
    chartType
  })), /*#__PURE__*/React.createElement(Tooltip, {
    content: tooltipContent
  }), breakdowns.map((breakdown, index) => {
    var _data$;

    return renderChartElement({
      yColumnSortingType,
      ...{
        chartType,
        chartSubType
      },
      layout,
      initYColumns,
      yColumns,
      hasTotals,
      breakdown,
      numbersFormat,
      timeFormat,
      timeFormatDay,
      timeFormatWeek,
      timeFormatMonth,
      y2Axis,
      labelsColor,
      stickyScatters,
      barsUIPositions,
      setBarsUIPositions,
      isAnimationActive: isAnimationActive && visible,
      updater,
      index,
      currentData,
      yColumnsMeta,
      breakdowns,
      excludedMetricsForStackedBars,
      includedMetricsForStackedBars,
      isMainChartStacked,
      resultColors,
      barsUIPositionsRef,
      xAxisClientRect,
      yAxisClientRect,
      xColumns,
      firstItem: (_data$ = data[0]) === null || _data$ === void 0 ? void 0 : _data$.rechartsDataKey,
      handleChartClick: emitCrossFilters && !(emitFilterControl === null || emitFilterControl === void 0 ? void 0 : emitFilterControl.disabled) ? handleChartClick : undefined,
      handleChartDoubleClick: !(drillDown === null || drillDown === void 0 ? void 0 : drillDown.disabled) ? handleChartDoubleClick : undefined
    });
  })));
};

export default ComposedChart;
