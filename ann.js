import { formatLabel } from './formatLabel';

interface CallbackDataParams {
  name?: string;
  value?: number;
}

enum EchartsSunburstLabelType {
  Key = 'key',
  Value = 'value',
  KeyValue = 'keyValue',
}

type ValueFormatter = (value: number) => string;

describe('formatLabel', () => {
  const numberFormatter: ValueFormatter = (value) => `formatted ${value}`;

  it('should return the name when labelType is Key', () => {
    const params = { name: 'test', value: 123 };
    const result = formatLabel({ params, labelType: EchartsSunburstLabelType.Key, numberFormatter });
    expect(result).toBe('test');
  });

  it('should return the formatted value when labelType is Value', () => {
    const params = { name: 'test', value: 123 };
    const result = formatLabel({ params, labelType: EchartsSunburstLabelType.Value, numberFormatter });
    expect(result).toBe('formatted 123');
  });

  it('should return the name and formatted value when labelType is KeyValue', () => {
    const params = { name: 'test', value: 123 };
    const result = formatLabel({ params, labelType: EchartsSunburstLabelType.KeyValue, numberFormatter });
    expect(result).toBe('test: formatted 123');
  });

  it('should return the name by default', () => {
    const params = { name: 'test', value: 123 };
    const result = formatLabel({ params, labelType: undefined as any, numberFormatter });
    expect(result).toBe('test');
  });

  it('should handle missing name', () => {
    const params = { value: 123 };
    const result = formatLabel({ params, labelType: EchartsSunburstLabelType.Key, numberFormatter });
    expect(result).toBe('');
  });

  it('should handle missing value', () => {
    const params = { name: 'test' };
    const result = formatLabel({ params, labelType: EchartsSunburstLabelType.Value, numberFormatter });
    expect(result).toBe('formatted NaN');
  });

  it('should handle missing name and value', () => {
    const params = {};
    const result = formatLabel({ params, labelType: EchartsSunburstLabelType.KeyValue, numberFormatter });
    expect(result).toBe(': formatted NaN');
  });
});
