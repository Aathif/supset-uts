import { kmToPixels, EARTH_CIRCUMFERENCE_KM } from './geo';
import roundDecimal from './roundDecimal';

jest.mock('./roundDecimal');

describe('kmToPixels', () => {
  it('correctly converts kilometers to pixels at the equator (latitude 0)', () => {
    roundDecimal.mockImplementation((value) => value); // Mocking roundDecimal to return the value as is
    const pixels = kmToPixels(10, 0, 12);
    const expectedKmPerPixel =
      (EARTH_CIRCUMFERENCE_KM * Math.cos(0)) / 2 ** 21; // Zoom level 12 means 2**(12+9)
    const expectedPixels = 10 / expectedKmPerPixel;
    expect(pixels).toBe(expectedPixels);
  });

  it('correctly converts kilometers to pixels at a non-equatorial latitude', () => {
    roundDecimal.mockImplementation((value) => value); // Mocking roundDecimal to return the value as is
    const latitude = 45; // Example latitude
    const pixels = kmToPixels(10, latitude, 10);
    const latitudeRad = latitude * (Math.PI / 180);
    const expectedKmPerPixel =
      (EARTH_CIRCUMFERENCE_KM * Math.cos(latitudeRad)) / 2 ** 19;
    const expectedPixels = 10 / expectedKmPerPixel;
    expect(pixels).toBe(expectedPixels);
  });

  it('uses roundDecimal to round the result to 2 decimal places', () => {
    roundDecimal.mockClear();
    kmToPixels(10, 0, 12);
    expect(roundDecimal).toHaveBeenCalledWith(expect.any(Number), 2);
  });
});
