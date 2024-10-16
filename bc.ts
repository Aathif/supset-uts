import replaceUndefinedByNull from './replaceUndefinedByNull';

describe('replaceUndefinedByNull', () => {
  it('should replace undefined with null in a flat object', () => {
    const input = { key1: undefined, key2: 'value', key3: 123 };
    const expectedOutput = { key1: null, key2: 'value', key3: 123 };
    
    expect(replaceUndefinedByNull(input)).toEqual(expectedOutput);
  });

  it('should replace undefined with null in a nested object', () => {
    const input = {
      key1: undefined,
      key2: { nestedKey1: undefined, nestedKey2: 'value' },
    };
    const expectedOutput = {
      key1: null,
      key2: { nestedKey1: null, nestedKey2: 'value' },
    };
    
    expect(replaceUndefinedByNull(input)).toEqual(expectedOutput);
  });

  it('should handle arrays within the object', () => {
    const input = { key1: [1, undefined, 3], key2: 'value' };
    const expectedOutput = { key1: [1, null, 3], key2: 'value' };

    expect(replaceUndefinedByNull(input)).toEqual(expectedOutput);
  });

  it('should return a deep clone of the object', () => {
    const input = { key1: undefined, key2: { nestedKey1: undefined } };
    const result = replaceUndefinedByNull(input);

    expect(result).toEqual({
      key1: null,
      key2: { nestedKey1: null },
    });

    // Verify that the result is a deep clone
    result.key2.nestedKey1 = 'new value';
    expect(input.key2.nestedKey1).toBe(undefined); // original input remains unchanged
  });

  it('should return an empty object if input is empty', () => {
    const input = {};
    const expectedOutput = {};
    
    expect(replaceUndefinedByNull(input)).toEqual(expectedOutput);
  });

  it('should handle no undefined values', () => {
    const input = { key1: 'value', key2: 123, key3: null };
    const expectedOutput = { key1: 'value', key2: 123, key3: null };
    
    expect(replaceUndefinedByNull(input)).toEqual(expectedOutput);
  });
});
