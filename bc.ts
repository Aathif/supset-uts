import * as color from 'd3-color';
import { getTimeFormatterForGranularity, getNumberFormatter, NumberFormats } from '@superset-ui/core';
const TIME_COLUMN = '__timestamp';
const formatPercentChange = getNumberFormatter(NumberFormats.PERCENT_SIGNED_1_POINT); // we trust both the x (time) and y (card widget) to be numeric

export default function transformProps(chartProps) {
  const {
    width,
    height,
    queriesData,
    formData
  } = chartProps;
  const {
    colorPicker,
    compareLag: compareLag_,
    compareSuffix = '',
    headerFontSize,
    metrics = 'value',
    showTrendLine,
    startYAxisAtZero,
    subheader = '',
    subheaderFontSize,
    timeGrainSqla: granularity,
    vizType,
    timeRangeFixed = false,
    comparator,
    operatorColor,
    cellBgColor,
    cellBgColor1,
    targetName,
    targetValue
  } = formData;
  let {
    yAxisFormat
  } = formData;
  const {
    data = [],
    from_dttm: fromDatetime,
    to_dttm: toDatetime
  } = queriesData[0];
  const metricName = typeof metrics === 'string' ? metrics :(metrics[0].label ||  metrics.label || metrics[0]);
  const compareLag = Number(compareLag_) || 0;
  const supportTrendLine = vizType === 'card_widget';
  const supportAndShowTrendLine = supportTrendLine && showTrendLine;
  let formattedSubheader = subheader;
  let mainColor;

  if (colorPicker) {
    const {
      r,
      g,
      b
    } = colorPicker;
    mainColor = color.rgb(r, g, b).hex();
  }

  let trendLineData;
  let percentChange = 0;
  let CardWidget = data.length === 0 ? null : data[0][metricName];
  let CardWidgetFallback;
  if (data.length > 0) {
    const sortedData = data.map(d => ({
      x: d[TIME_COLUMN],
      y: d[metricName]
    })) // sort in time descending order
    .sort((a, b) => a.x !== null && b.x !== null ? b.x - a.x : 0);
    CardWidget = sortedData[0].y;

    if (CardWidget === null) {
      CardWidgetFallback = sortedData.find(d => d.y !== null);
      CardWidget = CardWidgetFallback ? CardWidgetFallback.y : null;
    }

    if (compareLag > 0) {
      const compareIndex = compareLag;

      if (compareIndex < sortedData.length) {
        const compareValue = sortedData[compareIndex].y; // compare values must both be non-nulls

        if (CardWidget !== null && compareValue !== null && compareValue !== 0) {
          percentChange = (CardWidget - compareValue) / Math.abs(compareValue);
          formattedSubheader = `${formatPercentChange(percentChange)} ${compareSuffix}`;
        }
      }
    }

    if (supportTrendLine) {
      // must reverse to ascending order otherwise it confuses tooltip triggers
      sortedData.reverse();
      trendLineData = supportAndShowTrendLine ? sortedData : undefined;
    }
  }

  let className = '';

  if (percentChange > 0) {
    className = 'positive';
  } else if (percentChange < 0) {
    className = 'negative';
  }

  if (!yAxisFormat && chartProps.datasource && chartProps.datasource.metrics) {
    chartProps.datasource.metrics.forEach(metricEntry => {
      if (metricEntry.metric_name === metrics && metricEntry.d3format) {
        yAxisFormat = metricEntry.d3format;
      }
    });
  }

  const formatNumber = getNumberFormatter(yAxisFormat);
  const formatTime = getTimeFormatterForGranularity(granularity);
  return {
    width,
    height,
    CardWidget,
    data,
    CardWidgetFallback,
    className,
    formatNumber,
    formatTime,
    headerFontSize,
    subheaderFontSize,
    mainColor,
    showTrendLine: supportAndShowTrendLine,
    startYAxisAtZero,
    subheader: formattedSubheader,
    trendLineData,
    fromDatetime,
    toDatetime,
    timeRangeFixed,
    comparator,
    operatorColor,
    cellBgColor,
    cellBgColor1,
    targetName,
    targetValue
  };
}
