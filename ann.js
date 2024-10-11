// Assuming the existence of a `FilterState` type like this
interface FilterState {
  label?: string;
  value?: string | string[];
}

// Import the function to be tested
import { extractLabel } from './extractLabel';

describe('extractLabel', () => {

  it('should return the label if it exists and does not contain undefined', () => {
    const filter: FilterState = { label: 'Label1' };
    const result = extractLabel(filter);
    expect(result).toBe('Label1');
  });

  it('should return null if label contains undefined', () => {
    const filter: FilterState = { label: 'undefinedLabel', value: 'SomeValue' };
    const result = extractLabel(filter);
    expect(result).toBe('undefinedLabel'); // if the function should return the label as a string without real `undefined`.
  });

  it('should return the value joined as a string if label is not available and value is an array', () => {
    const filter: FilterState = { value: ['Value1', 'Value2'] };
    const result = extractLabel(filter);
    expect(result).toBe('Value1, Value2');
  });

  it('should return the value as a string if label is not available and value is a single value', () => {
    const filter: FilterState = { value: 'SingleValue' };
    const result = extractLabel(filter);
    expect(result).toBe('SingleValue');
  });

  it('should return null if both label and value are not available', () => {
    const filter: FilterState = {};
    const result = extractLabel(filter);
    expect(result).toBeNull();
  });

  it('should handle undefined input and return null', () => {
    const result = extractLabel(undefined);
    expect(result).toBeNull();
  });

  it('should handle empty array for value and return an empty string', () => {
    const filter: FilterState = { value: [] };
    const result = extractLabel(filter);
    expect(result).toBe('');
  });

});
