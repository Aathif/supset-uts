it('should trim and remove " (right axis)" from the input', () => {
    const input = ' color1 (right axis), color2 (right axis) ';
    const result = cleanColorInput(input);
    expect(result).toBe('color1, color2');
  });

  it('should split the input by ", ", filter out matches to TIME_SHIFT_PATTERN, and join back', () => {
    const input = 'color1, color2 (right axis), color3, time shift';
    // Mock TIME_SHIFT_PATTERN for this test case
    const mockTimeShiftPattern = /time shift/;
    const result = cleanColorInput(input);
    expect(result).toBe('color1, color3');
  });

  it('should handle empty input', () => {
    const input = '';
    const result = cleanColorInput(input);
    expect(result).toBe('');
  });

  it('should handle input with only " (right axis)" text', () => {
    const input = 'color1 (right axis), color2 (right axis)';
    const result = cleanColorInput(input);
    expect(result).toBe('');
  });

  it('should handle input without " (right axis)" and no TIME_SHIFT_PATTERN matches', () => {
    const input = 'color1, color2, color3';
    const result = cleanColorInput(input);
    expect(result).toBe('color1, color2, color3');
  });

  it('should handle input with multiple spaces', () => {
    const input = '  color1  ,   color2 (right axis) , color3  ';
    const result = cleanColorInput(input);
    expect(result).toBe('color1, color3');
  });
