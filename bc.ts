import dashboardStateReducer from './dashboardStateReducer';
import {
  DASHBOARD_INFO_UPDATED,
  SET_FILTER_BAR_ORIENTATION,
  SET_CROSS_FILTERS_ENABLED,
} from '../actions/dashboardInfo';
import { HYDRATE_DASHBOARD } from '../actions/hydrate';

describe('dashboardStateReducer', () => {
  const initialState = {
    last_modified_time: 0,
    filterBarOrientation: 'top',
    crossFiltersEnabled: false,
  };

  it('should return the initial state when no action is provided', () => {
    const result = dashboardStateReducer(undefined, {});
    expect(result).toEqual({});
  });

  it('should handle DASHBOARD_INFO_UPDATED action', () => {
    const newInfo = { title: 'New Dashboard Title' };
    const action = {
      type: DASHBOARD_INFO_UPDATED,
      newInfo,
    };
    const result = dashboardStateReducer(initialState, action);
    expect(result.title).toEqual(newInfo.title);
    expect(result.last_modified_time).toBeGreaterThan(0); // Ensures that the last_modified_time is updated
  });

  it('should handle HYDRATE_DASHBOARD action', () => {
    const action = {
      type: HYDRATE_DASHBOARD,
      data: {
        dashboardInfo: {
          title: 'Hydrated Dashboard',
          last_modified_time: 12345,
        },
      },
    };
    const result = dashboardStateReducer(initialState, action);
    expect(result.title).toEqual('Hydrated Dashboard');
    expect(result.last_modified_time).toEqual(12345); // Verifying that last_modified_time is set from the action
  });

  it('should handle SET_FILTER_BAR_ORIENTATION action', () => {
    const action = {
      type: SET_FILTER_BAR_ORIENTATION,
      filterBarOrientation: 'left',
    };
    const result = dashboardStateReducer(initialState, action);
    expect(result.filterBarOrientation).toEqual('left');
  });

  it('should handle SET_CROSS_FILTERS_ENABLED action', () => {
    const action = {
      type: SET_CROSS_FILTERS_ENABLED,
      crossFiltersEnabled: true,
    };
    const result = dashboardStateReducer(initialState, action);
    expect(result.crossFiltersEnabled).toEqual(true);
  });

  it('should return the current state for unknown action types', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const result = dashboardStateReducer(initialState, action);
    expect(result).toEqual(initialState);
  });
});
