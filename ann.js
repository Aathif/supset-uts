import React, {
  useEffect,
  useState,
  useCallback,
  createContext,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DataMaskStateWithId,
  DataMaskWithId,
  Filter,
  DataMask,
  SLOW_DEBOUNCE,
  isNativeFilter,
  usePrevious,
  styled,
} from '@superset-ui/core';
import { useHistory } from 'react-router-dom';
import { updateDataMask, clearDataMask } from 'src/dataMask/actions';
import { useImmer } from 'use-immer';
import { isEmpty, isEqual, debounce, cloneDeep } from 'lodash';
import { getInitialDataMask } from 'src/dataMask/reducer';
import { URL_PARAMS } from 'src/constants';
import { getUrlParam } from 'src/utils/urlUtils';
import { useTabId } from 'src/hooks/useTabId';
import { logEvent } from 'src/logger/actions';
import { LOG_ACTIONS_CHANGE_DASHBOARD_FILTER } from 'src/logger/LogUtils';
import { FilterBarOrientation, RootState } from 'src/dashboard/types';
import { UserWithPermissionsAndRoles } from 'src/types/bootstrapTypes';
import { checkIsApplyDisabled } from './utils';
import { FiltersBarProps } from './types';
import {
  useNativeFiltersDataMask,
  useFilters,
  useFilterUpdates,
  useInitialization,
} from './state';
import { createFilterKey, updateFilterKey } from './keyValue';
import ActionButtons from './ActionButtons';
import Horizontal from './Horizontal';
import Vertical from './Vertical';
import { useSelectFiltersInScope } from '../state';
import { extractAllUrlParams } from 'src/dashboard/util/extractUrlParams';

// FilterBar is just being hidden as it must still
// render fully due to encapsulated logics
const HiddenFilterBar = styled.div`
  display: none;
`;

const EXCLUDED_URL_PARAMS: string[] = [
  URL_PARAMS.nativeFilters.name,
  URL_PARAMS.permalinkKey.name,
];

const dataMaskWithQueryParams = (dataMaskApplied: any, dispatch: any, updateDataMask:any, metadata:any) => {
  const allUrlParams = extractAllUrlParams('all');
  let dataMaskKeys = Object.keys(dataMaskApplied);
  let appliedDataMask : any = cloneDeep(dataMaskApplied);
  if (dataMaskKeys && allUrlParams && Object.keys(allUrlParams).length > 0) {
    let urlParams = Object.keys(allUrlParams);
    urlParams.map(param => {
      dataMaskKeys.map((keys, index) => {
        let mask: any = {...appliedDataMask[keys]?.['extraFormData']};
        if (mask && Object.keys(mask).length > 0 && mask.hasOwnProperty('filters')) {
          let col = mask['filters']?.[0]?.['col'];
          let val = mask['filters']?.[0]?.['val'];
          if(col === param && allUrlParams[col] && Array.isArray(val) && metadata && (metadata?.drilldown_select_filters === undefined || metadata?.drilldown_select_filters.length === 0 || metadata?.drilldown_select_filters.includes(col))) {
            let splitData = allUrlParams[col];
            if (splitData && splitData.length > 0) {
              if (!Array.isArray(splitData)) {
                splitData = [splitData];
              }
              let values : any = new Set([...val, ...splitData]);
              values = [...values];
              mask['filters'] = [{...mask?.filters[0], ...{'val': values}}]
              appliedDataMask[keys]['extraFormData']['filters'] = mask['filters'];
              appliedDataMask[keys]['filterState']['label'] = values.join(', ');
              appliedDataMask[keys]['filterState']['value'] = values;
              dispatch(updateDataMask(keys, appliedDataMask[keys]));
            }
          }
        } else {
          let nativeFilter = keys.split('NATIVE_FILTER-');
          if (nativeFilter && nativeFilter.length > 1) {
            let filterType = nativeFilter[1].split('-');
            if (filterType && filterType.length === 3 && filterType[1] === param && (filterType[2] === 'filter_select' || filterType[2] === 'filter_checkbox' || filterType[2] === 'filter_radio' || filterType[2] === 'filter_textbox')) {
              let splitData = allUrlParams[param];
              if (splitData && splitData.length > 0 && metadata && (metadata?.drilldown_select_filters === undefined || metadata?.drilldown_select_filters.length === 0 || metadata?.drilldown_select_filters.includes(param))) {
                if (!Array.isArray(splitData)) {
                  splitData = [splitData];
                }
                let values : any = new Set([...splitData]);
                values = [...values];
                mask['filters'] = [];
                mask['filters'] = [{...mask?.filters[0], ...{col: param, op: 'IN', val: values}}]
                appliedDataMask[keys]['extraFormData']['filters'] = mask['filters']
                appliedDataMask[keys]['filterState']['label'] = values.join(', ');
                appliedDataMask[keys]['filterState']['value'] = values;
                dispatch(updateDataMask(keys, appliedDataMask[keys]));
              }
            } else if (filterType && filterType.length === 3 && filterType[2] === 'filter_time') {
              let splitData = allUrlParams['time_range'];
              if (splitData && splitData.length > 0 && metadata && (metadata?.drilldown_select_filters === undefined || metadata?.drilldown_select_filters.length === 0 || metadata?.drilldown_select_filters.includes('time_range'))) {
                appliedDataMask[keys]['extraFormData']['time_range'] = splitData;
                // appliedDataMask[keys]['filterState']['label'] = values.join(', ');
                appliedDataMask[keys]['filterState']['value'] = splitData;
                dispatch(updateDataMask(keys, appliedDataMask[keys]));
              }
            } else if (filterType && filterType.length === 3 && filterType[2] === 'filter_timegrain') {
              let splitData = allUrlParams['time_grain_sqla'];
              if (splitData && splitData.length > 0 && metadata && (metadata?.drilldown_select_filters === undefined || metadata?.drilldown_select_filters.length === 0 || metadata?.drilldown_select_filters.includes('time_grain_sqla'))) {
                appliedDataMask[keys]['extraFormData']['time_grain_sqla'] = splitData;
                // appliedDataMask[keys]['filterState']['label'] = values.join(', ');
                appliedDataMask[keys]['filterState']['value'] = splitData;
                dispatch(updateDataMask(keys, appliedDataMask[keys]));
              }
            }
          }
        }
      })
    })
  }
  return appliedDataMask;
}

