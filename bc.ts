import getLoadStatsPerTopLevelComponent from './getLoadStatsPerTopLevelComponent';
import findTopLevelComponentIds from './findTopLevelComponentIds';
import childChartsDidLoad from './childChartsDidLoad';

jest.mock('./findTopLevelComponentIds');
jest.mock('./childChartsDidLoad');

describe('getLoadStatsPerTopLevelComponent', () => {
  const mockLayout = {
    root: { id: 'root', type: 'ROOT_TYPE', children: ['grid1'] },
    grid1: { id: 'grid1', type: 'GRID_TYPE', children: ['chart1', 'chart2'] },
    chart1: { id: 'chart1', type: 'CHART' },
    chart2: { id: 'chart2', type: 'CHART' },
  };

  const mockChartQueries = {
    chart1: { id: 'chart1', startTime: 1000 },
    chart2: { id: 'chart2', startTime: 1500 },
  };

  beforeEach(() => {
    findTopLevelComponentIds.mockReturnValue([
      { id: 'grid1', type: 'GRID_TYPE', depth: 0 },
    ]);

    childChartsDidLoad.mockReturnValue({
      didLoad: true,
      minQueryStartTime: 1000,
    });
  });

  it('should return correct load stats for top-level components', () => {
    const result = getLoadStatsPerTopLevelComponent({
      layout: mockLayout,
      chartQueries: mockChartQueries,
    });

    expect(result).toEqual({
      grid1: {
        didLoad: true,
        id: 'grid1',
        minQueryStartTime: 1000,
        type: 'GRID_TYPE',
        depth: 0,
      },
    });
  });

  it('should return empty stats if no top-level components are found', () => {
    findTopLevelComponentIds.mockReturnValueOnce([]);

    const result = getLoadStatsPerTopLevelComponent({
      layout: mockLayout,
      chartQueries: mockChartQueries,
    });

    expect(result).toEqual({});
  });

  it('should correctly handle different child chart load states', () => {
    childChartsDidLoad.mockReturnValueOnce({
      didLoad: false,
      minQueryStartTime: null,
    });

    const result = getLoadStatsPerTopLevelComponent({
      layout: mockLayout,
      chartQueries: mockChartQueries,
    });

    expect(result).toEqual({
      grid1: {
        didLoad: false,
        id: 'grid1',
        minQueryStartTime: null,
        type: 'GRID_TYPE',
        depth: 0,
      },
    });
  });

  it('should handle layout with multiple top-level components', () => {
    findTopLevelComponentIds.mockReturnValueOnce([
      { id: 'grid1', type: 'GRID_TYPE', depth: 0 },
      { id: 'tab1', type: 'TAB_TYPE', depth: 1 },
    ]);

    childChartsDidLoad.mockReturnValueOnce({
      didLoad: true,
      minQueryStartTime: 1000,
    });

    childChartsDidLoad.mockReturnValueOnce({
      didLoad: true,
      minQueryStartTime: 1200,
    });

    const result = getLoadStatsPerTopLevelComponent({
      layout: mockLayout,
      chartQueries: mockChartQueries,
    });

    expect(result).toEqual({
      grid1: {
        didLoad: true,
        id: 'grid1',
        minQueryStartTime: 1000,
        type: 'GRID_TYPE',
        depth: 0,
      },
      tab1: {
        didLoad: true,
        id: 'tab1',
        minQueryStartTime: 1200,
        type: 'TAB_TYPE',
        depth: 1,
      },
    });
  });
});
