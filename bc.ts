import nativeFilterReducer, { getInitialState } from './nativeFilterReducer';
import {
  SET_FILTER_CONFIG_COMPLETE,
  SET_IN_SCOPE_STATUS_OF_FILTERS,
  SET_FOCUSED_NATIVE_FILTER,
  UNSET_FOCUSED_NATIVE_FILTER,
  SET_HOVERED_NATIVE_FILTER,
  UNSET_HOVERED_NATIVE_FILTER,
  UPDATE_CASCADE_PARENT_IDS,
} from 'src/dashboard/actions/nativeFilters';
import { HYDRATE_DASHBOARD } from '../actions/hydrate';

describe('nativeFilterReducer', () => {
  const initialState = {
    filters: {},
    focusedFilterId: undefined,
    hoveredFilterId: undefined,
  };

  it('should return the initial state when no action is provided', () => {
    const result = nativeFilterReducer(undefined, {});
    expect(result).toEqual(initialState);
  });

  it('should handle HYDRATE_DASHBOARD action', () => {
    const action = {
      type: HYDRATE_DASHBOARD,
      data: {
        nativeFilters: {
          filters: {
            filter1: { id: 'filter1', name: 'Filter 1' },
            filter2: { id: 'filter2', name: 'Filter 2' },
          },
        },
      },
    };
    const result = nativeFilterReducer(initialState, action);
    expect(result.filters).toEqual({
      filter1: { id: 'filter1', name: 'Filter 1' },
      filter2: { id: 'filter2', name: 'Filter 2' },
    });
  });

  it('should handle SET_FILTER_CONFIG_COMPLETE action', () => {
    const action = {
      type: SET_FILTER_CONFIG_COMPLETE,
      filterConfig: [
        { id: 'filter1', name: 'Filter 1' },
        { id: 'filter2', name: 'Filter 2' },
      ],
    };
    const result = nativeFilterReducer(initialState, action);
    expect(result.filters).toEqual({
      filter1: { id: 'filter1', name: 'Filter 1' },
      filter2: { id: 'filter2', name: 'Filter 2' },
    });
  });

  it('should handle SET_FOCUSED_NATIVE_FILTER action', () => {
    const action = {
      type: SET_FOCUSED_NATIVE_FILTER,
      id: 'filter1',
    };
    const result = nativeFilterReducer(initialState, action);
    expect(result.focusedFilterId).toEqual('filter1');
  });

  it('should handle UNSET_FOCUSED_NATIVE_FILTER action', () => {
    const action = {
      type: UNSET_FOCUSED_NATIVE_FILTER,
    };
    const currentState = {
      ...initialState,
      focusedFilterId: 'filter1',
    };
    const result = nativeFilterReducer(currentState, action);
    expect(result.focusedFilterId).toBeUndefined();
  });

  it('should handle SET_HOVERED_NATIVE_FILTER action', () => {
    const action = {
      type: SET_HOVERED_NATIVE_FILTER,
      id: 'filter2',
    };
    const result = nativeFilterReducer(initialState, action);
    expect(result.hoveredFilterId).toEqual('filter2');
  });

  it('should handle UNSET_HOVERED_NATIVE_FILTER action', () => {
    const action = {
      type: UNSET_HOVERED_NATIVE_FILTER,
    };
    const currentState = {
      ...initialState,
      hoveredFilterId: 'filter2',
    };
    const result = nativeFilterReducer(currentState, action);
    expect(result.hoveredFilterId).toBeUndefined();
  });

  it('should handle UPDATE_CASCADE_PARENT_IDS action', () => {
    const action = {
      type: UPDATE_CASCADE_PARENT_IDS,
      id: 'filter1',
      parentIds: ['parent1', 'parent2'],
    };
    const currentState = {
      ...initialState,
      filters: {
        filter1: { id: 'filter1', cascadeParentIds: [] },
      },
    };
    const result = nativeFilterReducer(currentState, action);
    expect(result.filters.filter1.cascadeParentIds).toEqual([
      'parent1',
      'parent2',
    ]);
  });

  it('should return the current state for unknown action types', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const result = nativeFilterReducer(initialState, action);
    expect(result).toEqual(initialState);
  });
});