let isFirst = true;

const publishDataMask = debounce(
  async (
    history,
    dashboardId,
    updateKey,
    dataMaskSelected: DataMaskStateWithId,
    tabId,
    applyFilter,
    dispatch,
    updateDataMask, 
    metadata
  ) => {
    const { location } = history;
    const { search } = location;
    const previousParams = new URLSearchParams(search);
    const newParams = new URLSearchParams();
    let dataMaskKey: string | null;
    previousParams.forEach((value, key) => {
      if (!EXCLUDED_URL_PARAMS.includes(key)) {
        newParams.append(key, value);
      }
    });

    const nativeFiltersCacheKey = getUrlParam(URL_PARAMS.nativeFiltersKey);
    const dataMask = JSON.stringify(dataMaskSelected);
    if (sessionStorage.getItem(dashboardId) && applyFilter === 0) {
      dataMaskKey = sessionStorage.getItem(dashboardId);
    } else if (
      updateKey &&
      nativeFiltersCacheKey
    ) {
      dataMaskKey = (await updateFilterKey(
        dashboardId,
        dataMask,
        nativeFiltersCacheKey,
        tabId,
      ));
      if (!dataMaskKey) {
        dataMaskKey = await createFilterKey(dashboardId, dataMask, tabId);
      }
    } else {
      dataMaskKey = await createFilterKey(dashboardId, dataMask, tabId);
    }
    if (dataMaskKey) {
      newParams.set(URL_PARAMS.nativeFiltersKey.name, dataMaskKey);
    }

    if (dataMaskSelected && isFirst === true) {
      dataMaskSelected = dataMaskWithQueryParams(dataMaskSelected, dispatch, updateDataMask, metadata);
      isFirst = false;
    }

    // pathname could be updated somewhere else through window.history
    // keep react router history in sync with window history
    // replace params only when current page is /superset/dashboard
    // this prevents a race condition between updating filters and navigating to Explore
    if (window.location.pathname.includes('/superset/dashboard')) {
      history.location.pathname = window.location.pathname;
      history.replace({
        search: newParams.toString(),
      });
    }
  },
  SLOW_DEBOUNCE,
);

