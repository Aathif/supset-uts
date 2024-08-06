import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ControlForm, { ControlFormRow } from './ControlForm'; // Adjust the import path as needed
import { ThemeProvider, supersetTheme } from '@superset-ui/core';

const renderWithTheme = (ui, { theme = supersetTheme, ...options } = {}) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>, options);
};

describe('ControlForm', () => {
  const onChangeMock = jest.fn();

  const defaultProps = {
    onChange: onChangeMock,
    value: { field1: 'value1' },
    children: (
      <ControlFormRow>
        <div name="field1" />
      </ControlFormRow>
    ),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    const { container } = renderWithTheme(<ControlForm {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  test('calls onChange with the correct value', () => {
    const { getByText } = renderWithTheme(
      <ControlForm
        {...defaultProps}
        children={
          <ControlFormRow>
            <div
              name="field1"
              onChange={jest.fn()}
              value="initialValue"
            >
              <span>Field 1</span>
            </div>
          </ControlFormRow>
        }
      />
    );

    const field1 = getByText('Field 1');
    fireEvent.change(field1, { target: { value: 'newValue' } });

    expect(onChangeMock).toHaveBeenCalledWith({ field1: 'newValue' });
  });

  test('handles multiple fields and debounced onChange', () => {
    jest.useFakeTimers();
    const { getByText } = renderWithTheme(
      <ControlForm
        {...defaultProps}
        children={
          <ControlFormRow>
            <div
              name="field1"
              onChange={jest.fn()}
              value="initialValue1"
            >
              <span>Field 1</span>
            </div>
            <div
              name="field2"
              onChange={jest.fn()}
              value="initialValue2"
              debounceDelay={200}
            >
              <span>Field 2</span>
            </div>
          </ControlFormRow>
        }
      />
    );

    const field1 = getByText('Field 1');
    const field2 = getByText('Field 2');

    fireEvent.change(field1, { target: { value: 'newValue1' } });
    expect(onChangeMock).toHaveBeenCalledWith({ field1: 'newValue1' });

    fireEvent.change(field2, { target: { value: 'newValue2' } });
    jest.advanceTimersByTime(200);
    expect(onChangeMock).toHaveBeenCalledWith({
      field1: 'newValue1',
      field2: 'newValue2',
    });

    jest.useRealTimers();
  });
});

describe('ControlFormRow', () => {
  test('renders correctly', () => {
    const { container } = renderWithTheme(
      <ControlFormRow>
        <div>Child 1</div>
        <div>Child 2</div>
      </ControlFormRow>
    );
    expect(container).toMatchSnapshot();
  });

  test('renders children', () => {
    const { getByText } = renderWithTheme(
      <ControlFormRow>
        <div>Child 1</div>
        <div>Child 2</div>
      </ControlFormRow>
    );

    expect(getByText('Child 1')).toBeInTheDocument();
    expect(getByText('Child 2')).toBeInTheDocument();
  });
});
