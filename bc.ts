/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/* eslint-disable camelcase */
import { CategoricalColorNamespace, getNumberFormatter, isEventAnnotationLayer, isFormulaAnnotationLayer, isIntervalAnnotationLayer, isTimeseriesAnnotationLayer } from '@superset-ui/core';
import { DEFAULT_FORM_DATA } from '../../types';
import { ForecastSeriesEnum } from '../../types';
import { parseYAxisBound } from '../../../utils/controls';
import { dedupSeries, extractTimeseriesSeries, getLegendProps, extractNonTimeseriesSeries } from '../../../utils/series';
import { extractAnnotationLabels } from '../../../utils/series'
import { extractForecastSeriesContext, extractProphetValuesFromTooltipParams, formatProphetTooltipSeries, rebaseTimeseriesDatum } from '../../../utils/prophet';
import { defaultGrid, defaultTooltip, defaultYAxis } from '../../../defaults';
import { getPadding, getTooltipTimeFormatter, getXAxisFormatter, transformEventAnnotation, transformFormulaAnnotation, transformIntervalAnnotation, transformSeries, transformTimeseriesAnnotation } from '../../transformers';
import { TIMESERIES_CONSTANTS } from '../../../constants';
import { ConsoleSqlOutlined } from '@ant-design/icons';
export default function transformProps(chartProps) {
  const {
    width,
    height,
    filterState,
    formData,
    hooks,
    queriesData
  } = chartProps;
  const {
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
    yAxisTitle,
    tooltipTimeFormat,
    zoomable,
    richTooltip,
    xAxisLabelRotation,
    yAxisLabelRotation,
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
    isTimeSeries = false,
    orderByColumn,
    orderDesc,
    tooltipHtmlContent
  } = { ...DEFAULT_FORM_DATA,
    ...formData
  };

  const colorScale = CategoricalColorNamespace.getScale(colorScheme);
  let metric = formData?.metrics[0];
  let metricValue;
  if (typeof metric === 'string') {
     metricValue = [metric];
  } else {
     metricValue = [metric?.label];
  }

  let yaxisVal = data.map(item => item[formData.groupby[0]]);
  let xaxisVal = data.map(item => item[metricValue[0]]);
  let groupByValue = formData.groupby;
  const rebasedData = rebaseTimeseriesDatum(data);
  const rawSeries = extractNonTimeseriesSeries(rebasedData,formData?.metrics);
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
    markPoint.symbolRotate = 0,
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
  const labelPadding = series.forEach(item => (item.label.distance = 10));
  
  let seriesIdList  = series.map(seriesElement=>seriesElement.id);
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
      type: 'value',
      boundaryGap: [0, 0.01],
      min,
      max,
      axisLabel: {
        showMinLabel: xAxisShowMinLabel,
        showMaxLabel: xAxisShowMaxLabel,
        formatter: xAxisFormatter,
        rotate: xAxisLabelRotation,
        color: '#626D8A',
        fontSize: 11,
        interval: 0
      },
      scale: true,
      //scale: truncateXAxis,
      name: showXAxisName?  xAxisName: '',
      nameLocation: "middle",
      nameTextStyle: {
        align: "center",
        verticalAlign: "top",
        lineHeight: 30,
        padding: [15, 15, 15, 15]
     },
     axisTick: {
      show: true,
      alignWithLabel: true,
      interval: 0
    },
    realtimeSort: true
    },
    yAxis: { 
      ...defaultYAxis,
      //type: logAxis ? 'log' : 'value',
      type: 'category',
      data: yaxisVal,
      min,
      max,
      minorTick: {
        show: true
      },
      minorSplitLine: {
        show: minorSplitLine
      },
      axisLabel: {
        //pformatter,
        color: '#626D8A',
        fontSize: 11,
        rotate: yAxisLabelRotation
      },
      scale: truncateYAxis,
      name: showYAxisName ? yAxisTitle : '',
      nameLocation: "middle",
      nameTextStyle: {
        align: "center",
        verticalAlign: "top",
        lineHeight: -50,
        padding: [10, 10, 10, 10]
    }
    },
    tooltip: {    
      trigger: richTooltip ? 'axis' : 'item',
      formatter: (params) => {       
          let contentUpdate = tooltipHtmlContent;
          function  replaceSeriesIdContent() {
            for(var iterate=0; iterate<seriesIdList.length; iterate++) {
                let checkContent= seriesIdList[iterate];
                contentUpdate = contentUpdate.replace(`{{${checkContent}}}`, params.filter(a=>a.seriesName===checkContent)[0].value);
                for(var iterateGroupBy=0; iterateGroupBy<groupByValue.length; iterateGroupBy++) {
                  if(iterateGroupBy===0)
                    contentUpdate = contentUpdate.replace(`{{${groupByValue[iterateGroupBy]}}}`, params.filter(a=>a.seriesName===checkContent)[0].axisValue);    
                }     
              }
            return contentUpdate;
          }
          let newContent=replaceSeriesIdContent();
            return `<span style="opacity: 0.7">${newContent}</span>`;
          }
                
    },
    legend: { ...getLegendProps(legendType, legendOrientation, showLegend, zoomable),
      textStyle: {
        fontSize: 11,
        color: '#626D8A'
      },
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
