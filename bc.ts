import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useTheme } from 'styled-components';
import ControlForm from './ControlForm';
import debounce from 'lodash/debounce';

// Mock the `useTheme` hook to return theme values
jest.mock('styled-components', () => ({
  useTheme: jest.fn(),
}));

// Mock debounce function to immediately call the debounced function
jest.mock('lodash/debounce', () => jest.fn(fn => fn));

describe('ControlForm', () => {
  const mockOnChange = jest.fn();
  const mockTheme = {
    colors: {
      text: {
        label: 'grey',
      },
    },
    typography: {
      sizes: {
        s: '12px',
      },
    },
  };

  beforeEach(() => {
    // Mock the theme to be used in the component
    useTheme.mockReturnValue(mockTheme);
    jest.clearAllMocks();
  });

  it('renders children and applies styles from the theme', () => {
    const { getByText } = render(
      <ControlForm onChange={mockOnChange} value={{}}>
        <div>
          <label>Test Label</label>
        </div>
      </ControlForm>,
    );

    // Check if the label is rendered
    expect(getByText('Test Label')).toBeInTheDocument();

    // Check if the label has the correct styling
    const label = getByText('Test Label');
    expect(label).toHaveStyle(`
      text-transform: uppercase;
      color: grey;
      font-size: 12px;
    `);
  });

  it('calls onChange when form item value changes', () => {
    const { getByLabelText } = render(
      <ControlForm onChange={mockOnChange} value={{ fieldName: 'initialValue' }}>
        <div>
          <input
            name="fieldName"
            aria-label="fieldName"
            onChange={e => e.target.value}
          />
        </div>
      </ControlForm>,
    );

    const input = getByLabelText('fieldName');
    
    // Simulate changing the input value
    fireEvent.change(input, { target: { value: 'newValue' } });

    // Ensure that the onChange handler is called with the updated value
    expect(mockOnChange).toHaveBeenCalledWith({ fieldName: 'newValue' });
  });

  it('uses debounce for onChange with custom debounceDelay', () => {
    const { getByLabelText } = render(
      <ControlForm onChange={mockOnChange} value={{ fieldName: 'initialValue' }}>
        <div>
          <input
            name="fieldName"
            aria-label="fieldName"
            debounceDelay={300}
            onChange={e => e.target.value}
          />
        </div>
      </ControlForm>,
    );

    const input = getByLabelText('fieldName');
    
    // Simulate changing the input value
    fireEvent.change(input, { target: { value: 'newValue' } });

    // Ensure that debounce is used when calling the debounced function
    expect(debounce).toHaveBeenCalledWith(mockOnChange, 300);

    // Ensure that the onChange handler is called with the updated value
    expect(mockOnChange).toHaveBeenCalledWith({ fieldName: 'newValue' });
  });
});
