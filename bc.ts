describe('stringifyTimeRange', () => {
  it('should return null if any item in the extent does not have toISOString method', () => {
    const extent = [new Date(), { notADate: 'value' }];
    const result = stringifyTimeRange(extent);
    expect(result).toBeNull();
  });

  it('should return a formatted string if all items in the extent have toISOString method', () => {
    const extent = [new Date('2024-08-01T10:00:00Z'), new Date('2024-08-02T12:00:00Z')];
    const result = stringifyTimeRange(extent);
    expect(result).toBe('2024-08-01T10:00:00 : 2024-08-02T12:00:00');
  });

  it('should handle an empty extent array', () => {
    const extent: Date[] = [];
    const result = stringifyTimeRange(extent);
    expect(result).toBe('');
  });

  it('should handle a single item in the extent array', () => {
    const extent = [new Date('2024-08-01T10:00:00Z')];
    const result = stringifyTimeRange(extent);
    expect(result).toBe('2024-08-01T10:00:00');
  });

  it('should handle invalid date objects', () => {
    const extent = [new Date('invalid-date'), new Date('2024-08-02T12:00:00Z')];
    const result = stringifyTimeRange(extent);
    expect(result).toBe('Invalid Date : 2024-08-02T12:00:00');
  });
});
