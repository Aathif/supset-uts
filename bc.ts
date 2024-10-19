import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ContourPopoverTrigger from './ContourPopoverTrigger';
import ControlPopover from '../ControlPopover/ControlPopover';
import ContourPopoverControl from './ContourPopoverControl';
import { ThemeProvider } from 'styled-components';
import { supersetTheme } from '@superset-ui/core';

// Mock ControlPopover and ContourPopoverControl
jest.mock('../ControlPopover/ControlPopover', () => ({
  __esModule: true,
  default: ({ children, content, onVisibleChange, visible }) => (
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

jest.mock('./ContourPopoverControl', () => ({
  __esModule: true,
  default: ({ onClose, onSave }) => (
    <div>
      <button onClick={() => onSave({ contourValue: 'newContour' })}>
        Save
      </button>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe('ContourPopoverTrigger', () => {
  const defaultProps = {
    value: 'initialContour',
    saveContour: jest.fn(),
    isControlled: false,
    visible: false,
    toggleVisibility: jest.fn(),
    children: <span>Click Me</span>,
  };

  const renderComponent = (props = {}) => {
    return render(
      <ThemeProvider theme={supersetTheme}>
        <ContourPopoverTrigger {...defaultProps} {...props} />
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

    // Expect the ContourPopoverControl content to be visible
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  test('closes the popover when the Close button is clicked', () => {
    renderComponent();

    // Open popover
    fireEvent.click(screen.getByLabelText('popover-trigger'));

    // Click the Close button
    fireEvent.click(screen.getByText('Close'));

    // Expect the popover content to be closed (not in the document)
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
    expect(screen.queryByText('Close')).not.toBeInTheDocument();
  });

  test('calls saveContour when Save button is clicked', () => {
    const saveContourMock = jest.fn();
    renderComponent({ saveContour: saveContourMock });

    // Open popover
    fireEvent.click(screen.getByLabelText('popover-trigger'));

    // Click the Save button
    fireEvent.click(screen.getByText('Save'));

    // Expect saveContour to be called with new contour value
    expect(saveContourMock).toHaveBeenCalledWith({ contourValue: 'newContour' });
  });

  test('controlled visibility: uses controlled visibility state when isControlled is true', () => {
    const toggleVisibilityMock = jest.fn();
    renderComponent({
      isControlled: true,
      visible: true,
      toggleVisibility: toggleVisibilityMock,
    });

    // Check that popover is visible initially
    expect(screen.getByText('Save')).toBeInTheDocument();

    // Trigger visibility change (toggle)
    fireEvent.click(screen.getByLabelText('popover-trigger'));

    // Expect toggleVisibility to be called with the new visibility state
    expect(toggleVisibilityMock).toHaveBeenCalledWith(false);
  });
});
