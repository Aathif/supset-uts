import { CategoricalColorNamespace, getNumberFormatter, isEventAnnotationLayer, isFormulaAnnotationLayer, isIntervalAnnotationLayer, isTimeseriesAnnotationLayer } from '@superset-ui/core';
import { DEFAULT_FORM_DATA } from './types';
import { ForecastSeriesEnum } from '../types';
import { parseYAxisBound } from '../utils/controls';
import { dedupSeries, extractTimeseriesSeries, getLegendProps } from '../utils/series';
import { extractAnnotationLabels } from '../utils/annotation';
import { extractForecastSeriesContext, extractProphetValuesFromTooltipParams, formatProphetTooltipSeries, rebaseTimeseriesDatum } from '../utils/prophet';
import { defaultGrid, defaultTooltip, defaultYAxis } from '../defaults';
import { getPadding, getTooltipTimeFormatter, getXAxisFormatter, transformEventAnnotation, transformFormulaAnnotation, transformIntervalAnnotation, transformSeries, transformTimeseriesAnnotation } from './transformers';
import { TIMESERIES_CONSTANTS } from '../constants';
export default function transformProps(chartProps) {
  const {
    width,
    height,
    filterState,
    formData,
    hooks,
    queriesData
  } = chartProps;
  let {
    annotation_data: annotationData_,
    data = []
  } = queriesData[0];
  const annotationData = annotationData_ || {};
  const {
    area,
    annotationLayers,
    colorScheme,
    contributionMode,
    forecastEnabled,
    legendOrientation,
    legendType,
    logAxis,
    markerEnabled,
    markerSize,
    markLineCheck,
    showMinMaxValue,
    opacity,
    minorSplitLine,
    seriesType,
    showLegend,
    stack,
    truncateYAxis,
    yAxisFormat,
    xAxisShowMinLabel,
    xAxisShowMaxLabel,
    xAxisTimeFormat,
    yAxisBounds,
    yAxisLine,
    yaxisInnerGridLines,
    yAxisTitle,
    tooltipTimeFormat,
    zoomable,
    richTooltip,
    xAxisLabelRotation,
    yAxisLabelRotation,
    xaxisInnerGridLines,
    emitFilter,
    groupby,
    showValue,
    barWidth,
    barChartLabel,
    labelPosition,
    labelColor,
    labelFont,
    labelRotate,
    showXAxisName,
    xAxisName,
    showYAxisName,
    showToolBox,
    orderDesc,
    orderByColumn,
    sortbyXaxis,
    xAxisLabelInterval
  } = { ...DEFAULT_FORM_DATA,
    ...formData
  };
  const colorScale = CategoricalColorNamespace.getScale(colorScheme);
  const rebasedData = rebaseTimeseriesDatum(data);
  const rawSeries = extractTimeseriesSeries(rebasedData, {
    fillNeighborValue: stack && !forecastEnabled ? 0 : undefined
  });
  const series = [];
  const formatter = getNumberFormatter(contributionMode ? ',.0%' : yAxisFormat);
  const totalStackedValues = [];
  const showValueIndexes = [];

  if (stack) {
    rebasedData.forEach(data => {
      const values = Object.keys(data).reduce((prev, curr) => {
        if (curr === '__timestamp') {
          return prev;
        }

        const value = data[curr] || 0;
        return prev + value;
      }, 0);
      totalStackedValues.push(values);
    });
    rawSeries.forEach((entry, seriesIndex) => {
      const {
        data = []
      } = entry;
      data.forEach((datum, dataIndex) => {
        if (datum[1] !== null) {
          showValueIndexes[dataIndex] = seriesIndex;
        }
      });
    });
  }

  let markLine = {};
  let markPoint = {};

  if(markLineCheck){
    markLine.data = [{
      type: "average"
    }],
    markLine.silent = true
  }

  if(showMinMaxValue){
    markPoint.data = [
      { type: 'max', name: 'Max' },
      { type: 'min', name: 'Min' }
    ],
    markPoint.symbol = "pin",
    markPoint.symbolSize = [45,40],
    markPoint.symbolRotate = -180,
    markPoint.label= {
      show: true,
      distance: 30,
      position: "inside",
      offset: [0, 8]
    }
  }

  rawSeries.forEach(entry => {
    const transformedSeries = transformSeries(entry, colorScale, {
      area,
      filterState,
      forecastEnabled,
      markerEnabled,
      markerSize,
      markLineCheck,
      markLine,
      showMinMaxValue,
      markPoint,
      areaOpacity: opacity,
      seriesType,
      stack,
      formatter,
      showValue,
      totalStackedValues,
      showValueIndexes,
      richTooltip
    });
    if (transformedSeries) series.push(transformedSeries);
  });
   
  const labelValue = series.forEach(item => (item.label.show = barChartLabel));
  const labelPlacement = series.forEach(item => (item.label.position = labelPosition));
  const colorLabel = series.forEach(item => (item.label.color = labelColor));
  const fontLabel = series.forEach(item => (item.label.fontSize = labelFont));
  const rotateLabel = series.forEach(item => (item.label.rotate = labelRotate));
  const truncateLabel = series.forEach(item => (item.label.overflow = "truncate"));
  const labelPadding = series.forEach(item => (item.label.distance = 16));
  const labelFontSize = series.forEach(item => (item.label.fontSize = 11));
 
  const selectedValues = (filterState.selectedValues || []).reduce((acc, selectedValue) => {
    const index = series.findIndex(({
      name
    }) => name === selectedValue);
    return { ...acc,
      [index]: selectedValue
    };
  }, {});
  annotationLayers.filter(layer => layer.show).forEach(layer => {
    if (isFormulaAnnotationLayer(layer)) series.push(transformFormulaAnnotation(layer, data, colorScale));else if (isIntervalAnnotationLayer(layer)) {
      series.push(...transformIntervalAnnotation(layer, data, annotationData, colorScale));
    } else if (isEventAnnotationLayer(layer)) {
      series.push(...transformEventAnnotation(layer, data, annotationData, colorScale));
    } else if (isTimeseriesAnnotationLayer(layer)) {
      series.push(...transformTimeseriesAnnotation(layer, markerSize, markLine, markPoint, data, annotationData));
    }
  }); // yAxisBounds need to be parsed to replace incompatible values with undefined

  let [min, max] = (yAxisBounds || []).map(parseYAxisBound); // default to 0-100% range when doing row-level contribution chart

  if (contributionMode === 'row' && stack) {
    if (min === undefined) min = 0;
    if (max === undefined) max = 1;
  }

  const tooltipFormatter = getTooltipTimeFormatter(tooltipTimeFormat);
  const xAxisFormatter = getXAxisFormatter(xAxisTimeFormat);
  const labelMap = series.reduce((acc, datum) => {
    const name = datum.name;
    return { ...acc,
      [name]: [name]
    };
  }, {});
  const {
    setDataMask = () => {}
  } = hooks;
  const addYAxisLabelOffset = !!yAxisTitle;
  const padding = getPadding(showLegend, legendOrientation, addYAxisLabelOffset, zoomable);
  const echartOptions = {
    barWidth: barWidth,
    useUTC: true,
    grid: { ...defaultGrid,
      ...padding
    },
    xAxis: {
      type: "category",
      min,
      max,
      axisLabel: {
        showMinLabel: xAxisShowMinLabel,
        showMaxLabel: xAxisShowMaxLabel,
        formatter: xAxisFormatter,
        rotate: xAxisLabelRotation,
        color: '#626D8A',
        fontSize: 13,
        interval: 0,
        overflow: 'break'  
    },
      scale: true,
      //scale: truncateXAxis,
      name: xAxisName,
      nameLocation: "middle",
      nameTextStyle: {
        align: "center",
        verticalAlign: "top",
        lineHeight: 30
     },
     splitLine: {
      show: xaxisInnerGridLines
    },
     boundaryGap: true,
     axisTick: {
      show: true,
      alignWithLabel: true,
      interval: 0
    },
    realtimeSort: true
    },
    yAxis: { ...defaultYAxis,
      type: logAxis ? 'log' : 'value',
      min,
      max,
      minorTick: {
        show: true
      },
      minorSplitLine: {
        show: minorSplitLine
      },
      axisLabel: {
        formatter,
        color: '#626D8A',
        fontSize: 13,
        rotate: yAxisLabelRotation
      },
      axisLine: {
        show: yAxisLine,
        onZero: true
      },
      splitLine: {
        show: yaxisInnerGridLines
      },
      scale: truncateYAxis,
      name: yAxisTitle,
      nameLocation: "middle",
      nameTextStyle: {
        align: "center",
        verticalAlign: "top",
        lineHeight: -50
    }
    },
    tooltip: { ...defaultTooltip,
      trigger: richTooltip ? 'axis' : 'item',
      textStyle: {
        fontSize: 11,
        color: '#626D8A'
      },
      formatter: params => {
        const value = !richTooltip ? params.value : params[0].value[0];
        const prophetValue = !richTooltip ? [params] : params;
        const rows = [`${tooltipFormatter(value)}`];
        const prophetValues = extractProphetValuesFromTooltipParams(prophetValue);
        Object.keys(prophetValues).forEach(key => {
          const value = prophetValues[key];
          rows.push(formatProphetTooltipSeries({ ...value,
            seriesName: key,
            formatter
          }));
        });
        return rows.join('<br />');
      }
    },
    legend: { ...getLegendProps(legendType, legendOrientation, showLegend, zoomable),
      textStyle: {
        fontSize: 11,
        color: '#626D8A'
      },
            // @ts-ignore
      data: rawSeries.filter(entry => extractForecastSeriesContext(entry.name || '').type === ForecastSeriesEnum.Observation).map(entry => entry.name || '').concat(extractAnnotationLabels(annotationLayers, annotationData))
    },
    series: dedupSeries(series),
    toolbox: {
      show: showToolBox,
      orient: 'horizontal',
      right: TIMESERIES_CONSTANTS.toolboxRight,
      top: 5,
      showTitle: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false ,title: 'Data View'},
        magicType: { show: true, type: ['line', 'bar', 'stack'] },
        restore: { show: true ,title: 'Restore View'},
        saveAsImage: { show: true,title: 'Save As Image'},
        dataZoom: {
            yAxisIndex: false,
            title: {
              zoom: 'zoom area',
              back: 'restore zoom'
            }
          }
      }
    },
    dataZoom: zoomable ? [{
      type: 'slider',
      start: TIMESERIES_CONSTANTS.dataZoomStart,
      end: TIMESERIES_CONSTANTS.dataZoomEnd,
      bottom: TIMESERIES_CONSTANTS.zoomBottom
    }] : []
  };
  return {
    echartOptions,
    emitFilter,
    formData,
    groupby,
    height,
    labelMap,
    selectedValues,
    setDataMask,
    width   
  };
}
