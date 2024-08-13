// childChartsDidLoad.test.js
import childChartsDidLoad from './childChartsDidLoad';
import findNonTabChildCharIds from './findNonTabChildChartIds';

// Mock the findNonTabChildCharIds function
jest.mock('./findNonTabChildChartIds');

describe('childChartsDidLoad', () => {
  beforeEach(() => {
    // Reset the mock implementation before each test
    findNonTabChildCharIds.mockReset();
  });

  it('should return didLoad true and correct minQueryStartTime when all charts have completed loading', () => {
    // Arrange
    findNonTabChildCharIds.mockReturnValue(['chart1', 'chart2']);
    const chartQueries = {
      chart1: { chartUpdateStartTime: 10, chartStatus: 'rendered' },
      chart2: { chartUpdateStartTime: 20, chartStatus: 'stopped' },
    };
    const layout = {};
    const id = 'some-id';

    // Act
    const result = childChartsDidLoad({ chartQueries, layout, id });

    // Assert
    expect(result.didLoad).toBe(true);
    expect(result.minQueryStartTime).toBe(10);
  });

  it('should return didLoad false when not all charts have completed loading', () => {
    // Arrange
    findNonTabChildCharIds.mockReturnValue(['chart1', 'chart2']);
    const chartQueries = {
      chart1: { chartUpdateStartTime: 10, chartStatus: 'rendered' },
      chart2: { chartUpdateStartTime: 20, chartStatus: 'loading' },
    };
    const layout = {};
    const id = 'some-id';

    // Act
    const result = childChartsDidLoad({ chartQueries, layout, id });

    // Assert
    expect(result.didLoad).toBe(false);
    expect(result.minQueryStartTime).toBe(10); // Only chart1's start time should be considered
  });

  it('should handle edge cases correctly', () => {
    // Arrange
    findNonTabChildCharIds.mockReturnValue([]);
    const chartQueries = {};
    const layout = {};
    const id = 'some-id';

    // Act
    const result = childChartsDidLoad({ chartQueries, layout, id });

    // Assert
    expect(result.didLoad).toBe(true); // No charts to load, so should be considered as loaded
    expect(result.minQueryStartTime).toBe(Infinity); // No start times
  });

  it('should handle scenarios with invalid chart statuses', () => {
    // Arrange
    findNonTabChildCharIds.mockReturnValue(['chart1']);
    const chartQueries = {
      chart1: { chartUpdateStartTime: 10, chartStatus: 'unknown' },
    };
    const layout = {};
    const id = 'some-id';

    // Act
    const result = childChartsDidLoad({ chartQueries, layout, id });

    // Assert
    expect(result.didLoad).toBe(false);
    expect(result.minQueryStartTime).toBe(10);
  });
});
