// hexToRGB.test.js
import { hexToRGB } from './hexToRGB'; // Adjust the import path

describe('hexToRGB', () => {
  test('should convert valid hex color to RGB', () => {
    expect(hexToRGB('#ff5733')).toEqual([255, 87, 51, 255]);
  });

  test('should convert valid hex color to RGB with custom alpha', () => {
    expect(hexToRGB('#ff5733', 128)).toEqual([255, 87, 51, 128]);
  });

  test('should return default RGB for undefined hex color', () => {
    expect(hexToRGB(undefined)).toEqual([0, 0, 0, 255]);
  });

  test('should return default RGB for invalid hex color', () => {
    // Invalid hex colors should be handled by d3-color's rgb function
    // Here we are assuming it would convert to black [0, 0, 0, 255] but d3 might handle it differently
    // Depending on how d3 handles it, you might need to update this expectation
    expect(hexToRGB('invalidHex')).toEqual([0, 0, 0, 255]);
  });
});
