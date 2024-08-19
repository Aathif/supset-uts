import luminanceFromRGB, {
  LUMINANCE_RED_WEIGHT,
  LUMINANCE_GREEN_WEIGHT,
  LUMINANCE_BLUE_WEIGHT,
} from './luminanceFromRGB';

describe('luminanceFromRGB', () => {
  it('calculates the correct luminance for a pure red color', () => {
    const r = 255;
    const g = 0;
    const b = 0;
    const expectedLuminance = LUMINANCE_RED_WEIGHT * r;
    expect(luminanceFromRGB(r, g, b)).toBeCloseTo(expectedLuminance);
  });

  it('calculates the correct luminance for a pure green color', () => {
    const r = 0;
    const g = 255;
    const b = 0;
    const expectedLuminance = LUMINANCE_GREEN_WEIGHT * g;
    expect(luminanceFromRGB(r, g, b)).toBeCloseTo(expectedLuminance);
  });

  it('calculates the correct luminance for a pure blue color', () => {
    const r = 0;
    const g = 0;
    const b = 255;
    const expectedLuminance = LUMINANCE_BLUE_WEIGHT * b;
    expect(luminanceFromRGB(r, g, b)).toBeCloseTo(expectedLuminance);
  });

  it('calculates the correct luminance for a white color', () => {
    const r = 255;
    const g = 255;
    const b = 255;
    const expectedLuminance =
      LUMINANCE_RED_WEIGHT * r +
      LUMINANCE_GREEN_WEIGHT * g +
      LUMINANCE_BLUE_WEIGHT * b;
    expect(luminanceFromRGB(r, g, b)).toBeCloseTo(expectedLuminance);
  });

  it('calculates the correct luminance for a black color', () => {
    const r = 0;
    const g = 0;
    const b = 0;
    const expectedLuminance = 0;
    expect(luminanceFromRGB(r, g, b)).toBeCloseTo(expectedLuminance);
  });
});
