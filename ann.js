import { getCrossFilterIndicator } from './yourFile'; // Adjust import based on your file structure

describe('getCrossFilterIndicator', () => {
  const mockDataMask = {
    filterState: {
      value: 'mockValue',
      filters: {
        col1: 'value1',
      },
    },
    extraFormData: {
      filters: [{ col: 'col2' }],
    },
  };

  const mockDashboardLayout = {
    layoutItem1: {
      id: 'layoutItem1',
      meta: {
        chartId: 1,
        sliceNameOverride: 'Custom Slice Name',
        sliceName: 'Slice 1',
      },
      parents: ['parent1', 'parent2'],
    },
    layoutItem2: {
      id: 'layoutItem2',
      meta: {
        chartId: 2,
        sliceName: 'Slice 2',
      },
      parents: ['parent1'],
    },
  };

  const mockDashboardLayoutWithoutParents = {
    layoutItem3: {
      id: 'layoutItem3',
      meta: {
        chartId: 3,
        sliceName: 'Slice 3',
      },
    },
  };

  it('should return a filter indicator with column from extraFormData', () => {
    const result = getCrossFilterIndicator(1, mockDataMask, mockDashboardLayout);
    expect(result).toEqual({
      column: 'col2',
      name: 'Custom Slice Name',
      path: ['parent1', 'parent2', 'layoutItem1'],
      value: 'mockValue',
    });
  });

  it('should return a filter indicator with column from filterState when no extraFormData filters are available', () => {
    const result = getCrossFilterIndicator(2, { filterState: mockDataMask.filterState }, mockDashboardLayout);
    expect(result).toEqual({
      column: 'col1',
      name: 'Slice 2',
      path: ['parent1', 'layoutItem2'],
      value: 'mockValue',
    });
  });

  it('should return an empty string for the name and empty array for path when the dashboard layout is missing', () => {
    const result = getCrossFilterIndicator(3, mockDataMask, mockDashboardLayoutWithoutParents);
    expect(result).toEqual({
      column: 'col2',
      name: 'Slice 3',
      path: ['layoutItem3'],
      value: 'mockValue',
    });
  });

  it('should return an empty column and name when filterState and extraFormData are missing', () => {
    const result = getCrossFilterIndicator(1, {}, mockDashboardLayout);
    expect(result).toEqual({
      column: undefined,
      name: 'Custom Slice Name',
      path: ['parent1', 'parent2', 'layoutItem1'],
      value: undefined,
    });
  });

  it('should handle undefined dashboard layout gracefully', () => {
    const result = getCrossFilterIndicator(1, mockDataMask, {});
    expect(result).toEqual({
      column: 'col2',
      name: '',
      path: [''],
      value: 'mockValue',
    });
  });
});
