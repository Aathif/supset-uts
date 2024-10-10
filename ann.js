// VerticalFilterBar.test.jsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import VerticalFilterBar, { FilterBarScrollContext } from './VerticalFilterBar'; // Adjust the import path
import { throttle } from 'lodash';
import { FeatureFlag, isFeatureEnabled } from '@superset-ui/core';

// Mock dependencies
jest.mock('lodash/throttle', () => jest.fn(fn => fn)); // Mock throttle to make tests easier
jest.mock('src/components/Loading', () => () => <div>Loading...</div>);
jest.mock('src/components/EmptyState', () => ({
  EmptyStateSmall: () => <div>No global filters</div>,
}));
jest.mock('@superset-ui/core', () => ({
  t: jest.fn(str => str),
  isFeatureEnabled: jest.fn(),
  FeatureFlag: { DashboardCrossFilters: 'DASHBOARD_CROSS_FILTERS' },
}));

// Test configuration
const setup = (propsOverride = {}) => {
  const props = {
    actions: <div>Actions</div>,
    canEdit: true,
    dataMaskSelected: {},
    filtersOpen: true,
    filterValues: [],
    height: 500,
    isInitialized: true,
    offset: 0,
    onSelectionChange: jest.fn(),
    toggleFiltersBar: jest.fn(),
    width: 200,
    setDataMaskSelected: jest.fn(),
    ...propsOverride,
  };

  const history = createMemoryHistory();
  return render(
    <Router history={history}>
      <VerticalFilterBar {...props} />
    </Router>,
  );
};

describe('VerticalFilterBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { getByText } = setup();
    expect(getByText('Actions')).toBeInTheDocument();
  });

  it('should display "Loading" when not initialized', () => {
    const { getByText } = setup({ isInitialized: false });
    expect(getByText('Loading')).toBeInTheDocument();
  });

  it('should display "No global filters" when there are no filters and canEdit is true', () => {
    const { getByText } = setup({ filterValues: [], canEdit: true });
    expect(getByText('No global filters')).toBeInTheDocument();
  });

  it('should call toggleFiltersBar when CollapsedBar is clicked', () => {
    const toggleFiltersBar = jest.fn();
    const { getByTestId } = setup({
      filtersOpen: false,
      toggleFiltersBar,
    });

    fireEvent.click(getByTestId('expand-button'));
    expect(toggleFiltersBar).toHaveBeenCalledWith(true);
  });

  it('should not display cross filters if the feature flag is disabled', () => {
    isFeatureEnabled.mockReturnValue(false);
    const { queryByText } = setup();

    expect(queryByText('CrossFiltersVertical')).toBeNull();
  });

  it('should display cross filters if the feature flag is enabled', () => {
    isFeatureEnabled.mockReturnValue(true);
    const { getByText } = setup();

    expect(getByText('CrossFiltersVertical')).toBeInTheDocument();
  });

  it('should handle scroll events and set isScrolling', async () => {
    const { container } = setup();

    fireEvent.scroll(container.querySelector('.open'));
    await waitFor(() => {
      expect(throttle).toHaveBeenCalled();
    });
  });

  it('should render actions in the filter bar', () => {
    const { getByText } = setup();
    expect(getByText('Actions')).toBeInTheDocument();
  });

  it('should apply correct class names based on "filtersOpen" prop', () => {
    const { container, rerender } = setup({ filtersOpen: false });
    const collapsedBar = container.querySelector('.open');
    expect(collapsedBar).toBeNull();

    rerender(
      <Router history={createMemoryHistory()}>
        <VerticalFilterBar filtersOpen />
      </Router>,
    );
    const openedBar = container.querySelector('.open');
    expect(openedBar).not.toBeNull();
  });
});
