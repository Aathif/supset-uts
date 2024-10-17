import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ColumnConfigItem from './ColumnConfigItem';
import { useTheme } from '@superset-ui/core';
import ColumnConfigPopover from './ColumnConfigPopover';

// Mock the useTheme hook
jest.mock('@superset-ui/core', () => ({
  useTheme: jest.fn(),
}));

// Mock the ColumnConfigPopover component
jest.mock('./ColumnConfigPopover', () => jest.fn(() => <div>Popover Content</div>));

describe('ColumnConfigItem', () => {
  const mockOnChange = jest.fn();
  const mockTheme = {
    colors: {
      grayscale: { light2: '#e0e0e0', light4: '#b0b0b0', light1: '#f0f0f0' },
    },
    gridUnit: 4,
  };

  beforeEach(() => {
    useTheme.mockReturnValue(mockTheme);
    jest.clearAllMocks();
  });

  it('renders column name and type', () => {
    const column = { name: 'Column A', type: 'STRING' };
    const { getByText } = render(
      <ColumnConfigItem
        column={column}
        onChange={mockOnChange}
      />
    );

    expect(getByText('Column A')).toBeInTheDocument();
    expect(getByText('STRING')).toBeInTheDocument(); // Assuming ColumnTypeLabel renders the type
  });

  it('opens popover on click', () => {
    const column = { name: 'Column B', type: 'NUMBER' };
    const { getByText } = render(
      <ColumnConfigItem
        column={column}
        onChange={mockOnChange}
      />
    );

    // Click the item to open the popover
    fireEvent.click(getByText('Column B'));

    // Check if the popover content is rendered
    expect(getByText('Popover Content')).toBeInTheDocument();
  });

  it('calls onChange when column config is changed', () => {
    const column = { name: 'Column C', type: 'BOOLEAN' };
    const { getByText } = render(
      <ColumnConfigItem
        column={column}
        onChange={mockOnChange}
      />
    );

    // Open the popover
    fireEvent.click(getByText('Column C'));

    // Assuming you have some interaction in the popover that calls onChange
    // Simulate a change
    fireEvent.click(getByText('Some action in popover')); // Adjust based on actual popover content

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('renders with correct styles based on theme', () => {
    const column = { name: 'Column D', type: 'STRING' };
    const { container } = render(
      <ColumnConfigItem
        column={column}
        onChange={mockOnChange}
      />
    );

    // Check styles here if necessary (for example, you can check for class names or styles applied)
    expect(container.firstChild).toHaveStyle(`border-bottom: 1px solid ${mockTheme.colors.grayscale.light2}`);
  });
});
