import { getInitialState } from './nativeFilterReducer';
import { NativeFiltersState, FilterConfiguration } from '@superset-ui/core';

describe('getInitialState', () => {
  it('should return initial state when filterConfig is provided', () => {
    const filterConfig: FilterConfiguration = [
      { id: 'filter1', name: 'Filter 1' },
      { id: 'filter2', name: 'Filter 2' },
    ];

    const initialState = getInitialState({ filterConfig });

    expect(initialState).toEqual({
      filters: {
        filter1: { id: 'filter1', name: 'Filter 1' },
        filter2: { id: 'filter2', name: 'Filter 2' },
      },
      focusedFilterId: undefined,
    });
  });

  it('should return previous state when no filterConfig is provided', () => {
    const prevState: NativeFiltersState = {
      filters: {
        filter1: { id: 'filter1', name: 'Filter 1' },
      },
      focusedFilterId: 'filter1',
    };

    const initialState = getInitialState({ state: prevState });

    expect(initialState).toEqual({
      filters: {
        filter1: { id: 'filter1', name: 'Filter 1' },
      },
      focusedFilterId: undefined,
    });
  });

  it('should return an empty filters object when neither filterConfig nor prevState is provided', () => {
    const initialState = getInitialState({});

    expect(initialState).toEqual({
      filters: {},
      focusedFilterId: undefined,
    });
  });

  it('should prioritize filterConfig over prevState when both are provided', () => {
    const filterConfig: FilterConfiguration = [
      { id: 'filter2', name: 'Filter 2' },
    ];
    const prevState: NativeFiltersState = {
      filters: {
        filter1: { id: 'filter1', name: 'Filter 1' },
      },
      focusedFilterId: 'filter1',
    };

    const initialState = getInitialState({ filterConfig, state: prevState });

    expect(initialState).toEqual({
      filters: {
        filter2: { id: 'filter2', name: 'Filter 2' },
      },
      focusedFilterId: undefined,
    });
  });
});
