import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PluginFilterTimeColumn from './PluginFilterTimeColumn';
import { ensureIsArray, t, tn, GenericDataType } from '@superset-ui/core';

jest.mock('@superset-ui/core', () => ({
  ensureIsArray: jest.fn((value) => (Array.isArray(value) ? value : [value])),
  t: jest.fn((str) => str),
  tn: jest.fn((str, strPlural, count) => (count > 1 ? strPlural : str)),
  GenericDataType: {
    Temporal: 'temporal',
  },
}));

jest.mock('src/components', () => ({
  Select: ({ value, options, placeholder, onChange }) => (
    <div>
      <select
        data-testid="select"
        value={value}
        onChange={(e) => {
          const selectedOptions = Array.from(
            e.target.selectedOptions,
            (option) => option.value
          );
          onChange(selectedOptions);
        }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

describe('PluginFilterTimeColumn', () => {
  const mockSetDataMask = jest.fn();
  const mockSetHoveredFilter = jest.fn();
  const mockUnsetHoveredFilter = jest.fn();
  const mockSetFocusedFilter = jest.fn();
  const mockUnsetFocusedFilter = jest.fn();
  const mockSetFilterActive = jest.fn();

  const defaultProps = {
    data: [
      { column_name: 'time_col1', verbose_name: 'Time Column 1', dtype: GenericDataType.Temporal },
      { column_name: 'time_col2', verbose_name: 'Time Column 2', dtype: GenericDataType.Temporal },
    ],
    formData: {
      defaultValue: ['time_col1'],
    },
    height: 400,
    width: 400,
    setDataMask: mockSetDataMask,
    setHoveredFilter: mockSetHoveredFilter,
    unsetHoveredFilter: mockUnsetHoveredFilter,
    setFocusedFilter: mockSetFocusedFilter,
    unsetFocusedFilter: mockUnsetFocusedFilter,
    setFilterActive: mockSetFilterActive,
    filterState: {},
    inputRef: React.createRef(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component', () => {
    render(<PluginFilterTimeColumn {...defaultProps} />);
    expect(screen.getByTestId('select')).toBeInTheDocument();
  });

  it('should display the correct placeholder text when there are time columns', () => {
    render(<PluginFilterTimeColumn {...defaultProps} />);
    expect(screen.getByTestId('select').children[0]).toHaveTextContent('2 options');
  });

  it('should display "No time columns" when there are no time columns', () => {
    render(<PluginFilterTimeColumn {...defaultProps} data={[]} />);
    expect(screen.getByTestId('select').children[0]).toHaveTextContent('No time columns');
  });

  it('should handle change in selection', () => {
    render(<PluginFilterTimeColumn {...defaultProps} />);
    fireEvent.change(screen.getByTestId('select'), { target: { value: 'time_col2' } });
    expect(mockSetDataMask).toHaveBeenCalledWith({
      extraFormData: { granularity_sqla: 'time_col2' },
      filterState: { value: ['time_col2'] },
    });
  });

  it('should handle filterState value change', () => {
    const { rerender } = render(<PluginFilterTimeColumn {...defaultProps} />);
    expect(screen.getByTestId('select').value).toBe('time_col1');
    
    rerender(<PluginFilterTimeColumn {...defaultProps} filterState={{ value: ['time_col2'] }} />);
    expect(screen.getByTestId('select').value).toBe('time_col2');
  });
});