export const FilterBarScrollContext = createContext(false);
const FilterBar: React.FC<FiltersBarProps> = ({
  orientation = FilterBarOrientation.Vertical,
  verticalConfig,
  hidden = false,
}) => {
  const history = useHistory();
  const dataMaskApplied: DataMaskStateWithId = useNativeFiltersDataMask();
  const [dataMaskSelected, setDataMaskSelected] =
    useImmer<DataMaskStateWithId>(dataMaskApplied);
  const dispatch = useDispatch();
  const [updateKey, setUpdateKey] = useState(0);
  const [applyFilter, setApplyFilter] = useState(0);
  const tabId = useTabId();
  const filters = useFilters();
  const previousFilters = usePrevious(filters);
  const filterValues = Object.values(filters);
  const nativeFilterValues = filterValues.filter(isNativeFilter);
  const dashboardId = useSelector<any, number>(
    ({ dashboardInfo }) => dashboardInfo?.id,
  );
  const metadata = useSelector<RootState, any>(
    state => state.dashboardInfo?.metadata,
  );
  const previousDashboardId = usePrevious(dashboardId);
  const canEdit = useSelector<RootState, boolean>(
    ({ dashboardInfo }) => dashboardInfo.dash_edit_perm,
  );
  const [defaultData, setDefaultData] = useState({});

  const [filtersInScope] = useSelectFiltersInScope(nativeFilterValues);

  const dataMaskSelectedRef = useRef(dataMaskSelected);
  dataMaskSelectedRef.current = dataMaskSelected;

  useEffect(() => {
    let temp = {}
    Object.entries(filters).forEach(([key, val]) => {
  
      temp[filters[key].id]= filters[key]?.defaultDataMask?.filterState?.value;
  });
    setDefaultData(temp)
  },[])
  const user: UserWithPermissionsAndRoles = useSelector<
    RootState,
    UserWithPermissionsAndRoles
  >(state => state.user);

  const handleFilterSelectionChange = useCallback(
    (
      filter: Pick<Filter, 'id'> & Partial<Filter>,
      dataMask: Partial<DataMask>,
    ) => {
      setDataMaskSelected(draft => {
        // force instant updating on initialization for filters with `requiredFirst` is true or instant filters
        if (
          // filterState.value === undefined - means that value not initialized
          dataMask.filterState?.value !== undefined &&
          dataMaskSelectedRef.current[filter.id]?.filterState?.value ===
            undefined &&
          filter.requiredFirst
        ) {
          dispatch(updateDataMask(filter.id, dataMask));
        }
        draft[filter.id] = {
          ...(getInitialDataMask(filter.id) as DataMaskWithId),
          ...dataMask,
        };
      });
    },
    [dispatch, setDataMaskSelected],
  );

  useEffect(() => {
    if (previousFilters && dashboardId === previousDashboardId) {
      const updates = {};
      Object.values(filters).forEach(currentFilter => {
        const previousFilter = previousFilters?.[currentFilter.id];
        if (!previousFilter) {
          return;
        }
        const currentType = currentFilter.filterType;
        const currentTargets = currentFilter.targets;
        const currentDataMask = currentFilter.defaultDataMask;
        const previousType = previousFilter?.filterType;
        const previousTargets = previousFilter?.targets;
        const previousDataMask = previousFilter?.defaultDataMask;
        const typeChanged = currentType !== previousType;
        const targetsChanged = !isEqual(currentTargets, previousTargets);
        const dataMaskChanged = !isEqual(currentDataMask, previousDataMask);

        if (typeChanged || targetsChanged || dataMaskChanged) {
          updates[currentFilter.id] = getInitialDataMask(currentFilter.id);
        }
      });

      if (!isEmpty(updates)) {
        setDataMaskSelected(draft => ({ ...draft, ...updates }));
        Object.keys(updates).forEach(key => dispatch(clearDataMask(key)));
      }
    }
  }, [
    JSON.stringify(filters),
    JSON.stringify(previousFilters),
    previousDashboardId,
  ]);

  const dataMaskAppliedText = JSON.stringify(dataMaskApplied);

  useEffect(() => {
    setDataMaskSelected(() => dataMaskApplied);
  }, [dataMaskAppliedText, setDataMaskSelected]);

  useEffect(() => {
    // embedded users can't persist filter combinations
    if (user?.userId) {
      publishDataMask(history, dashboardId, updateKey, dataMaskApplied, tabId, applyFilter, dispatch, updateDataMask, metadata);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardId, dataMaskAppliedText, history, updateKey, tabId]);

  const setNativeFilterKey = () => {
    const nativeFiltersKey = getUrlParam(URL_PARAMS.nativeFiltersKey);
    if (dashboardId && nativeFiltersKey) {
        sessionStorage.setItem(dashboardId as any, nativeFiltersKey);
    }
  }

  const handleDefaultReset = useCallback(() => {
    const filterIds = Object.keys(dataMaskSelected);
    filterIds.forEach(filterId => {
      if (dataMaskSelected[filterId]) {
        setDataMaskSelected(draft => {
          let defaultValue = defaultData[filterId]
            draft[filterId].filterState!.value = defaultValue;
        });
      }
    });
  }, [dataMaskSelected,defaultData, dispatch, setDataMaskSelected]);

  const resetParams = () => {
    setNativeFilterKey();
    window.location.href = window.location.href.split("?")[0];
  }

  const handleApply = useCallback(() => {
    dispatch(logEvent(LOG_ACTIONS_CHANGE_DASHBOARD_FILTER, {}));
    const filterIds = Object.keys(dataMaskSelected);
    setUpdateKey(1);
    setApplyFilter(1);
    filterIds.forEach(filterId => {
      if (dataMaskSelected[filterId]) {
        dispatch(updateDataMask(filterId, dataMaskSelected[filterId]));
      }
    });
    setNativeFilterKey();
  }, [dataMaskSelected, dispatch]);

  const handleClearAll = useCallback(() => {
    const clearDataMaskIds: string[] = [];
    let dispatchAllowed = false;
    filtersInScope.filter(isNativeFilter).forEach(filter => {
      const { id } = filter;
      if (dataMaskSelected[id]) {
        if (filter.controlValues?.enableEmptyFilter) {
          dispatchAllowed = false;
        }
        clearDataMaskIds.push(id);
        setDataMaskSelected(draft => {
          if (draft[id].filterState?.value !== undefined) {
            draft[id].filterState!.value = undefined;
          }
        });
      }
    });
    setNativeFilterKey();
    if (dispatchAllowed) {
      clearDataMaskIds.forEach(id => dispatch(clearDataMask(id)));
    }
  }, [dataMaskSelected, dispatch, filtersInScope, setDataMaskSelected]);

  useFilterUpdates(dataMaskSelected, setDataMaskSelected);
  const isApplyDisabled = checkIsApplyDisabled(
    dataMaskSelected,
    dataMaskApplied,
    filtersInScope.filter(isNativeFilter),
  );
  const isInitialized = useInitialization();

  const actions = (
    <ActionButtons
      filterBarOrientation={orientation}
      width={verticalConfig?.width}
      onApply={handleApply}
      onClearAll={handleClearAll}
      dataMaskSelected={dataMaskSelected}
      dataMaskApplied={dataMaskApplied}
      isApplyDisabled={isApplyDisabled}
      handleDefaultReset={handleDefaultReset}
      resetParams={resetParams}
    />
  );

  const filterBarComponent =
    orientation === FilterBarOrientation.Horizontal ? (
      <Horizontal
        actions={actions}
        canEdit={canEdit}
        dashboardId={dashboardId}
        dataMaskSelected={dataMaskSelected}
        filterValues={filterValues}
        isInitialized={isInitialized}
        onSelectionChange={handleFilterSelectionChange}
      />
    ) : verticalConfig ? (
      <Vertical
        actions={actions}
        canEdit={canEdit}
        dataMaskSelected={dataMaskSelected}
        filtersOpen={verticalConfig.filtersOpen}
        filterValues={filterValues}
        isInitialized={isInitialized}
        height={verticalConfig.height}
        offset={verticalConfig.offset}
        onSelectionChange={handleFilterSelectionChange}
        toggleFiltersBar={verticalConfig.toggleFiltersBar}
        width={verticalConfig.width}
        setDataMaskSelected={setDataMaskSelected}
      />
    ) : null;

  return hidden ? (
    <HiddenFilterBar>{filterBarComponent}</HiddenFilterBar>
  ) : (
    filterBarComponent
  );
};
export default React.memo(FilterBar);
