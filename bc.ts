import React, { useCallback, useState } from 'react';
import Popover from 'src/components/Popover';
import { ColumnGroupByAggregatePopoverContent } from './ColumnGroupByAggregatePopoverContent';
import {
  ColumnGroupByAggregateConfig,
  ColumnGroupByAggregatePopoverProps,
} from './types';

export const ColumnGroupByAggregatePopover = ({
  title,
  columns,
  onChange,
  config,
  children,
  ...props
}: ColumnGroupByAggregatePopoverProps) => {
  const [visible, setVisible] = useState(false);

  const handleSave = useCallback(
    (newConfig: ColumnGroupByAggregateConfig) => {
      setVisible(false);
      onChange(newConfig);
    },
    [onChange],
  );

  return (
    <Popover
      title={title}
      content={
        <ColumnGroupByAggregatePopoverContent
          onChange={handleSave}
          config={config}
          column={columns}
        />
      }
      visible={visible}
      onVisibleChange={setVisible}
      trigger={['click']}
      overlayStyle={{ width: '450px' }}
      {...props}
    >
      {children}
    </Popover>
  );
};
