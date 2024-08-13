import findTopLevelComponentIdsWithCache from './findTopLevelComponentIdsWithCache';
import { DASHBOARD_ROOT_ID } from '../constants';
import findNonTabChildChartIds from './findNonTabChildChartIds';

jest.mock('./findNonTabChildChartIds');

describe('findTopLevelComponentIdsWithCache', () => {
  beforeEach(() => {
    // Clear cache before each test
    jest.resetModules();
  });

  test('should return top-level component IDs from layout', () => {
    const layout = {
      [DASHBOARD_ROOT_ID]: {
        type: DASHBOARD_GRID_TYPE,
        id: 'root',
        children: ['grid1', 'tab1'],
      },
      grid1: {
        type: DASHBOARD_GRID_TYPE,
        id: 'grid1',
        children: [],
      },
      tab1: {
        type: TAB_TYPE,
        id: 'tab1',
        children: ['chart1', 'chart2'],
      },
      chart1: { type: 'chart', id: 'chart1', children: [] },
      chart2: { type: 'chart', id: 'chart2', children: [] },
    };

    // Mock findNonTabChildChartIds
    findNonTabChildChartIds.mockReturnValue(['chart1', 'chart2']);

    const result = findTopLevelComponentIdsWithCache(layout);
    expect(result).toEqual([
      {
        id: 'root',
        type: DASHBOARD_GRID_TYPE,
        parent_type: null,
        parent_id: null,
        index: null,
        depth: 0,
        slice_ids: [], // No charts under 'root'
      },
      {
        id: 'tab1',
        type: TAB_TYPE,
        parent_type: DASHBOARD_GRID_TYPE,
        parent_id: 'root',
        index: 1,
        depth: 1,
        slice_ids: ['chart1', 'chart2'],
      },
    ]);
  });

  test('should cache results for identical layouts', () => {
    const layout = {
      [DASHBOARD_ROOT_ID]: {
        type: DASHBOARD_GRID_TYPE,
        id: 'root',
        children: ['grid1', 'tab1'],
      },
      grid1: {
        type: DASHBOARD_GRID_TYPE,
        id: 'grid1',
        children: [],
      },
      tab1: {
        type: TAB_TYPE,
        id: 'tab1',
        children: ['chart1', 'chart2'],
      },
      chart1: { type: 'chart', id: 'chart1', children: [] },
      chart2: { type: 'chart', id: 'chart2', children: [] },
    };

    // Mock findNonTabChildChartIds
    findNonTabChildChartIds.mockReturnValue(['chart1', 'chart2']);

    const result1 = findTopLevelComponentIdsWithCache(layout);
    const result2 = findTopLevelComponentIdsWithCache(layout);

    expect(result1).toBe(result2); // Should be the same cached result
  });

  test('should return empty array for empty layout', () => {
    const layout = {};
    const result = findTopLevelComponentIdsWithCache(layout);
    expect(result).toEqual([]);
  });

  test('should return correct result for layout without top-level components', () => {
    const layout = {
      [DASHBOARD_ROOT_ID]: {
        type: 'unknown_type',
        id: 'root',
        children: ['chart1'],
      },
      chart1: { type: 'chart', id: 'chart1', children: [] },
    };

    const result = findTopLevelComponentIdsWithCache(layout);
    expect(result).toEqual([]);
  });
});
