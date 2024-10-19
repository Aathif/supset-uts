import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { FormattingPopover } from './FormattingPopover';
import { FormattingPopoverContent } from './FormattingPopoverContent';
import Popover from 'src/components/Popover';

// Mock Popover and FormattingPopoverContent
jest.mock('src/components/Popover', () => ({ children, ...props }) => (
  <div data-testid="popover">{children}</div>
));
jest.mock('./FormattingPopoverContent', () => ({
  FormattingPopoverContent: jest.fn(({ onChange }) => (
    <div data-testid="popover-content">
      <button onClick={() => onChange({ test: 'newConfig' })}>
        Save Config
      </button>
    </div>
  )),
}));

describe('FormattingPopover', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    title: 'Test Popover',
    columns: ['column1', 'column2'],
    config: { test: 'config' },
    onChange: mockOnChange,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders popover and children', () => {
    render(
      <FormattingPopover {...defaultProps}>
        <div>Popover Trigger</div>
      </FormattingPopover>,
    );

    expect(screen.getByText('Popover Trigger')).toBeInTheDocument();
  });

  test('opens popover on click', () => {
    render(
      <FormattingPopover {...defaultProps}>
        <div>Popover Trigger</div>
      </FormattingPopover>,
    );

    // Trigger popover by clicking the trigger
    fireEvent.click(screen.getByText('Popover Trigger'));
    
    // Ensure popover content is rendered
    expect(screen.getByTestId('popover')).toBeInTheDocument();
    expect(screen.getByTestId('popover-content')).toBeInTheDocument();
  });

  test('calls onChange with new config on save', () => {
    render(
      <FormattingPopover {...defaultProps}>
        <div>Popover Trigger</div>
      </FormattingPopover>,
    );

    // Trigger popover by clicking the trigger
    fireEvent.click(screen.getByText('Popover Trigger'));

    // Simulate saving new config
    fireEvent.click(screen.getByText('Save Config'));

    // Check if onChange is called with new config
    expect(mockOnChange).toHaveBeenCalledWith({ test: 'newConfig' });
  });
});
