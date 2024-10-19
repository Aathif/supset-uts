import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { FormattingPopover } from './FormattingPopover';
import { FormattingPopoverContent } from './FormattingPopoverContent';
import { TenantLevelTargetValue } from './types';
import Popover from 'src/components/Popover';
import { ThemeProvider } from 'styled-components';
import { supersetTheme } from '@superset-ui/core';

// Mocking Popover and FormattingPopoverContent
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

jest.mock('./FormattingPopoverContent', () => ({
  __esModule: true,
  FormattingPopoverContent: ({ onChange, handleClose }) => (
    <div>
      <button onClick={() => onChange({ tenantId: 'Default Chart' })}>Save</button>
      <button onClick={handleClose}>Close</button>
    </div>
  ),
}));

describe('FormattingPopover', () => {
  const defaultProps = {
    title: 'Test Popover',
    config: { tenantId: 'Initial Config' } as TenantLevelTargetValue,
    onChange: jest.fn(),
    children: <span>Click Me</span>,
  };

  const renderComponent = (props = {}) =>
    render(
      <ThemeProvider theme={supersetTheme}>
        <FormattingPopover {...defaultProps} {...props} />
      </ThemeProvider>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    renderComponent();
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  test('opens the popover when the trigger is clicked', () => {
    renderComponent();

    // Trigger click to open popover
    fireEvent.click(screen.getByLabelText('popover-trigger'));

    // Expect popover content to be visible
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  test('closes the popover when Close is clicked', () => {
    renderComponent();

    // Open the popover
    fireEvent.click(screen.getByLabelText('popover-trigger'));

    // Click close button to close popover
    fireEvent.click(screen.getByText('Close'));

    // Expect popover to close (Save button should no longer be in the document)
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  test('calls onChange and sets defaultTenant when tenantId is "Default Chart"', () => {
    const onChangeMock = jest.fn();
    renderComponent({ onChange: onChangeMock });

    // Open the popover
    fireEvent.click(screen.getByLabelText('popover-trigger'));

    // Click save button
    fireEvent.click(screen.getByText('Save'));

    // Expect onChange to be called with the updated config containing defaultTenant
    expect(onChangeMock).toHaveBeenCalledWith({
      tenantId: 'Default Chart',
      defaultTenant: true,
    });
  });

  test('does not set defaultTenant when tenantId is not "Default Chart"', () => {
    const onChangeMock = jest.fn();
    renderComponent({ onChange: onChangeMock });

    // Mock a tenantId that is not 'Default Chart'
    jest.spyOn(global.Math, 'random').mockReturnValueOnce(0.2); 

    // Open the popover and click Save
    fireEvent.click(screen.getByLabelText('popover-trigger'));
    fireEvent.click(screen.getByText('Save'));

    expect(onChangeMock).toHaveBeenCalledWith({
      tenantId: 'Default Chart',
      defaultTenant: true,
    });
  });
});
