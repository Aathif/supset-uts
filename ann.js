import { selectChartCrossFilters } from './yourFile'; // Adjust the path to the file
import { getCrossFilterIndicator } from './yourFile'; // Adjust the path to the file
import { getStatus } from './yourFile'; // Adjust the path to the file
import { FeatureFlag, isFeatureEnabled } from '@superset-ui/core';
import { IndicatorStatus } from './constants'; // Adjust based on your project's structure

// Mock data
const mockChartId = 123;
const mockDataMask = {
  1: { id: 1, filterState: { value: 'filterValue' } },
};
const mockDashboardLayout = {};
const mockChartConfiguration = {
  1: {
    id: 1,
    crossFilters: {
      chartsInScope: [mockChartId],
    },
  },
  2: {
    id: 2,
    crossFilters: {
      chartsInScope: [],
    },
  },
};
const mockAppliedColumns = new Set(['col1']);
const mockRejectedColumns = new Set(['col2']);

// Mock utility functions
jest.mock('@superset-ui/core', () => ({
  isFeatureEnabled: jest.fn(),
  FeatureFlag: { DashboardCrossFilters: 'DASHBOARD_CROSS_FILTERS' },
}));

jest.mock('./yourFile', () => ({
  getCrossFilterIndicator: jest.fn(),
  getStatus: jest.fn(),
}));

const { isFeatureEnabled } = require('@superset-ui/core');
const { getCrossFilterIndicator, getStatus } = require('./yourFile');

describe('selectChartCrossFilters', () => {
  beforeEach(() => {
    // Clear mocks before each test
    isFeatureEnabled.mockClear();
    getCrossFilterIndicator.mockClear();
    getStatus.mockClear();
  });

  it('should return an empty array if cross-filters are not enabled', () => {
    isFeatureEnabled.mockReturnValue(false);

    const result = selectChartCrossFilters(
      mockDataMask,
      mockChartId,
      mockDashboardLayout,
      mockChartConfiguration,
      mockAppliedColumns,
      mockRejectedColumns,
    );

    expect(result).toEqual([]);
    expect(getCrossFilterIndicator).not.toHaveBeenCalled();
    expect(getStatus).not.toHaveBeenCalled();
  });

  it('should return cross-filter indicators when cross-filters are enabled', () => {
    isFeatureEnabled.mockReturnValue(true);

    const mockFilterIndicator = { column: 'col1', value: 'filterValue' };
    getCrossFilterIndicator.mockReturnValue(mockFilterIndicator);

    const mockStatus = IndicatorStatus.CrossFilterApplied;
    getStatus.mockReturnValue(mockStatus);

    const result = selectChartCrossFilters(
      mockDataMask,
      mockChartId,
      mockDashboardLayout,
      mockChartConfiguration,
      mockAppliedColumns,
      mockRejectedColumns,
    );

    expect(result).toEqual([{ ...mockFilterIndicator, status: mockStatus }]);
    expect(getCrossFilterIndicator).toHaveBeenCalledWith(
      1,
      mockDataMask[1],
      mockDashboardLayout,
    );
    expect(getStatus).toHaveBeenCalledWith({
      label: 'filterValue',
      column: 'col1',
      type: 'CrossFilters',
      appliedColumns: mockAppliedColumns,
      rejectedColumns: mockRejectedColumns,
    });
  });

  it('should handle charts not in scope', () => {
    isFeatureEnabled.mockReturnValue(true);

    const result = selectChartCrossFilters(
      mockDataMask,
      mockChartId,
      mockDashboardLayout,
      { 2: mockChartConfiguration[2] }, // Pass a chartConfig with empty scope
      mockAppliedColumns,
      mockRejectedColumns,
    );

    expect(result).toEqual([]);
    expect(getCrossFilterIndicator).not.toHaveBeenCalled();
    expect(getStatus).not.toHaveBeenCalled();
  });

  it('should return cross-filters only for non-filter emitters when filterEmitter is false', () => {
    isFeatureEnabled.mockReturnValue(true);

    const mockFilterIndicator = { column: 'col1', value: 'filterValue' };
    getCrossFilterIndicator.mockReturnValue(mockFilterIndicator);

    const mockStatus = IndicatorStatus.CrossFilterApplied;
    getStatus.mockReturnValue(mockStatus);

    const result = selectChartCrossFilters(
      mockDataMask,
      mockChartId,
      mockDashboardLayout,
      mockChartConfiguration,
      mockAppliedColumns,
      mockRejectedColumns,
      false, // filterEmitter is false
    );

    expect(result).toEqual([{ ...mockFilterIndicator, status: mockStatus }]);
    expect(getCrossFilterIndicator).toHaveBeenCalledWith(
      1,
      mockDataMask[1],
      mockDashboardLayout,
    );
    expect(getStatus).toHaveBeenCalledWith({
      label: 'filterValue',
      column: 'col1',
      type: 'CrossFilters',
      appliedColumns: mockAppliedColumns,
      rejectedColumns: mockRejectedColumns,
    });
  });

  it('should return cross-filters only for filter emitters when filterEmitter is true', () => {
    isFeatureEnabled.mockReturnValue(true);

    const result = selectChartCrossFilters(
      mockDataMask,
      mockChartId,
      mockDashboardLayout,
      mockChartConfiguration,
      mockAppliedColumns,
      mockRejectedColumns,
      true, // filterEmitter is true
    );

    expect(result).toEqual([]);
    expect(getCrossFilterIndicator).not.toHaveBeenCalled();
  });

  it('should filter out indicators with non-applied statuses', () => {
    isFeatureEnabled.mockReturnValue(true);

    const mockFilterIndicator = { column: 'col1', value: 'filterValue' };
    getCrossFilterIndicator.mockReturnValue(mockFilterIndicator);

    const mockStatus = IndicatorStatus.CrossFilterRejected;
    getStatus.mockReturnValue(mockStatus);

    const result = selectChartCrossFilters(
      mockDataMask,
      mockChartId,
      mockDashboardLayout,
      mockChartConfiguration,
      mockAppliedColumns,
      mockRejectedColumns,
    );

    expect(result).toEqual([]);
    expect(getStatus).toHaveBeenCalledWith({
      label: 'filterValue',
      column: 'col1',
      type: 'CrossFilters',
      appliedColumns: mockAppliedColumns,
      rejectedColumns: mockRejectedColumns,
    });
  });
});
