import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ColumnGroupByAggregatePopover } from './ColumnGroupByAggregatePopover';
import { ColumnGroupByAggregatePopoverContent } from './ColumnGroupByAggregatePopoverContent';
import Popover from 'src/components/Popover';
import { ColumnGroupByAggregateConfig } from './types';
import { ThemeProvider } from 'styled-components';
import { supersetTheme } from '@superset-ui/core';

// Mock Popover and ColumnGroupByAggregatePopoverContent
jest.mock('src/components/Popover', () => ({
  __esModule: true,
  default: ({ children, content, visible, onVisibleChange }) => (
    <div>
      <button
        onClick={() => onVisibleChange(!visible)}
        aria-label="popover-trigger"
      >
        {children}
      </button>
      {visible && <div>{content}</div>}
    </div>
  ),
}));

jest.mock('./ColumnGroupByAggregatePopoverContent', () => ({
  __esModule: true,
  ColumnGroupByAggregatePopoverContent: ({ onChange }) => (
    <div>
      <button
        onClick={() => onChange({ aggregateValue: 'newAggregate' })}
      >
        Save
      </button>
    </div>
  ),
}));

describe('ColumnGroupByAggregatePopover', () => {
  const defaultProps = {
    title: 'Test Popover',
    columns: 'column1',
    config: { aggregateValue: 'initialValue' } as ColumnGroupByAggregateConfig,
    onChange: jest.fn(),
    children: <span>Click Me</span>,
  };

  const renderComponent = (props = {}) => {
    return render(
      <ThemeProvider theme={supersetTheme}>
        <ColumnGroupByAggregatePopover {...defaultProps} {...props} />
      </ThemeProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    renderComponent();
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  test('opens the popover when the trigger is clicked', () => {
    renderComponent();

    // Click to open popover
    fireEvent.click(screen.getByLabelText('popover-trigger'));

    // Expect the Popover content to be visible
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  test('closes the popover when Save button is clicked', () => {
    renderComponent();

    // Open popover
    fireEvent.click(screen.getByLabelText('popover-trigger'));

    // Click the Save button
    fireEvent.click(screen.getByText('Save'));

    // Expect the popover content to be closed
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  test('calls onChange when Save button is clicked', () => {
    const onChangeMock = jest.fn();
    renderComponent({ onChange: onChangeMock });

    // Open popover
    fireEvent.click(screen.getByLabelText('popover-trigger'));

    // Click the Save button
    fireEvent.click(screen.getByText('Save'));

    // Expect onChange to be called with new aggregate value
    expect(onChangeMock).toHaveBeenCalledWith({ aggregateValue: 'newAggregate' });
  });
});
