import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PluginFilterTimegrain from './PluginFilterTimegrain';
import { ensureIsArray, ExtraFormData, t, TimeGranularity, tn } from '@superset-ui/core';

// Mock the dependencies
jest.mock('@superset-ui/core', () => ({
  ensureIsArray: jest.fn().mockImplementation(val => (Array.isArray(val) ? val : [val])),
  t: jest.fn(str => str),
  tn: jest.fn((str, strPlural, count) => (count > 1 ? strPlural : str)),
}));

describe('PluginFilterTimegrain', () => {
  const mockSetDataMask = jest.fn();
  const mockSetHoveredFilter = jest.fn();
  const mockUnsetHoveredFilter = jest.fn();
  const mockSetFocusedFilter = jest.fn();
  const mockUnsetFocusedFilter = jest.fn();
  const mockSetFilterActive = jest.fn();
  const mockInputRef = React.createRef();

  const defaultProps = {
    data: [
      { duration: 'P1D', name: 'Day' },
      { duration: 'P1W', name: 'Week' },
    ],
    formData: { defaultValue: ['P1D'] },
    height: 400,
    width: 400,
    setDataMask: mockSetDataMask,
    setHoveredFilter: mockSetHoveredFilter,
    unsetHoveredFilter: mockUnsetHoveredFilter,
    setFocusedFilter: mockSetFocusedFilter,
    unsetFocusedFilter: mockUnsetFocusedFilter,
    setFilterActive: mockSetFilterActive,
    filterState: {},
    inputRef: mockInputRef,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component with options', () => {
    render(<PluginFilterTimegrain {...defaultProps} />);
    expect(screen.getByPlaceholderText('1 option')).toBeInTheDocument();
  });

  it('should call setDataMask on value change', () => {
    render(<PluginFilterTimegrain {...defaultProps} />);
    const select = screen.getByPlaceholderText('1 option');
    fireEvent.change(select, { target: { value: 'P1W' } });
    expect(mockSetDataMask).toHaveBeenCalledWith({
      extraFormData: { time_grain_sqla: 'P1W' },
      filterState: { label: 'Week', value: ['P1W'] },
    });
  });

  it('should handle empty data case', () => {
    render(<PluginFilterTimegrain {...defaultProps} data={[]} />);
    expect(screen.getByPlaceholderText('No data')).toBeInTheDocument();
  });

  it('should call the focus and blur handlers', () => {
    render(<PluginFilterTimegrain {...defaultProps} />);
    const select = screen.getByPlaceholderText('1 option');
    fireEvent.focus(select);
    expect(mockSetFocusedFilter).toHaveBeenCalled();
    fireEvent.blur(select);
    expect(mockUnsetFocusedFilter).toHaveBeenCalled();
  });

  it('should call the mouse enter and leave handlers', () => {
    render(<PluginFilterTimegrain {...defaultProps} />);
    const select = screen.getByPlaceholderText('1 option');
    fireEvent.mouseEnter(select);
    expect(mockSetHoveredFilter).toHaveBeenCalled();
    fireEvent.mouseLeave(select);
    expect(mockUnsetHoveredFilter).toHaveBeenCalled();
  });

  it('should handle filterState value change', () => {
    const { rerender } = render(<PluginFilterTimegrain {...defaultProps} />);
    expect(screen.getByPlaceholderText('1 option')).toHaveValue('P1D');

    rerender(<PluginFilterTimegrain {...defaultProps} filterState={{ value: ['P1W'] }} />);
    expect(screen.getByPlaceholderText('1 option')).toHaveValue('P1W');
  });
});
