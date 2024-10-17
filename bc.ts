import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useTheme } from '@superset-ui/core';
import ControlFormItem, { ControlFormItemComponents } from './ControlFormItem';
import ControlHeader from '../../../ControlHeader';

// Mock the `useTheme` hook to return theme values
jest.mock('@superset-ui/core', () => ({
  useTheme: jest.fn(),
}));

// Mock components from `ControlFormItemComponents`
ControlFormItemComponents.Checkbox = jest.fn(() => <div>Checkbox</div>);
ControlFormItemComponents.TextControl = jest.fn(() => <input />);

describe('ControlFormItem', () => {
  const mockOnChange = jest.fn();
  const mockTheme = {
    gridUnit: 4,
  };

  beforeEach(() => {
    // Mock the theme to be used in the component
    useTheme.mockReturnValue(mockTheme);
    jest.clearAllMocks();
  });

  it('renders the Checkbox control with the correct props', () => {
    const { getByText } = render(
      <ControlFormItem
        name="checkboxControl"
        label="Test Checkbox"
        controlType="Checkbox"
        value={true}
        onChange={mockOnChange}
      />,
    );

    // Check if the Checkbox is rendered
    expect(getByText('Checkbox')).toBeInTheDocument();

    // Check if the ControlHeader renders correctly
    expect(getByText('Test Checkbox')).toBeInTheDocument();
  });

  it('renders other control types and handles change events', () => {
    const { getByRole } = render(
      <ControlFormItem
        name="textControl"
        label="Test Input"
        controlType="TextControl"
        value="initialValue"
        onChange={mockOnChange}
      />,
    );

    // Check if the TextControl is rendered (an input in this case)
    const input = getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('initialValue');

    // Simulate changing the input value
    fireEvent.change(input, { target: { value: 'newValue' } });

    // Ensure the onChange handler is called with the updated value
    expect(mockOnChange).toHaveBeenCalledWith('newValue');
  });

  it('validates the value and shows validation errors', () => {
    const validator = jest.fn(value => (value !== 'valid' ? 'Error' : false));

    const { getByText, getByRole } = render(
      <ControlFormItem
        name="textControl"
        label="Test Input"
        controlType="TextControl"
        value="initialValue"
        validators={[validator]}
        onChange={mockOnChange}
      />,
    );

    const input = getByRole('textbox');
    fireEvent.change(input, { target: { value: 'invalid' } });

    // Ensure the validator is called
    expect(validator).toHaveBeenCalledWith('invalid');

    // Check if the validation error is displayed
    expect(getByText('Error')).toBeInTheDocument();

    // Ensure onChange is not called when validation errors exist
    expect(mockOnChange).not.toHaveBeenCalled();

    // Change to a valid value
    fireEvent.change(input, { target: { value: 'valid' } });

    // Ensure the validator is called with the new value
    expect(validator).toHaveBeenCalledWith('valid');

    // Ensure the validation error is cleared
    expect(getByText('Error')).not.toBeInTheDocument();

    // Ensure onChange is called with the valid value
    expect(mockOnChange).toHaveBeenCalledWith('valid');
  });

  it('applies styles from the theme', () => {
    const { container } = render(
      <ControlFormItem
        name="textControl"
        controlType="TextControl"
        value="initialValue"
      />,
    );

    const div = container.querySelector('div');
    expect(div).toHaveStyle(`
      margin: 8px;
      width: undefined;
      max-width: 100%;
      flex: 1;
    `);
  });
});
