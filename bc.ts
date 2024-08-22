import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ExtraControls from './path_to_ExtraControls';
import { useExtraControl } from './path_to_useExtraControl';

// Mock useExtraControl hook
jest.mock('./path_to_useExtraControl', () => ({
  useExtraControl: jest.fn(),
}));

describe('ExtraControls component', () => {
  const mockSetControlValue = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render null if showExtraControls is false', () => {
    const formData = { showExtraControls: false, stack: null, area: false };

    render(<ExtraControls formData={formData} setControlValue={mockSetControlValue} />);

    expect(screen.queryByRole('radiogroup')).toBeNull();
  });

  it('should render extra controls if showExtraControls is true', () => {
    const formData = { showExtraControls: true, stack: null, area: false };
    const mockOptions = [{ label: 'Option 1', value: 'option1' }];
    const mockHandler = jest.fn();
    const mockValue = 'option1';

    useExtraControl.mockReturnValue({
      extraControlsOptions: mockOptions,
      extraControlsHandler: mockHandler,
      extraValue: mockValue,
    });

    render(<ExtraControls formData={formData} setControlValue={mockSetControlValue} />);

    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 1')).toBeChecked();
  });

  it('should call the handler when an option is changed', () => {
    const formData = { showExtraControls: true, stack: null, area: false };
    const mockOptions = [{ label: 'Option 1', value: 'option1' }];
    const mockHandler = jest.fn();
    const mockValue = 'option1';

    useExtraControl.mockReturnValue({
      extraControlsOptions: mockOptions,
      extraControlsHandler: mockHandler,
      extraValue: mockValue,
    });

    render(<ExtraControls formData={formData} setControlValue={mockSetControlValue} />);

    const radioButton = screen.getByLabelText('Option 1');
    fireEvent.click(radioButton);

    expect(mockHandler).toHaveBeenCalled();
  });
});
