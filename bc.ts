import React, { useCallback, useEffect, useState } from 'react';
import Popover from 'src/components/Popover';
import { t, QueryMode } from '@superset-ui/core';
import { FormattingPopoverContent } from './FormattingPopoverContent';
import { ConditionalFormattingConfigTenant, FormattingPopoverTenantProps } from './types';
import { getChartDataRequest } from 'src/components/Chart/chartAction';

export const FormattingPopover = ({
  title,
  columns,
  datasource,
  onChange,
  config,
  children,
  formData,
  controls,
  groupByOptions,
  ...props
}: FormattingPopoverTenantProps) => {
  const [visible, setVisible] = useState(false);
  const [configResp, setConfigResp] = useState({});
  const [tenant, setTenant] = useState(0);
  const [queryMode, setQueryMode] = useState('aggregate');
  const [groupby, setGroupby] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [allColumns, setAllColumns] = useState([]);
  const [adhocFilters, setAdhocFilters] = useState([]);
  const [percentMetrics, setPercentMetrics] = useState([]);
  const [orderByCols, setOrderByCols] = useState([]);
  const [orderDesc, setOrderDesc] = useState(true);
  const [limitMetric, setLimitMetric] = useState('');

  useEffect(() => {
    (async () => {
      if (visible===true && config && Object.keys(config).length > 0) {
        let tempFormData = {...formData};
        if ('tenantId' in config){
          tempFormData['tenant_id'] = config['tenantId'];
        }
        if ('queryMode' in config) {
          tempFormData['query_mode'] = config['queryMode'];
          setQueryMode(tempFormData['query_mode']);
          if (config['queryMode'] === 'raw') {
            tempFormData['all_columns'] = config['allColumns'] || [];
            tempFormData['order_by_cols'] = config['orderbyCols'] || [];
            setAllColumns(tempFormData['all_columns']);
            setOrderByCols(tempFormData['order_by_cols']);
          } else {
            tempFormData['groupby'] = config['groupby'] || [];
            tempFormData['metrics'] = config['metrics'] || [];
            tempFormData['percent_metrics'] = config['percentMetrics'] || [];
            tempFormData['order_desc'] = config['orderDesc'];
            tempFormData['timeseries_limit_metric'] = config['limitMetric'] || '';
            setGroupby(tempFormData['groupby']);
            setMetrics(tempFormData['metrics']);
            setPercentMetrics(tempFormData['percent_metrics']);
            setOrderDesc(tempFormData['order_desc']);
            setLimitMetric(tempFormData['timeseries_limit_metric']);
          }
          tempFormData['adhoc_filters'] = config['adhocFilters'] || [];
          setAdhocFilters(tempFormData['adhoc_filters']);
        }
        makeRequest(tempFormData);
      }
    })();
  }, [visible, config !== undefined]);

  const setQueryData = (mode: any) => {
    setQueryMode(mode);
  }

  const onTenantChange = (tenantId: any) => {
    setTenant(tenantId)
  }

  const onColumnChange = (columns: any, type: any, req: any=true) => {
    let tempFormData = {...formData};
    let configData = {...config} as any;
    if (config === undefined && tenant) {
      tempFormData['tenant_id'] = tenant;
    } else {
      tempFormData['tenant_id'] = configData['tenantId'];
    }
    if (type === 'query_mode') {
      tempFormData['query_mode'] = columns;
      setQueryMode(columns);
      if (tempFormData['query_mode'] === 'raw') {
        tempFormData['all_columns'] = allColumns || [];
        tempFormData['order_by_cols'] = orderByCols || [];
        if (tempFormData['all_columns'].length === 0) {
          return false;
        }
      } else {
        tempFormData['groupby'] = groupby || [];
        if (tempFormData['groupby'].length === 0) {
          return false;
        }
        tempFormData['metrics'] = metrics || [];
        tempFormData['percent_metrics'] = percentMetrics || [];
        tempFormData['order_desc'] = orderDesc;
        tempFormData['timeseries_limit_metric'] = limitMetric;
      }
      tempFormData['adhoc_filters'] = adhocFilters || [];
    } else {
      tempFormData['query_mode'] = queryMode;
      if (type === 'groupby') {
        tempFormData['groupby'] = columns;
        tempFormData['metrics'] = metrics;
        tempFormData['adhoc_filters'] = adhocFilters;
        tempFormData['percent_metrics'] = percentMetrics;
        tempFormData['timeseries_limit_metric'] = limitMetric;
        tempFormData['order_desc'] = orderDesc;
        setGroupby(columns);
      } else if (type === 'all_columns') {
        tempFormData['all_columns'] = columns;
        tempFormData['metrics'] = metrics;
        tempFormData['adhoc_filters'] = adhocFilters;
        tempFormData['percent_metrics'] = percentMetrics;
        tempFormData['order_by_cols'] = orderByCols;
        setAllColumns(columns);
      } else if (type === 'metrics') {
        if (queryMode === 'raw') {
          tempFormData['all_columns'] = allColumns || [];
          tempFormData['order_by_cols'] = orderByCols;
        } else {
          tempFormData['groupby'] = groupby || [];
          tempFormData['timeseries_limit_metric'] = limitMetric;
          tempFormData['order_desc'] = orderDesc;
        }
        tempFormData['order_by_cols'] = orderByCols;
        tempFormData['metrics'] = columns;
        tempFormData['adhoc_filters'] = adhocFilters;
        tempFormData['percent_metrics'] = percentMetrics;
        setMetrics(columns);
      } else if (type === 'adhoc_filters') {
        if (queryMode === 'raw') {
          tempFormData['all_columns'] = allColumns || [];
          tempFormData['order_by_cols'] = orderByCols;
        } else {
          tempFormData['groupby'] = groupby || [];
          tempFormData['timeseries_limit_metric'] = limitMetric;
          tempFormData['order_desc'] = orderDesc;
        }
        tempFormData['metrics'] = metrics;
        tempFormData['adhoc_filters'] = columns;
        tempFormData['percent_metrics'] = percentMetrics;
        setAdhocFilters(columns);
      } else if (type === 'percent_metrics') {
        if (queryMode === 'raw') {
          tempFormData['all_columns'] = allColumns || [];
          tempFormData['order_by_cols'] = orderByCols;
        } else {
          tempFormData['groupby'] = groupby || [];
          tempFormData['timeseries_limit_metric'] = limitMetric;
          tempFormData['order_desc'] = orderDesc;
        }
        tempFormData['metrics'] = metrics;
        tempFormData['adhoc_filters'] = adhocFilters;
        tempFormData['percent_metrics'] = columns;
        setPercentMetrics(columns);
      } else if (type === 'order_by_cols') {
        if (queryMode === 'raw') {
          tempFormData['all_columns'] = allColumns || [];
          tempFormData['order_by_cols'] = columns;
        } else {
          tempFormData['groupby'] = groupby || [];
          tempFormData['timeseries_limit_metric'] = limitMetric;
          tempFormData['order_desc'] = orderDesc;
        }
        tempFormData['metrics'] = metrics;
        tempFormData['adhoc_filters'] = adhocFilters;
        tempFormData['percent_metrics'] = percentMetrics;
        setOrderByCols(columns);
      } else if (type === 'order_desc') {
        if (queryMode === 'raw') {
          tempFormData['all_columns'] = allColumns || [];
          tempFormData['order_by_cols'] = orderByCols;
        } else {
          tempFormData['groupby'] = groupby || [];
          tempFormData['timeseries_limit_metric'] = limitMetric;
          tempFormData['order_desc'] = columns;
        }
        tempFormData['metrics'] = metrics;
        tempFormData['adhoc_filters'] = adhocFilters;
        tempFormData['percent_metrics'] = percentMetrics;
        setOrderDesc(columns);
      } else if (type === 'timeseries_limit_metric') {
        if (queryMode === 'raw') {
          tempFormData['all_columns'] = allColumns || [];
          tempFormData['order_by_cols'] = orderByCols;
        } else {
          tempFormData['groupby'] = groupby || [];
          tempFormData['timeseries_limit_metric'] = columns;
          tempFormData['order_desc'] = orderDesc;
        }
        tempFormData['metrics'] = metrics;
        tempFormData['adhoc_filters'] = adhocFilters;
        tempFormData['percent_metrics'] = percentMetrics;
        setLimitMetric(columns)
      }
    }
    if (req === true) {
      makeRequest(tempFormData);
    }
    return true;
  }

  const makeRequest = async (tempFormData: any) => {
    let data = await getChartDataRequest({
      formData: {...tempFormData},
      resultFormat: 'json',
      resultType: 'full',
      force: false,
    })
    if (data && 'json' in data && data['json'] && 'result' in data['json'] && data['json']['result'] && data['json']['result'].length == 1) {
      setConfigResp(data['json']['result'][0])
    }
  }

  const handleSave = useCallback(
    (newConfig: ConditionalFormattingConfigTenant) => {
      setVisible(false);
      if (newConfig && newConfig?.tenantId && newConfig?.tenantId === 'Default Chart') {
        newConfig['defaultTenant'] = true;
      }
      onChange(newConfig);
      setConfigResp({});
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
          columns={columns}
          datasource={datasource}
          configResp={configResp}
          onColumnChange={onColumnChange}
          onTenantChange={onTenantChange}
          vizType={formData?.viz_type}
          controls={controls}
          groupByOptions={groupByOptions}
          setQueryData={setQueryData}
          queryMode={queryMode}
          handleClose={handleClose}
        />
      }
      visible={visible}
      onVisibleChange={setVisible}
      trigger={['click']}
      overlayStyle={{ width: '450px', height: '80vh', overflowY: 'scroll' }}
      {...props}
    >
      {children}
    </Popover>
  );
};
