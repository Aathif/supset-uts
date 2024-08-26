import { tokenizeToStringArray } from './path-to-your-function'; // Adjust the import path

describe('tokenizeToStringArray', () => {
  it('should return null for null input', () => {
    expect(tokenizeToStringArray(null)).toBeNull();
  });

  it('should return null for undefined input', () => {
    expect(tokenizeToStringArray(undefined)).toBeNull();
  });

  it('should return null for empty string input', () => {
    expect(tokenizeToStringArray('')).toBeNull();
  });

  it('should return null for string with only whitespace', () => {
    expect(tokenizeToStringArray('   ')).toBeNull();
  });

  it('should return an array of trimmed strings for valid comma-separated input', () => {
    expect(tokenizeToStringArray('  foo  , bar ,baz')).toEqual(['foo', 'bar', 'baz']);
  });

  it('should handle a single string without commas', () => {
    expect(tokenizeToStringArray('   single   ')).toEqual(['single']);
  });

  it('should handle leading and trailing whitespace in tokens', () => {
    expect(tokenizeToStringArray('  one  ,  two ,  three ')).toEqual(['one', 'two', 'three']);
  });

  it('should handle input with consecutive commas', () => {
    expect(tokenizeToStringArray('foo,,bar')).toEqual(['foo', '', 'bar']);
  });

  it('should handle input with no content between commas', () => {
    expect(tokenizeToStringArray(',,')).toEqual(['', '', '']);
  });
});
