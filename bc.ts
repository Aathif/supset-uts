import moment from 'moment';
import {
  ChartProps,
  getMetricLabel,
  getValueFormatter,
  NumberFormats,
  getNumberFormatter,
} from '@superset-ui/core';
import { computeQueryBComparator, formatCustomComparator } from '../utils';

export const parseMetricValue = (metricValue: number | string | null) => {
  if (typeof metricValue === 'string') {
    const dateObject = moment.utc(metricValue, moment.ISO_8601, true);
    if (dateObject.isValid()) {
      return dateObject.valueOf();
    }
    return 0;
  }
  return metricValue ?? 0;
};

export default function transformProps(chartProps: ChartProps) {
  const {
    width,
    height,
    formData,
    queriesData,
    datasource: { currencyFormats = {}, columnFormats = {} },
  } = chartProps;
  const {
    boldText,
    headerFontSize,
    headerText,
    metrics,
    yAxisFormat,
    currencyFormat,
    subheaderFontSize,
    comparisonColorEnabled,
  } = formData;
  const { data: dataA = [] } = queriesData[0];
  const { data: dataB = [] } = queriesData[1];
  const data = dataA;
  const metricName = getMetricLabel(metrics[0]);
  let bigNumber: number | string =
    data.length === 0 ? 0 : parseMetricValue(data[0][metricName]);
  let prevNumber: number | string =
    data.length === 0 ? 0 : parseMetricValue(dataB[0][metricName]);

  const numberFormatter = getValueFormatter(
    metrics[0],
    currencyFormats,
    columnFormats,
    yAxisFormat,
    currencyFormat,
  );

  const compTitles = {
    r: 'Range' as string,
    y: 'Year' as string,
    m: 'Month' as string,
    w: 'Week' as string,
  };

  const formatPercentChange = getNumberFormatter(
    NumberFormats.PERCENT_SIGNED_1_POINT,
  );

  let valueDifference: number | string = bigNumber - prevNumber;

  let percentDifferenceNum;

  if (!bigNumber && !prevNumber) {
    percentDifferenceNum = 0;
  } else if (!bigNumber || !prevNumber) {
    percentDifferenceNum = bigNumber ? 1 : -1;
  } else {
    percentDifferenceNum = (bigNumber - prevNumber) / Math.abs(prevNumber);
  }

  const compType = compTitles[formData.timeComparison];
  bigNumber = numberFormatter(bigNumber);
  prevNumber = numberFormatter(prevNumber);
  valueDifference = numberFormatter(valueDifference);
  const percentDifference: string = formatPercentChange(percentDifferenceNum);
  const comparatorText =
    formData.timeComparison !== 'c'
      ? ` ${computeQueryBComparator(
          formData.adhocFilters,
          formData.timeComparison,
          formData.extraFormData,
          ' - ',
        )}`
      : `${formatCustomComparator(
          formData.adhocCustom,
          formData.extraFormData,
        )}`;

  return {
    width,
    height,
    data,
    // and now your control data, manipulated as needed, and passed through as props!
    metrics,
    metricName,
    bigNumber,
    prevNumber,
    valueDifference,
    percentDifferenceFormattedString: percentDifference,
    boldText,
    headerFontSize,
    subheaderFontSize,
    headerText,
    compType,
    comparisonColorEnabled,
    percentDifferenceNumber: percentDifferenceNum,
    comparatorText,
  };
}
