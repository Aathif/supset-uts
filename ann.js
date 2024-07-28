describe('formatAnnotationLabel', () => {
  it('should format annotation label correctly', () => {
    const result = formatAnnotationLabel('name', 'title', ['desc1', 'desc2']);

    expect(result).toBe('name - title\n\ndesc1\n\ndesc2');
  });

  it('should handle missing descriptions', () => {
    const result = formatAnnotationLabel('name', 'title', []);

    expect(result).toBe('name - title');
  });
});
