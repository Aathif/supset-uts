import findTopLevelComponentIdsWithCache from './path/to/your/module';
import { TAB_TYPE, DASHBOARD_GRID_TYPE } from '../componentTypes';
import { DASHBOARD_ROOT_ID } from '../constants';

jest.mock('./findNonTabChildChartIds', () => jest.fn(() => [1, 2, 3]));

describe('findTopLevelComponentIdsWithCache', () => {
  const mockLayout = {
    [DASHBOARD_ROOT_ID]: { id: DASHBOARD_ROOT_ID, children: ['grid1'] },
    grid1: { id: 'grid1', type: DASHBOARD_GRID_TYPE, children: ['tab1'] },
    tab1: { id: 'tab1', type: TAB_TYPE, children: ['chart1', 'chart2'] },
    chart1: { id: 'chart1', type: 'CHART' },
    chart2: { id: 'chart2', type: 'CHART' },
  };

  afterEach(() => {
    // Clear the cache after each test
    cachedLayout = undefined;
    cachedTopLevelNodes = undefined;
  });

  it('should return the correct top-level component ids', () => {
    const result = findTopLevelComponentIdsWithCache(mockLayout);
    expect(result).toEqual([
      {
        id: 'grid1',
        type: DASHBOARD_GRID_TYPE,
        parent_type: null,
        parent_id: null,
        index: 0,
        depth: 0,
        slice_ids: [1, 2, 3], // Assuming findNonTabChildChartIds is mocked
      },
      {
        id: 'tab1',
        type: TAB_TYPE,
        parent_type: DASHBOARD_GRID_TYPE,
        parent_id: 'grid1',
        index: 0,
        depth: 1,
        slice_ids: [1, 2, 3], // Assuming findNonTabChildChartIds is mocked
      },
    ]);
  });

  it('should return cached result for the same layout', () => {
    const firstResult = findTopLevelComponentIdsWithCache(mockLayout);
    const secondResult = findTopLevelComponentIdsWithCache(mockLayout);

    // Ensure the result is the same
    expect(firstResult).toEqual(secondResult);

    // Ensure the result is coming from cache
    expect(firstResult).toBe(secondResult);
  });

  it('should update cache when layout changes', () => {
    const firstResult = findTopLevelComponentIdsWithCache(mockLayout);

    const newLayout = {
      ...mockLayout,
      grid1: { ...mockLayout.grid1, children: ['tab2'] },
      tab2: { id: 'tab2', type: TAB_TYPE, children: [] },
    };

    const secondResult = findTopLevelComponentIdsWithCache(newLayout);

    // Ensure the result is different after layout changes
    expect(firstResult).not.toBe(secondResult);

    // Validate the new result
    expect(secondResult).toEqual([
      {
        id: 'grid1',
        type: DASHBOARD_GRID_TYPE,
        parent_type: null,
        parent_id: null,
        index: 0,
        depth: 0,
        slice_ids: [1, 2, 3], // Assuming findNonTabChildChartIds is mocked
      },
      {
        id: 'tab2',
        type: TAB_TYPE,
        parent_type: DASHBOARD_GRID_TYPE,
        parent_id: 'grid1',
        index: 0,
        depth: 1,
        slice_ids: [1, 2, 3], // Assuming findNonTabChildChartIds is mocked
      },
    ]);
  });
});
