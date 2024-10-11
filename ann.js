import { selectIndicatorsForChart } from './yourFile'; // Adjust based on the file structure

// Mock dependencies
const mockChartId = 1;
const mockFilters = {
  2: { chartId: 2, datasourceId: 'ds_1' },
  3: { chartId: 3, datasourceId: 'ds_2' },
};
const mockDatasources = {
  ds_1: { datasource_name: 'Datasource 1' },
  ds_2: { datasource_name: 'Datasource 2' },
};
const mockChart = { id: 1 };

// Mock utility functions
jest.mock('./utils', () => ({
  getAppliedColumns: jest.fn(),
  getRejectedColumns: jest.fn(),
  selectIndicatorsForChartFromFilter: jest.fn(),
  areObjectsEqual: jest.fn(),
}));

// Mock caching objects
let cachedIndicatorsForChart = {};
let cachedDashboardFilterDataForChart = {};

// Utility mock implementations
const { getAppliedColumns, getRejectedColumns, selectIndicatorsForChartFromFilter, areObjectsEqual } = require('./utils');

describe('selectIndicatorsForChart', () => {
  beforeEach(() => {
    // Reset mocks before each test
    cachedIndicatorsForChart = {};
    cachedDashboardFilterDataForChart = {};
    getAppliedColumns.mockClear();
    getRejectedColumns.mockClear();
    selectIndicatorsForChartFromFilter.mockClear();
    areObjectsEqual.mockClear();
  });

  it('should return cached indicators if data is unchanged', () => {
    // Set up mock applied/rejected columns and matching filters/datasources
    const mockAppliedColumns = ['col1'];
    const mockRejectedColumns = ['col2'];
    const mockMatchingFilters = [mockFilters[2]];
    const mockMatchingDatasources = [mockDatasources['ds_1']];
    cachedIndicatorsForChart[mockChartId] = [{ name: 'Mock Indicator' }];
    cachedDashboardFilterDataForChart[mockChartId] = {
      appliedColumns: mockAppliedColumns,
      rejectedColumns: mockRejectedColumns,
      matchingFilters: mockMatchingFilters,
      matchingDatasources: mockMatchingDatasources,
    };

    // Mock utility functions
    getAppliedColumns.mockReturnValue(mockAppliedColumns);
    getRejectedColumns.mockReturnValue(mockRejectedColumns);
    areObjectsEqual.mockReturnValue(true);

    const result = selectIndicatorsForChart(mockChartId, mockFilters, mockDatasources, mockChart);

    expect(result).toEqual([{ name: 'Mock Indicator' }]);
    expect(selectIndicatorsForChartFromFilter).not.toHaveBeenCalled();
  });

  it('should compute indicators and store them in cache if data is changed', () => {
    const mockAppliedColumns = ['col1'];
    const mockRejectedColumns = ['col2'];
    const mockMatchingFilters = [mockFilters[2]];
    const mockMatchingDatasources = [mockDatasources['ds_1']];
    const mockIndicators = [{ name: 'Indicator 1' }, { name: 'Indicator 2' }];

    getAppliedColumns.mockReturnValue(mockAppliedColumns);
    getRejectedColumns.mockReturnValue(mockRejectedColumns);
    selectIndicatorsForChartFromFilter.mockReturnValue(mockIndicators);
    areObjectsEqual.mockReturnValueOnce(false);

    const result = selectIndicatorsForChart(mockChartId, mockFilters, mockDatasources, mockChart);

    expect(result).toEqual(mockIndicators);
    expect(selectIndicatorsForChartFromFilter).toHaveBeenCalledWith(
      mockChartId,
      mockFilters[2],
      mockDatasources[mockFilters[2].datasourceId],
      mockAppliedColumns,
      mockRejectedColumns,
    );
    expect(cachedIndicatorsForChart[mockChartId]).toEqual(mockIndicators);
    expect(cachedDashboardFilterDataForChart[mockChartId]).toEqual({
      appliedColumns: mockAppliedColumns,
      rejectedColumns: mockRejectedColumns,
      matchingFilters: mockMatchingFilters,
      matchingDatasources: mockMatchingDatasources,
    });
  });

  it('should return an empty array if no matching filters are found', () => {
    const result = selectIndicatorsForChart(mockChartId, {}, {}, mockChart);

    expect(result).toEqual([]);
    expect(selectIndicatorsForChartFromFilter).not.toHaveBeenCalled();
  });

  it('should return an empty array if no datasources match the filters', () => {
    const result = selectIndicatorsForChart(mockChartId, mockFilters, {}, mockChart);

    expect(result).toEqual([]);
    expect(selectIndicatorsForChartFromFilter).not.toHaveBeenCalled();
  });

  it('should handle empty filters and datasources gracefully', () => {
    const result = selectIndicatorsForChart(mockChartId, {}, {}, mockChart);

    expect(result).toEqual([]);
    expect(selectIndicatorsForChartFromFilter).not.toHaveBeenCalled();
  });

  it('should sort the indicators by name', () => {
    const mockAppliedColumns = ['col1'];
    const mockRejectedColumns = ['col2'];
    const unsortedIndicators = [{ name: 'Zebra' }, { name: 'Apple' }];

    getAppliedColumns.mockReturnValue(mockAppliedColumns);
    getRejectedColumns.mockReturnValue(mockRejectedColumns);
    selectIndicatorsForChartFromFilter.mockReturnValue(unsortedIndicators);
    areObjectsEqual.mockReturnValue(false);

    const result = selectIndicatorsForChart(mockChartId, mockFilters, mockDatasources, mockChart);

    expect(result).toEqual([{ name: 'Apple' }, { name: 'Zebra' }]);
  });
});
