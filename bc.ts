import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NumberInput from './NumberInput';

describe('NumberInput', () => {
  const defaultProps = {
    timeUnit: 'ms',
    min: 0,
    name: 'duration',
    value: '1000',
    placeholder: 'Enter time',
    onChange: jest.fn(),
  };

  test('renders with correct value and time unit when not focused', () => {
    const { getByPlaceholderText } = render(<NumberInput {...defaultProps} />);

    const input = getByPlaceholderText('Enter time') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('1000 ms');
  });

  test('removes time unit on focus', () => {
    const { getByPlaceholderText } = render(<NumberInput {...defaultProps} />);

    const input = getByPlaceholderText('Enter time') as HTMLInputElement;
    fireEvent.focus(input);

    expect(input.value).toBe('1000'); // Time unit removed when focused
  });

  test('adds time unit back on blur', () => {
    const { getByPlaceholderText } = render(<NumberInput {...defaultProps} />);

    const input = getByPlaceholderText('Enter time') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(input.value).toBe('1000 ms'); // Time unit added back when blurred
  });

  test('calls onChange when value changes', () => {
    const onChangeMock = jest.fn();
    const props = { ...defaultProps, onChange: onChangeMock };
    const { getByPlaceholderText } = render(<NumberInput {...props} />);

    const input = getByPlaceholderText('Enter time') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '2000' } });

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith(expect.any(Object));
    expect(input.value).toBe('2000 ms');
  });

  test('displays empty string if no value is passed', () => {
    const { getByPlaceholderText } = render(
      <NumberInput {...defaultProps} value="" />,
    );

    const input = getByPlaceholderText('Enter time') as HTMLInputElement;
    expect(input.value).toBe('');
  });
});
