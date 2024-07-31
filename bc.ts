import React, { useCallback } from 'react';
import Echart from '../components/Echart';
import { jsx as ___EmotionJSX } from "@emotion/react";
// @ts-ignore
export default function EchartsTimeseries({
  formData,
  height,
  width,
  echartOptions,
  groupby,
  labelMap,
  selectedValues,
  setDataMask
}) {
  const seriesData = echartOptions.series.map(item => item.data);
  let sortedValue;

  sortedValue = seriesData[0].sort(compareSecondColumn);
  function compareSecondColumn(a, b) {
    if (a[1] === b[1]) {
      return 0;
    }
    else {
      if (formData.orderByColumn === 'axis' && formData.orderDesc) {
        return (a[0] < b[0]) ? 1 : -1;
      } else if (formData.orderByColumn === 'axis' && !formData.orderDesc) {
        return (a[0] < b[0]) ? -1 : 1;
      } else if (formData.orderByColumn === 'value' && formData.orderDesc) {
        return (a[1] < b[1]) ? 1 : -1;
      } else if (formData.orderByColumn === 'value' && !formData.orderDesc) {
        return (a[1] < b[1]) ? -1 : 1;
      }
    }
  }

  echartOptions.series[0].data = sortedValue;

  const handleChange = useCallback(values => {
    if (!formData.emitFilter) {
      return;
    }
    const groupbyValues = values.map(value => labelMap[value]);
    setDataMask({
      extraFormData: {
        filters: values.length === 0 ? [] : groupby.map((col, idx) => {
          const val = groupbyValues.map(v => v[idx]);
          if (val === null || val === undefined) return {
            col,
            op: 'IS NULL'
          };
          return {
            col,
            op: 'IN',
            val: val
          };
        })
      },
      filterState: {
        label: groupbyValues.length ? groupbyValues : undefined,
        value: groupbyValues.length ? groupbyValues : null,
        selectedValues: values.length ? values : null
      }
    });
  }, [groupby, labelMap, setDataMask]);
  const eventHandlers = {
    click: props => {
      const {
        seriesName: name
      } = props;
      const values = Object.values(selectedValues);

      if (values.includes(name)) {
        handleChange(values.filter(v => v !== name));
      } else {
        handleChange([name]);
      }
    }
  };
  return ___EmotionJSX(Echart, {
    height: height,
    width: width,
    echartOptions: echartOptions,
    eventHandlers: eventHandlers,
    selectedValues: selectedValues
  });
}
