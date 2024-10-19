import { getNumberFormatter, isEventAnnotationLayer, isFormulaAnnotationLayer, isIntervalAnnotationLayer, isTimeseriesAnnotationLayer } from '@superset-ui/core';
import { DEFAULT_FORM_DATA } from './types';
import { ForecastSeriesEnum } from '../types';
import { parseYAxisBound } from '../utils/controls';
import { dedupSeries, extractTimeseriesSeries, getLegendProps } from '../utils/series';
import { extractAnnotationLabels } from '../utils/annotation';
import { extractForecastSeriesContext, rebaseTimeseriesDatum } from '../utils/prophet';
import { defaultGrid, defaultTooltip, defaultYAxis } from '../defaults';
import { getPadding, getXAxisFormatter, transformEventAnnotation, transformFormulaAnnotation, transformIntervalAnnotation, transformSeries, transformTimeseriesAnnotation } from './transformers';
import { TIMESERIES_CONSTANTS, SUPERSET_COLORS } from '../constants';
export default function transformProps(chartProps) {
  const {
    width,
    height,
    formData,
    queriesData
  } = chartProps;

  const {
    annotation_data: annotationData_,
    data: data1 = []
  } = queriesData[0];
  const {
    data: data2 = []
  } = queriesData[1];
  const {
    data: data3 = []
  } = queriesData[2];

  const annotationData = annotationData_ || {};
  const {
    area,
    areaB,
    areaC,
    annotationLayers,
    contributionMode,
    legendOrientation,
    legendType,
    markerEnabled,
    markerEnabledB,
    markerEnabledC,
    markerSize,
    markerSizeB,
    markerSizeC,
    opacity,
    opacityB,
    opacityC,
    minorSplitLine,
    seriesType,
    seriesTypeB,
    seriesTypeC,
    showLegend,
    stack,
    stackB,
    stackC,
    truncateYAxis,
    yAxisFormat,
    yAxisFormatSecondary,
    yAxisFormatTertiary,
    xAxisShowMinLabel,
    xAxisShowMaxLabel,
    xAxisTimeFormat,
    yAxisBounds,
    yAxisTitle,
    yAxisTitleSecondary,
    yAxisTitleTertiary,
    zoomable,
    richTooltip,
    xAxisLabelRotation
  } = { ...DEFAULT_FORM_DATA,
    ...formData
  };

  const formatter = getNumberFormatter(contributionMode ? ',.0%' : yAxisFormat);
  const formatterSecondary = getNumberFormatter(contributionMode ? ',.0%' : yAxisFormatSecondary);
  const formatterTertiary = getNumberFormatter(contributionMode ? ',.0%' : yAxisFormatTertiary);

  const rawSeriesA = extractTimeseriesSeries(rebaseTimeseriesDatum(data1), {
    fillNeighborValue: stack ? 0 : undefined
  });

  const rawSeriesB = extractTimeseriesSeries(rebaseTimeseriesDatum(data2), {
    fillNeighborValue: stackB ? 0 : undefined
  });

  const rawSeriesC = extractTimeseriesSeries(rebaseTimeseriesDatum(data3), {
    fillNeighborValue: stackC ? 0 : undefined
  });

  const series = [];
  let colorIdx = 0;
  rawSeriesA.forEach(entry => {
    const transformedSeries = transformSeries(entry, SUPERSET_COLORS[colorIdx++], {
      area,
      markerEnabled,
      markerSize,
      opacity,
      seriesType,
      stack,
      richTooltip,
      yAxisIndex: 0
    });
    if (transformedSeries) series.push(transformedSeries);
  });

  rawSeriesB.forEach(entry => {
    const transformedSeries = transformSeries(entry, SUPERSET_COLORS[colorIdx++], {
      area: areaB,
      markerEnabled: markerEnabledB,
      markerSize: markerSizeB,
      opacity: opacityB,
      seriesType: seriesTypeB,
      stack: stackB,
      richTooltip,
      yAxisIndex: 1
    });
    if (transformedSeries) series.push(transformedSeries);
  });

  rawSeriesC.forEach(entry => {
    const transformedSeries = transformSeries(entry, SUPERSET_COLORS[colorIdx++], {
      area: areaC,
      markerEnabled: markerEnabledC,
      markerSize: markerSizeC,
      opacity: opacityC,
      seriesType: seriesTypeC,
      stack: stackC,
      richTooltip,
      yAxisIndex: 2
    });
    if (transformedSeries) series.push(transformedSeries);
  });

  annotationLayers.filter(layer => layer.show).forEach((layer, idx) => {
    if (isFormulaAnnotationLayer(layer)) series.push(transformFormulaAnnotation(layer, data1, SUPERSET_COLORS[idx]));else if (isIntervalAnnotationLayer(layer)) {
      series.push(...transformIntervalAnnotation(layer, data1, annotationData, SUPERSET_COLORS[idx]));
    } else if (isEventAnnotationLayer(layer)) {
      series.push(...transformEventAnnotation(layer, data1, annotationData, SUPERSET_COLORS[idx]));
    } else if (isTimeseriesAnnotationLayer(layer)) {
      series.push(...transformTimeseriesAnnotation(layer, markerSize, data1, annotationData));
    }
  }); // yAxisBounds need to be parsed to replace incompatible values with undefined

  let [min, max] = (yAxisBounds || []).map(parseYAxisBound); // default to 0-100% range when doing row-level contribution chart

  if (contributionMode === 'row' && stack) {
    if (min === undefined) min = 0;
    if (max === undefined) max = 1;
  }

  const xAxisFormatter = getXAxisFormatter(xAxisTimeFormat);

  const addYAxisLabelOffset = !!(yAxisTitle || yAxisTitleSecondary);
  const chartPadding = getPadding(showLegend, legendOrientation, addYAxisLabelOffset, zoomable);
  const echartOptions = {
    useUTC: true,
    textStyle: {
      fontSize: 11,
      fontFamily: 'Core Sans C'
    },
    colors: SUPERSET_COLORS,
    grid: {
      ...defaultGrid,
      ...chartPadding,
      right: '100px'
    },
    xAxis: {
      type: 'category',
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {
        showMinLabel: xAxisShowMinLabel,
        showMaxLabel: xAxisShowMaxLabel,
        formatter: xAxisFormatter,
        rotate: xAxisLabelRotation,
        color: '#626D8A',
        fontSize: 11,
        fontFamily: 'Core Sans C'
      }
    },
    yAxis: [
      {
        ...defaultYAxis,
        type: 'value',
        min,
        max,
        minorSplitLine: {
          show: minorSplitLine
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: SUPERSET_COLORS[0]
          },
        },
        axisLabel: {
          formatter: formatter
        },
        scale: truncateYAxis,
        name: yAxisTitle
      }, {
        ...defaultYAxis,
        type: 'value',
        min,
        max,
        splitLine: {
          show: false
        },
        minorSplitLine: {
          show: minorSplitLine
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: SUPERSET_COLORS[1]
          },
        },
        axisLabel: {
          formatter: formatterSecondary
        },
        scale: truncateYAxis,
        name: yAxisTitleSecondary
      }, {
        ...defaultYAxis,
        type: 'value',
        offset: 80,
        min,
        max,
        splitLine: {
          show: false
        },
        minorSplitLine: {
          show: minorSplitLine
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: SUPERSET_COLORS[2]
          },
        },
        axisLabel: {
          formatter: formatterTertiary
        },
        scale: truncateYAxis,
        name: yAxisTitleTertiary
      }
    ],
    tooltip: {
      ...defaultTooltip,
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: { ...getLegendProps(legendType, legendOrientation, showLegend, zoomable),
      textStyle: {
        fontSize: 11,
        fontFamily: 'Core Sans C',
        color: '#626D8A'
      },
      // @ts-ignore
      data: rawSeriesA
        .concat(rawSeriesB)
        .concat(rawSeriesC)
        .filter(entry => extractForecastSeriesContext(entry.name || '').type === ForecastSeriesEnum.Observation)
        .map(entry => entry.name || '')
        .concat(extractAnnotationLabels(annotationLayers, annotationData))
    },
    series: dedupSeries(series),
    toolbox: {
      show: zoomable,
      top: TIMESERIES_CONSTANTS.toolboxTop,
      right: TIMESERIES_CONSTANTS.toolboxRight,
      feature: {
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
    width,
    height,
    formData
  };
}
