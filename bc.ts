import findNonTabChildChartIdsWithCache from './findNonTabChildChartIdsWithCache';
import { TABS_TYPE, CHART_TYPE } from '../componentTypes';

jest.mock('../componentTypes', () => ({
  TABS_TYPE: 'tabs',
  CHART_TYPE: 'chart',
}));

describe('findNonTabChildChartIdsWithCache', () => {
  beforeEach(() => {
    // Clear cache before each test
    jest.resetModules();
  });

  test('should return chart IDs not nested within Tabs components', () => {
    const layout = {
      root: {
        type: TABS_TYPE,
        id: 'root',
        children: ['tabs1', 'chart1'],
      },
      tabs1: {
        type: TABS_TYPE,
        id: 'tabs1',
        children: ['chart2'],
      },
      chart1: {
        type: CHART_TYPE,
        id: 'chart1',
        meta: { chartId: 'chart1-id' },
        children: [],
      },
      chart2: {
        type: CHART_TYPE,
        id: 'chart2',
        meta: { chartId: 'chart2-id' },
        children: [],
      },
    };

    const result = findNonTabChildChartIdsWithCache({ id: 'root', layout });
    expect(result).toEqual(['chart1-id']);
  });

  test('should cache results for identical layouts', () => {
    const layout = {
      root: {
        type: TABS_TYPE,
        id: 'root',
        children: ['tabs1', 'chart1'],
      },
      tabs1: {
        type: TABS_TYPE,
        id: 'tabs1',
        children: ['chart2'],
      },
      chart1: {
        type: CHART_TYPE,
        id: 'chart1',
        meta: { chartId: 'chart1-id' },
        children: [],
      },
      chart2: {
        type: CHART_TYPE,
        id: 'chart2',
        meta: { chartId: 'chart2-id' },
        children: [],
      },
    };

    const result1 = findNonTabChildChartIdsWithCache({ id: 'root', layout });
    const result2 = findNonTabChildChartIdsWithCache({ id: 'root', layout });

    expect(result1).toBe(result2); // Should be the same cached result
  });

  test('should handle layouts with no charts', () => {
    const layout = {
      root: {
        type: TABS_TYPE,
        id: 'root',
        children: ['tabs1'],
      },
      tabs1: {
        type: TABS_TYPE,
        id: 'tabs1',
        children: [],
      },
    };

    const result = findNonTabChildChartIdsWithCache({ id: 'root', layout });
    expect(result).toEqual([]);
  });

  test('should handle layouts with no valid charts', () => {
    const layout = {
      root: {
        type: 'unknown_type',
        id: 'root',
        children: ['tabs1'],
      },
      tabs1: {
        type: 'unknown_type',
        id: 'tabs1',
        children: ['chart1'],
      },
      chart1: {
        type: 'chart',
        id: 'chart1',
        children: [],
      },
    };

    const result = findNonTabChildChartIdsWithCache({ id: 'root', layout });
    expect(result).toEqual([]);
  });
});
