import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ConditionalFormattingControl } from './ConditionalFormattingControl';
import { FormattingPopover } from './FormattingPopover';
import { Comparator } from '@superset-ui/chart-controls';
import { ThemeProvider } from 'styled-components';
import { supersetTheme } from '@superset-ui/core';

// Mock FormattingPopover
jest.mock('./FormattingPopover', () => ({
  FormattingPopover: ({ children, onChange }) => (
    <div>
      <button onClick={() => onChange({ column: 'test', operator: Comparator.Equal, targetValue: '10' })}>
        Save
      </button>
      {children}
    </div>
  ),
}));

describe('ConditionalFormattingControl', () => {
  const defaultProps = {
    value: [],
    onChange: jest.fn(),
    columnOptions: [{ value: 'column1', label: 'Column 1' }],
    verboseMap: { column1: 'Column 1' },
    removeIrrelevantConditions: false,
  };

  const renderComponent = (props = {}) => {
    return render(
      <ThemeProvider theme={supersetTheme}>
        <ConditionalFormattingControl {...defaultProps} {...props} />
      </ThemeProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    renderComponent();
    expect(screen.getByText('Add new color formatter')).toBeInTheDocument();
  });

  test('adds a new formatter when clicking "Add new color formatter"', () => {
    renderComponent();

    // Click "Add new color formatter"
    fireEvent.click(screen.getByText('Add new color formatter'));

    // Click "Save" in the mocked FormattingPopover
    fireEvent.click(screen.getByText('Save'));

    // Expect onChange to be called with the new formatter config
    expect(defaultProps.onChange).toHaveBeenCalledWith([
      { column: 'test', operator: Comparator.Equal, targetValue: '10' },
    ]);
  });

  test('removes a formatter when clicking the delete button', () => {
    const initialConfig = [{ column: 'column1', operator: Comparator.Equal, targetValue: '100' }];
    renderComponent({ value: initialConfig });

    // Click the delete button
    fireEvent.click(screen.getByRole('button', { name: /xsmall/i }));

    // Expect onChange to be called with an empty array (formatter removed)
    expect(defaultProps.onChange).toHaveBeenCalledWith([]);
  });

  test('edits a formatter when clicking the save button in edit mode', () => {
    const initialConfig = [{ column: 'column1', operator: Comparator.Equal, targetValue: '100' }];
    renderComponent({ value: initialConfig });

    // Click on the existing formatter to open the edit popover
    fireEvent.click(screen.getByText('Column 1 = 100'));

    // Click "Save" in the mocked FormattingPopover to edit the formatter
    fireEvent.click(screen.getByText('Save'));

    // Expect onChange to be called with the edited formatter config
    expect(defaultProps.onChange).toHaveBeenCalledWith([
      { column: 'test', operator: Comparator.Equal, targetValue: '10' },
    ]);
  });
});
