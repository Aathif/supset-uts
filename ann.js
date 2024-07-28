describe('parseAnnotationOpacity', () => {
  it('should return the correct opacity values', () => {
    expect(parseAnnotationOpacity(AnnotationOpacity.Low)).toBe(0.2);
    expect(parseAnnotationOpacity(AnnotationOpacity.Medium)).toBe(0.5);
    expect(parseAnnotationOpacity(AnnotationOpacity.High)).toBe(0.8);
    expect(parseAnnotationOpacity(null)).toBe(1);
  });
});
