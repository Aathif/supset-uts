import * as d3 from 'd3';
import { computeYDomain } from './computeYDomain';

describe('computeYDomain', () => {
  it('should return [0, 1] when data is empty', () => {
    const data = [];
    expect(computeYDomain(data)).toEqual([0, 1]);
  });

  it('should return [0, 1] when data does not have "values" field', () => {
    const data = [{ disabled: false }];
    expect(computeYDomain(data)).toEqual([0, 1]);
  });

  it('should return correct domain when there is only one enabled series', () => {
    const data = [
      { disabled: true, values: [{ y: 10 }, { y: -5 }] },
      { disabled: false, values: [{ y: 15 }, { y: -3 }] },
    ];
    expect(computeYDomain(data)).toEqual([-3, 15]);
  });

  it('should return correct domain when all values are positive', () => {
    const data = [
      { disabled: false, values: [{ y: 5 }, { y: 10 }] },
      { disabled: false, values: [{ y: 8 }, { y: 12 }] },
    ];
    expect(computeYDomain(data)).toEqual([5, 12]);
  });

  it('should return correct domain when all values are negative', () => {
    const data = [
      { disabled: false, values: [{ y: -10 }, { y: -5 }] },
      { disabled: false, values: [{ y: -20 }, { y: -3 }] },
    ];
    expect(computeYDomain(data)).toEqual([-20, -3]);
  });

  it('should return correct domain for mixed positive and negative values', () => {
    const data = [
      { disabled: false, values: [{ y: 10 }, { y: -5 }] },
      { disabled: false, values: [{ y: 15 }, { y: -3 }] },
    ];
    expect(computeYDomain(data)).toEqual([-5, 15]);
  });

  it('should return correct domain for multiple series', () => {
    const data = [
      { disabled: false, values: [{ y: 10 }, { y: 20 }] },
      { disabled: false, values: [{ y: 5 }, { y: 15 }] },
    ];
    expect(computeYDomain(data)).toEqual([5, 20]);
  });

  it('should ignore disabled series', () => {
    const data = [
      { disabled: true, values: [{ y: 100 }, { y: 200 }] },
      { disabled: false, values: [{ y: 5 }, { y: 15 }] },
    ];
    expect(computeYDomain(data)).toEqual([5, 15]);
  });
});
