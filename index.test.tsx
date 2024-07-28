// ControlForm.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useTheme } from '@superset-ui/core';
import ControlForm, { ControlFormRow } from './ControlForm';
import ControlFormItem from './ControlFormItem';

// Mock necessary modules
jest.mock('@superset-ui/core', () => ({
  useTheme: jest.fn(),
  FAST_DEBOUNCE: 300,
}));

const mockTheme = {
  gridUnit: 4,
  colors: {
    text: {
      label: 'black',
    },
  },
  typography: {
    sizes: {
      s: '12px',
    },
  },
};

const MockControlFormItem = ({ name, value, onChange }) => (
  <input
    data-testid={name}
    value={value}
    onChange={e => onChange(e.target.value)}
  />
);

jest.mock('./ControlFormItem', () => jest.fn(MockControlFormItem));

describe('ControlForm', () => {
  beforeEach(() => {
    useTheme.mockReturnValue(mockTheme);
  });

  it('renders ControlForm with ControlFormRow and ControlFormItem', () => {
    const handleChange = jest.fn();
    const initialValue = { field1: 'value1', field2: 'value2' };

    render(
      <ControlForm onChange={handleChange} value={initialValue}>
        <ControlFormRow>
          <ControlFormItem name="field1" />
          <ControlFormItem name="field2" />
        </ControlFormRow>
      </ControlForm>
    );

    // Check if the ControlFormItem inputs are rendered with the correct values
    const input1 = screen.getByTestId('field1');
    const input2 = screen.getByTestId('field2');
    expect(input1).toHaveValue('value1');
    expect(input2).toHaveValue('value2');
  });

  it('handles change events for ControlFormItem components', () => {
    const handleChange = jest.fn();
    const initialValue = { field1: 'value1', field2: 'value2' };

    render(
      <ControlForm onChange={handleChange} value={initialValue}>
        <ControlFormRow>
          <ControlFormItem name="field1" />
          <ControlFormItem name="field2" />
        </ControlFormRow>
      </ControlForm>
    );

    // Simulate change events on the inputs
    const input1 = screen.getByTestId('field1');
    const input2 = screen.getByTestId('field2');
    fireEvent.change(input1, { target: { value: 'newValue1' } });
    fireEvent.change(input2, { target: { value: 'newValue2' } });

    // Check if handleChange is called with the correct values
    expect(handleChange).toHaveBeenCalledWith({
      field1: 'newValue1',
      field2: 'value2',
    });
    expect(handleChange).toHaveBeenCalledWith({
      field1: 'newValue1',
      field2: 'newValue2',
    });
  });

  it('renders ControlFormRow with correct styling', () => {
    render(
      <ControlForm onChange={jest.fn()} value={{}}>
        <ControlFormRow>
          <ControlFormItem name="field1" />
          <ControlFormItem name="field2" />
        </ControlFormRow>
      </ControlForm>
    );

    const controlFormRow = screen.getByTestId('control-form-row');
    expect(controlFormRow).toHaveStyle('display: flex');
    expect(controlFormRow).toHaveStyle('flex-wrap: nowrap');
    expect(controlFormRow).toHaveStyle('margin: -8px');
    expect(controlFormRow).toHaveStyle('margin-bottom: 4px');
  });
});
