import {
  ensureIsArray,
  ExtraFormData,
  t,
  TimeGranularity,
  tn,
} from '@superset-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import { Select } from 'src/components';
import { FormItemProps } from 'antd/lib/form';
import { FilterPluginStyle, StyledFormItem, StatusMessage } from '../common';
import { PluginFilterTimeGrainProps } from './types';

export default function PluginFilterTimegrain(
  props: PluginFilterTimeGrainProps,
) {
  const {
    data,
    formData,
    height,
    width,
    setDataMask,
    setHoveredFilter,
    unsetHoveredFilter,
    setFocusedFilter,
    unsetFocusedFilter,
    setFilterActive,
    filterState,
    inputRef,
  } = props;
  const { defaultValue } = formData;

  const [value, setValue] = useState<string[]>(defaultValue ?? []);
  const durationMap = useMemo(
    () =>
      data.reduce(
        (agg, { duration, name }: { duration: string; name: string }) => ({
          ...agg,
          [duration]: name,
        }),
        {} as { [key in string]: string },
      ),
    [JSON.stringify(data)],
  );

  const handleChange = (values: string[] | string | undefined | null) => {
    const resultValue: string[] = ensureIsArray<string>(values);
    const [timeGrain] = resultValue;
    const label = timeGrain ? durationMap[timeGrain] : undefined;

    const extraFormData: ExtraFormData = {};
    if (timeGrain) {
      extraFormData.time_grain_sqla = timeGrain as TimeGranularity;
    }
    setValue(resultValue);
    setDataMask({
      extraFormData,
      filterState: {
        label,
        value: resultValue.length ? resultValue : null,
      },
    });
  };

  useEffect(() => {
    handleChange(defaultValue ?? []);
    // I think after Config Modal update some filter it re-creates default value for all other filters
    // so we can process it like this `JSON.stringify` or start to use `Immer`
  }, [JSON.stringify(defaultValue)]);

  useEffect(() => {
    handleChange(filterState.value ?? []);
  }, [JSON.stringify(filterState.value)]);

  

  const formItemData: FormItemProps = {};
  if (filterState.validateMessage) {
    formItemData.extra = (
      <StatusMessage status={filterState.validateStatus}>
        {filterState.validateMessage}
      </StatusMessage>
    );
  }
  
  const options = useMemo(() => {
    return (data || []).map(
    (row: { name: string; duration: string }) => {
      const { name, duration } = row;
      if ((duration === 'PT1S' && (formData?.pt1S === undefined || formData?.pt1S === true))
      || (duration === 'PT1M' && (formData?.pt1M === undefined || formData?.pt1M === true))
      || (duration === 'PT1H' && (formData?.pt1H === undefined || formData?.pt1H === true))
      || (duration === 'P1D' && (formData?.p1D === undefined || formData?.p1D === true))
      || (duration === 'P1W' && (formData?.p1W === undefined || formData?.p1W === true))
      || (duration === 'P1M' && (formData?.p1M === undefined || formData?.p1M === true))
      || (duration === 'P3M' && (formData?.p3M === undefined || formData?.p3M === true))
      || (duration === 'P1Y' && (formData?.p1Y === undefined || formData?.p1Y === true))
      ) {
        return {
          label: name,
          value: duration,
        };
      }
      return undefined
    },
  ).filter(notUndefined => notUndefined !== undefined)
  }, [formData?.pt1S, formData?.pt1M, formData?.pt1H, formData?.p1D, formData?.p1W, formData?.p1M, formData?.p3M, formData?.p1Y]);

  const placeholderText =
    (options || []).length === 0
      ? t('No data')
      : tn('%s option', '%s options', options.length, options.length);

  return (
    <FilterPluginStyle height={height} width={width}>
      <StyledFormItem
        validateStatus={filterState.validateStatus}
        {...formItemData}
      >
        <Select
          allowClear
          value={value}
          placeholder={placeholderText}
          // @ts-ignore
          onChange={handleChange}
          onBlur={unsetFocusedFilter}
          onFocus={setFocusedFilter}
          onMouseEnter={setHoveredFilter}
          onMouseLeave={unsetHoveredFilter}
          ref={inputRef}
          options={options}
          onDropdownVisibleChange={setFilterActive}
        />
      </StyledFormItem>
    </FilterPluginStyle>
  );
}
