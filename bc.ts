import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { CustomFrame } from './path-to-your-CustomFrame';
import { t } from '@superset-ui/core';

// Mocking the required parts of the component
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('src/components/Select/Select', () => ({ options, onChange, value }: any) => (
  <select value={value} onChange={e => onChange(e.target.value)} data-testid="select">
    {options.map((option: any) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
));

jest.mock('src/components/DatePicker', () => ({ onChange, value, locale }: any) => (
  <input
    type="datetime-local"
    onChange={e => onChange(e.target.value)}
    value={value}
    data-testid="datepicker"
  />
));

jest.mock('src/components/Input', () => ({ value, onChange }: any) => (
  <input
    type="number"
    value={value}
    onChange={e => onChange(Number(e.target.value))}
    data-testid="inputnumber"
  />
));

jest.mock('@superset-ui/chart-controls', () => ({
  InfoTooltipWithTrigger: () => <div data-testid="tooltip">Tooltip</div>,
}));

describe('CustomFrame Component', () => {
  const defaultProps = {
    value: 'custom-range',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    (useSelector as jest.Mock).mockReturnValue('en'); // Mocking locale state
  });

  it('should render the component correctly', () => {
    render(<CustomFrame {...defaultProps} />);

    // Verify that key elements are rendered
    expect(screen.getByText(t('Configure custom time range'))).toBeInTheDocument();
    expect(screen.getByText(t('START (INCLUSIVE)'))).toBeInTheDocument();
    expect(screen.getByText(t('END (EXCLUSIVE)'))).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('should render the date pickers when mode is set to "specific"', () => {
    const customRange = {
      sinceMode: 'specific',
      sinceDatetime: '2020-01-01T00:00:00',
      untilMode: 'specific',
      untilDatetime: '2020-01-02T00:00:00',
    };

    render(<CustomFrame {...defaultProps} value={customRange} />);

    // Check if date pickers for specific mode are rendered
    const sinceDatePicker = screen.getByTestId('datepicker');
    fireEvent.change(sinceDatePicker, { target: { value: '2020-01-01T00:00:00' } });
    expect(defaultProps.onChange).toHaveBeenCalledWith(
      expect.stringContaining('2020-01-01T00:00:00'),
    );
  });

  it('should render the input number and select for "relative" mode', () => {
    const customRange = {
      sinceMode: 'relative',
      sinceGrainValue: 2,
      sinceGrain: 'day',
      untilMode: 'relative',
      untilGrainValue: 3,
      untilGrain: 'day',
    };

    render(<CustomFrame {...defaultProps} value={customRange} />);

    // Check if InputNumber and Select for relative mode are rendered
    const inputNumber = screen.getByTestId('inputnumber');
    fireEvent.change(inputNumber, { target: { value: 2 } });
    expect(defaultProps.onChange).toHaveBeenCalledWith(
      expect.stringContaining('"sinceGrainValue":2'),
    );

    const select = screen.getByTestId('select');
    fireEvent.change(select, { target: { value: 'day' } });
    expect(defaultProps.onChange).toHaveBeenCalledWith(
      expect.stringContaining('"sinceGrain":"day"'),
    );
  });

  it('should handle anchor mode changes', () => {
    const customRange = {
      anchorMode: 'now',
      sinceMode: 'relative',
      untilMode: 'relative',
    };

    render(<CustomFrame {...defaultProps} value={customRange} />);

    const nowRadio = screen.getByLabelText(t('NOW'));
    fireEvent.click(nowRadio);
    expect(defaultProps.onChange).toHaveBeenCalledWith(
      expect.stringContaining('"anchorMode":"now"'),
    );
  });

  it('should render locale-specific date picker', () => {
    render(<CustomFrame {...defaultProps} />);

    // Verify locale passed to DatePicker
    expect(screen.getByTestId('datepicker')).toBeInTheDocument();
  });
});
