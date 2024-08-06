import React from 'react';
import { GenericDataType } from '@superset-ui/core';
import ControlForm, {
  ControlFormRow,
  ControlFormItem,
  ControlFormItemSpec,
} from '../../../components/ControlForm';
import {
  SHARED_COLUMN_CONFIG_PROPS,
  SharedColumnConfigProp,
} from './constants';
import {
  ColumnConfig,
  ColumnConfigFormLayout,
  ColumnConfigInfo,
} from './types';

export type ColumnConfigPopoverProps = {
  column: ColumnConfigInfo;
  configFormLayout: ColumnConfigFormLayout;
  onChange: (value: ColumnConfig) => void;
  cols: any;
};

export default function ColumnConfigPopover({
  column,
  configFormLayout,
  onChange,
  cols
}: ColumnConfigPopoverProps) {
  return (
    <ControlForm onChange={onChange} value={column.config}>
      {configFormLayout[
        column.type === undefined ? GenericDataType.String : column.type
      ].map((row, i) => (
        <ControlFormRow key={i}>
          {row.map(meta => {
            const key = typeof meta === 'string' ? meta : meta.name;
            const override =
              typeof meta === 'string'
                ? {}
                : 'override' in meta
                ? meta.override
                : meta.config;
            const props = {
              ...(key in SHARED_COLUMN_CONFIG_PROPS
                ? SHARED_COLUMN_CONFIG_PROPS[key as SharedColumnConfigProp]
                : undefined),
              ...override,
            } as ControlFormItemSpec;
            return <ControlFormItem key={key} name={key} cols={cols} {...props} />;
          })}
        </ControlFormRow>
      ))}
    </ControlForm>
  );
}
