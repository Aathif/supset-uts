import { computeStackedYDomain } from './computeStackedYDomain';

describe('computeStackedYDomain', () => {
  it('should return [0, 1] when data is empty', () => {
    const data = [];
    expect(computeStackedYDomain(data)).toEqual([0, 1]);
  });

  it('should return [0, 1] when data does not have "values" field', () => {
    const data = [{ disabled: false }];
    expect(computeStackedYDomain(data)).toEqual([0, 1]);
  });

  it('should return [0, 1] when all data series are disabled', () => {
    const data = [
      { disabled: true, values: [{ y: 10 }, { y: -5 }] },
      { disabled: true, values: [{ y: 15 }, { y: -3 }] },
    ];
    expect(computeStackedYDomain(data)).toEqual([0, 1]);
  });

  it('should return correct domain when there is only one enabled series', () => {
    const data = [
      { disabled: true, values: [{ y: 10 }, { y: -5 }] },
      { disabled: false, values: [{ y: 15 }, { y: -3 }] },
    ];
    expect(computeStackedYDomain(data)).toEqual([-5, 15]);
  });

  it('should return correct domain for stacked values', () => {
    const data = [
      { disabled: false, values: [{ y: 10 }, { y: -5 }] },
      { disabled: false, values: [{ y: 15 }, { y: -3 }] },
      { disabled: false, values: [{ y: -2 }, { y: 6 }] },
    ];
    // Stacked values: [10+15-2=23, -5-3+6=-2]
    expect(computeStackedYDomain(data)).toEqual([-2, 23]);
  });

  it('should return correct domain when all values are positive', () => {
    const data = [
      { disabled: false, values: [{ y: 5 }, { y: 10 }] },
      { disabled: false, values: [{ y: 8 }, { y: 12 }] },
    ];
    // Stacked values: [5+8=13, 10+12=22]
    expect(computeStackedYDomain(data)).toEqual([0, 22]);
  });

  it('should return correct domain when all values are negative', () => {
    const data = [
      { disabled: false, values: [{ y: -10 }, { y: -5 }] },
      { disabled: false, values: [{ y: -20 }, { y: -3 }] },
    ];
    // Stacked values: [-10-20=-30, -5-3=-8]
    expect(computeStackedYDomain(data)).toEqual([-30, 0]);
  });

  it('should handle single data point correctly', () => {
    const data = [
      { disabled: false, values: [{ y: 7 }] },
    ];
    expect(computeStackedYDomain(data)).toEqual([0, 7]);
  });
});
