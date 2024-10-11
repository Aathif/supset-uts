import { tryNumify } from './tryNumify';

describe('tryNumify', () => {
  it('should return a number when a valid numeric string is passed', () => {
    expect(tryNumify('123')).toBe(123);
  });

  it('should return a number when a valid number is passed', () => {
    expect(tryNumify(456)).toBe(456);
  });

  it('should return a string when an invalid numeric string is passed', () => {
    expect(tryNumify('abc')).toBe('abc');
  });

  it('should return a string when an empty string is passed', () => {
    expect(tryNumify('')).toBe('');
  });

  it('should return a string when a non-numeric string is passed', () => {
    expect(tryNumify('NaN')).toBe('NaN');
  });

  it('should return a number when a string representing a floating-point number is passed', () => {
    expect(tryNumify('3.14')).toBe(3.14);
  });

  it('should return a number when a negative number string is passed', () => {
    expect(tryNumify('-123')).toBe(-123);
  });

  it('should return a number when a negative floating-point number string is passed', () => {
    expect(tryNumify('-3.14')).toBe(-3.14);
  });

  it('should return the original value when null is passed', () => {
    expect(tryNumify(null)).toBe(null);
  });

  it('should return the original value when undefined is passed', () => {
    expect(tryNumify(undefined)).toBe(undefined);
  });
});
