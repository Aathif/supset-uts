import { cleanColorInput, TIME_SHIFT_PATTERN } from './path_to_function';

describe('cleanColorInput', () => {
  it('should trim the input string and remove " (right axis)"', () => {
    const input = 'ColorName (right axis)';
    const result = cleanColorInput(input);
    expect(result).toBe('ColorName');
  });

  it('should filter out parts that do not match the TIME_SHIFT_PATTERN', () => {
    const input = 'ColorName 1 week offset, 5 minutes offset, invalid time, Color2';
    const result = cleanColorInput(input.split(', '));
    expect(result).toBe('1 week offset, 5 minutes offset');
  });

  it('should handle an empty input gracefully', () => {
    const input = '';
    const result = cleanColorInput(input);
    expect(result).toBe('');
  });

  it('should handle input with no " (right axis)" or time shift pattern', () => {
    const input = 'ColorName, Color2, Color3';
    const result = cleanColorInput(input.split(', '));
    expect(result).toBe('');
  });

  it('should handle input with multiple valid and invalid time shifts', () => {
    const input = '2 days offset, some text, 3 hours offset, (right axis)';
    const result = cleanColorInput(input.split(', '));
    expect(result).toBe('2 days offset, 3 hours offset');
  });
});
