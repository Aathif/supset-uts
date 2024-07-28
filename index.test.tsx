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
import { styled } from '@superset-ui/core';
import React, { useCallback, useEffect, useMemo } from 'react';
import { PluginFilterTimeProps } from './types';
import { FilterPluginStyle } from '../common';
import { RangePicker } from 'src/components/DatePicker';
import moment, { Moment } from 'moment';
import {
  MOMENT_FORMAT,
} from 'src/explore/components/controls/DateFilterControl/utils';

const TimeFilterStyles = styled(FilterPluginStyle)`
  overflow-x: auto;
`;

export default function DateFilterPlugin(props: PluginFilterTimeProps) {
  const {
    setDataMask,
    width,
    height,
    filterState,
  } = props;

  const { enableTime, monthlyFilter, quarterFilter, yearlyFilter, customDateFormat, displayDateFormat, displayTimeFormat, timeWith12hoursFormat } = props?.formData

  const handleTimeRangeChange = useCallback(
    (timeRange: any, dates: any): void => {
      let isSet = '';
      if (dates && dates.length === 2) {
        if (monthlyFilter === true) {
          let minDate = dates?.[0];
          let maxDate = dates?.[1];
          let minYear = moment(minDate, displayDateFormat).format('YYYY');
          let minMonth = moment(minDate, displayDateFormat).format('MM');
          minDate = moment(`01-${minMonth}-${minYear}`, 'DD-MM-YYYY').format(customDateFormat);

          let maxYear = moment(maxDate, displayDateFormat).format('YYYY');
          let maxMonth = moment(maxDate, displayDateFormat).format('MM');
          maxDate = moment(`${moment(maxDate, displayDateFormat).endOf('month').format('D')}-${maxMonth}-${maxYear}`, 'DD-MM-YYYY').format(customDateFormat);
          isSet = `${minDate} : ${maxDate}`
        } else if (quarterFilter === true) {
          let minDate = dates?.[0];
          let maxDate = dates?.[1];
          let minYear = moment(minDate, displayDateFormat).format('YYYY');
          let minMonth = moment(minDate, displayDateFormat).startOf('quarter').format('MM');
          minDate = moment(`01-${minMonth}-${minYear}`, 'DD-MM-YYYY').format(customDateFormat);

          let maxYear = moment(maxDate, displayDateFormat).format('YYYY');
          let maxMonth = moment(maxDate, displayDateFormat).endOf('quarter').format('MM');
          let maxDay = moment(maxDate, displayDateFormat).endOf('quarter').format('D');
          maxDate = moment(`${maxDay}-${maxMonth}-${maxYear}`, 'DD-MM-YYYY').format(customDateFormat);
          isSet = `${minDate} : ${maxDate}`;
        } else if (yearlyFilter === true) {
          let minDate = dates?.[0];
          let maxDate = dates?.[1];
          let minYear = moment(minDate, displayDateFormat).format('YYYY');
          minDate = moment(`01-01-${minYear}`, 'DD-MM-YYYY').format(customDateFormat);
          let maxYear = moment(maxDate, displayDateFormat).format('YYYY');
          maxDate = moment(`31-12-${maxYear}`, 'DD-MM-YYYY').format(customDateFormat);
          isSet = `${minDate} : ${maxDate}`;
        } else {
          let minDate = moment(dates?.[0], displayDateFormat).format(customDateFormat);
          let maxDate = moment(dates?.[1], displayDateFormat).format(customDateFormat);
          isSet = `${minDate} : ${maxDate}`;
        }
      }
      updateDataMask(isSet);
    },
    [setDataMask],
  );

  const updateDataMask = (isSet: any) => {
    setDataMask({
      extraFormData: isSet
        ? {
            time_range: isSet,
          }
        : {},
      filterState: {
        value: isSet ? isSet : undefined,
      },
    });
  }

  useEffect(() => {
    updateDataMask(filterState?.value);
  }, [filterState?.value]);

  const momentValue = useMemo((): [Moment, Moment] | null => {
    let value = filterState?.value;
    if (value && value.includes(' : ')) {
      value = value.split(' : ');
      return [moment(value[0]), moment(value[1])];
    }
    return null;
  }, [filterState?.value]);

  return props.formData?.inView ? (
    // @ts-ignore
    <TimeFilterStyles width={width} height={height}>
      <RangePicker
        allowClear={false}
        format={displayDateFormat ? displayDateFormat : (enableTime === true ? MOMENT_FORMAT : 'YYYY-MM-DD')}
        onChange={handleTimeRangeChange}
        showTime={enableTime === true ? { format: displayTimeFormat }: false}
        use12Hours={(enableTime == true && timeWith12hoursFormat === true) ? true : false}
        value={momentValue}
        picker={monthlyFilter === true ? 'month' : quarterFilter === true ? 'quarter' : yearlyFilter === true ? 'year' : undefined}
      />
    </TimeFilterStyles>
  ) : null;
}
