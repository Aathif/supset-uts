// FilterBar.test.jsx
import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { render, fireEvent, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Router } from 'react-router-dom';
import FilterBar from './FilterBar'; // Adjust the import path accordingly
import { updateDataMask, clearDataMask } from 'src/dataMask/actions';
import { logEvent } from 'src/logger/actions';
import { useSelector } from 'react-redux';
import { SLOW_DEBOUNCE } from '@superset-ui/core';

// Mocking actions
jest.mock('src/dataMask/actions', () => ({
  updateDataMask: jest.fn(),
  clearDataMask: jest.fn(),
}));

jest.mock('src/logger/actions', () => ({
  logEvent: jest.fn(),
}));

jest.mock('src/hooks/useTabId', () => ({
  useTabId: jest.fn(() => 'testTabId'),
}));

jest.mock('src/dataMask/reducer', () => ({
  getInitialDataMask: jest.fn(() => ({})),
}));

jest.mock('src/dashboard/util/extractUrlParams', () => ({
  extractAllUrlParams: jest.fn(() => ({})),
}));

jest.mock('lodash/debounce', () => jest.fn(fn => fn));

// Mock store setup
const mockStore = configureStore([]);
const initialState = {
  dashboardInfo: {
    id: 123,
    metadata: {},
    dash_edit_perm: true,
  },
  user: { userId: 1 },
  nativeFilters: {
    state: {},
  },
};

// Helper function to render component with store
const renderWithProvider = (component, store) => {
  const history = createMemoryHistory();
  return {
    ...render(
      <Provider store={store}>
        <Router history={history}>{component}</Router>
      </Provider>,
    ),
    history,
  };
};

describe('FilterBar component', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    jest.clearAllMocks();
  });

  it('should render the FilterBar component without crashing', () => {
    const { getByText } = renderWithProvider(<FilterBar />, store);
    expect(getByText('Apply')).toBeInTheDocument();
    expect(getByText('Clear All')).toBeInTheDocument();
  });

  it('should call updateDataMask on Apply button click', async () => {
    const { getByText } = renderWithProvider(<FilterBar />, store);
    
    // Simulate Apply button click
    fireEvent.click(getByText('Apply'));

    await waitFor(() => {
      expect(updateDataMask).toHaveBeenCalled();
      expect(logEvent).toHaveBeenCalledWith('LOG_ACTIONS_CHANGE_DASHBOARD_FILTER', {});
    });
  });

  it('should clear filters when Clear All button is clicked', async () => {
    const { getByText } = renderWithProvider(<FilterBar />, store);

    // Simulate Clear All button click
    fireEvent.click(getByText('Clear All'));

    await waitFor(() => {
      expect(clearDataMask).toHaveBeenCalledTimes(1);
    });
  });

  it('should not apply filters when isApplyDisabled is true', async () => {
    const customState = {
      ...initialState,
      nativeFilters: {
        state: {
          isApplyDisabled: true,
        },
      },
    };
    const customStore = mockStore(customState);
    const { getByText } = renderWithProvider(<FilterBar />, customStore);

    const applyButton = getByText('Apply');
    expect(applyButton).toBeDisabled();
  });

  it('should update URL params on filter selection change', async () => {
    const { history } = renderWithProvider(<FilterBar />, store);

    // Simulate filter selection change
    fireEvent.click(history.push, { pathname: '/superset/dashboard' });

    await waitFor(() => {
      expect(history.location.pathname).toBe('/superset/dashboard');
    });
  });

  it('should initialize filters correctly', async () => {
    const { getByText } = renderWithProvider(<FilterBar />, store);

    await waitFor(() => {
      expect(getByText('Apply')).toBeInTheDocument();
    });
  });

  it('should handle default filter reset', async () => {
    const { getByText } = renderWithProvider(<FilterBar />, store);

    // Simulate Default Reset button click
    fireEvent.click(getByText('Reset to default'));

    await waitFor(() => {
      expect(updateDataMask).toHaveBeenCalled();
    });
  });
});
