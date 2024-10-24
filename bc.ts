import { xAxisMixin } from './path_to_file';

describe('xAxisMixin', () => {
  const control = { value: undefined };
  const state = {
    form_data: { granularity_sqla: 'timestamp', x_axis: null },
  };

  it('should return correct axis label based on form_data orientation', () => {
    const horizontalState = { form_data: { orientation: 'horizontal' } };
    const verticalState = { form_data: { orientation: 'vertical' } };

    expect(xAxisMixin.label(horizontalState)).toBe('Y-axis');
    expect(xAxisMixin.label(verticalState)).toBe('X-axis');
  });

  it('should set the initial value to granularity_sqla if x_axis is not defined', () => {
    const result = xAxisMixin.initialValue(control, state);
    expect(result).toBe('timestamp');
  });

  it('should return undefined as the initial value if conditions are not met', () => {
    const noGranularityState = { form_data: {} };
    const result = xAxisMixin.initialValue(control, noGranularityState);
    expect(result).toBeUndefined();
  });
});
