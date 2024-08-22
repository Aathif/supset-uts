import { formatLabel } from './path_to_formatLabel';
import { EchartsRadarLabelType } from './path_to_types';

describe('formatLabel', () => {
  const mockNumberFormatter = jest.fn((value) => `formatted_${value}`);

  it('should return only the formatted value when labelType is Value', () => {
    const params = { name: 'TestName', value: 42 };
    const result = formatLabel({
      params,
      labelType: EchartsRadarLabelType.Value,
      numberFormatter: mockNumberFormatter,
    });

    expect(mockNumberFormatter).toHaveBeenCalledWith(42);
    expect(result).toBe('formatted_42');
  });

  it('should return key and formatted value when labelType is KeyValue', () => {
    const params = { name: 'TestName', value: 42 };
    const result = formatLabel({
      params,
      labelType: EchartsRadarLabelType.KeyValue,
      numberFormatter: mockNumberFormatter,
    });

    expect(mockNumberFormatter).toHaveBeenCalledWith(42);
    expect(result).toBe('TestName: formatted_42');
  });

  it('should return the name when labelType is not recognized', () => {
    const params = { name: 'TestName', value: 42 };
    const result = formatLabel({
      params,
      labelType: 'UnknownLabelType' as EchartsRadarLabelType,
      numberFormatter: mockNumberFormatter,
    });

    // The formatter should not be called in this case
    expect(mockNumberFormatter).not.toHaveBeenCalled();
    expect(result).toBe('TestName');
  });

  it('should handle cases where name is undefined', () => {
    const params = { name: undefined, value: 42 };
    const result = formatLabel({
      params,
      labelType: EchartsRadarLabelType.KeyValue,
      numberFormatter: mockNumberFormatter,
    });

    expect(mockNumberFormatter).toHaveBeenCalledWith(42);
    expect(result).toBe(': formatted_42');
  });

  it('should handle cases where value is undefined', () => {
    const params = { name: 'TestName', value: undefined };
    const result = formatLabel({
      params,
      labelType: EchartsRadarLabelType.Value,
      numberFormatter: mockNumberFormatter,
    });

    // The formatter should be called with undefined
    expect(mockNumberFormatter).toHaveBeenCalledWith(undefined);
    expect(result).toBe('formatted_undefined');
  });
});
