import React from 'react';
 import { kebabCase } from 'lodash';
 import { TooltipPlacement } from 'antd/lib/tooltip';
 import { t } from '@superset-ui/core';
 import { Tooltip } from '../../packages/superset-ui-chart-controls/src/components/Tooltip';
 
 export interface CustomToolTipProps {
   label?: string;
   tooltip?: any;
   icon?: string;
   onClick?: () => void;
   placement?: TooltipPlacement;
   bsStyle?: string;
   className?: string;
 }
 
 export function CustomToolTip({
   label,
   tooltip,
   bsStyle,
   onClick,
   icon = 'info-circle',
   className = 'text-muted',
   placement = 'right',
 }: CustomToolTipProps) {
   const iconClass = `fa fa-${icon} ${className} ${
     bsStyle ? `text-${bsStyle}` : ''
   }`;
   const iconEl = (
     <i
       role="button"
       aria-label={t('Show info tooltip')}
       tabIndex={0}
       className={iconClass}
       style={{ cursor: onClick ? 'pointer' : undefined }}
     />
   );
   return (
     <Tooltip
       id={`${kebabCase(label)}-tooltip`}
       title={tooltip}
       placement={placement}
     >
       {iconEl}
     </Tooltip>
   );
 }
 
 export default CustomToolTip;
