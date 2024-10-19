import React, { useCallback, useState } from 'react';
import Popover from 'src/components/Popover';
import { FormattingPopoverContent } from './FormattingPopoverContent';
import { TenantLevelTargetValue, FormattingPopoverTenantProps } from './types';
 
export const FormattingPopover = ({
  title,
  onChange,
  config,
  children,
  ...props
}: FormattingPopoverTenantProps) => {
  const [visible, setVisible] = useState(false);
 
 
  const handleSave = useCallback(
    (newConfig: TenantLevelTargetValue) => {
      setVisible(false);
      if (newConfig && newConfig?.tenantId && newConfig?.tenantId === 'Default Chart') {
        newConfig['defaultTenant'] = true;
      }
      onChange(newConfig);
    },
    [onChange],
  );
 
  const handleClose = () => {
    setVisible(false);
  }
 
 
  return (
    <Popover
      title={title}
      content={
        <FormattingPopoverContent
          onChange={handleSave}
          config={config}
          handleClose={handleClose}
        />
      }
      visible={visible}
      onVisibleChange={setVisible}
      trigger={['click']}
      {...props}
    >
      {children}
    </Popover>
  );
};
 
