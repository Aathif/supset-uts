import { unitToRadius, Unit } from './unitToRadius';

describe('unitToRadius', () => {
  it('should convert square meters to radius in meters', () => {
    const result = unitToRadius('square_m', 314159);
    expect(result).toBeCloseTo(316.22, 2);
  });

  it('should convert radius in meters to radius in meters', () => {
    const result = unitToRadius('radius_m', 1000);
    expect(result).toBe(1000);
  });

  it('should convert radius in kilometers to radius in meters', () => {
    const result = unitToRadius('radius_km', 1);
    expect(result).toBe(1000);
  });

  it('should convert radius in miles to radius in meters', () => {
    const result = unitToRadius('radius_miles', 1);
    expect(result).toBeCloseTo(1609.34, 2);
  });

  it('should convert square kilometers to radius in meters', () => {
    const result = unitToRadius('square_km', 314.159);
    expect(result).toBeCloseTo(10000, 2);
  });

  it('should convert square miles to radius in meters', () => {
    const result = unitToRadius('square_miles', 314.159);
    expect(result).toBeCloseTo(160934, 2);
  });

  it('should return null for an unknown unit', () => {
    const result = unitToRadius('unknown_unit' as Unit, 1000);
    expect(result).toBeNull();
  });
});
