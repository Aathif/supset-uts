import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DateFilterPlugin from './DateFilterPlugin';
import { styled, t, tn } from '@superset-ui/core';
import moment from 'moment';

// Mock the dependencies
jest.mock('@superset-ui/core', () => ({
  styled: jest.fn().mockImplementation((component) => component),
  t: jest.fn((str) => str),
  tn: jest.fn((str, strPlural, count) => (count > 1 ? strPlural : str)),
}));

jest.mock('src/components/DatePicker', () => ({
  RangePicker: ({ onChange, value, picker }) => (
    <div>
      <input
        data-testid="datepicker"
        type="text"
        value={value ? `${value[0].format('YYYY-MM-DD')} : ${value[1].format('YYYY-MM-DD')}` : ''}
        onChange={(e) => {
          const [start, end] = e.target.value.split(' : ');
          onChange([moment(start), moment(end)], [start, end]);
        }}
      />
      {picker && <div data-testid="picker">{picker}</div>}
    </div>
  ),
}));

describe('DateFilterPlugin', () => {
  const mockSetDataMask = jest.fn();

  const defaultProps = {
    setDataMask: mockSetDataMask,
    width: 400,
    height: 400,
    filterState: {},
    formData: {
      enableTime: false,
      monthlyFilter: false,
      quarterFilter: false,
      yearlyFilter: false,
      customDateFormat: 'YYYY-MM-DD',
      displayDateFormat: 'YYYY-MM-DD',
      displayTimeFormat: 'HH:mm:ss',
      timeWith12hoursFormat: false,
      inView: true,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component', () => {
    render(<DateFilterPlugin {...defaultProps} />);
    expect(screen.getByTestId('datepicker')).toBeInTheDocument();
  });

  it('should handle date range change', () => {
    render(<DateFilterPlugin {...defaultProps} />);
    const datepicker = screen.getByTestId('datepicker');
    fireEvent.change(datepicker, { target: { value: '2023-01-01 : 2023-01-31' } });
    expect(mockSetDataMask).toHaveBeenCalledWith({
      extraFormData: { time_range: '2023-01-01 : 2023-01-31' },
      filterState: { value: '2023-01-01 : 2023-01-31' },
    });
  });

  it('should handle monthly filter', () => {
    render(<DateFilterPlugin {...defaultProps} formData={{ ...defaultProps.formData, monthlyFilter: true }} />);
    const datepicker = screen.getByTestId('datepicker');
    fireEvent.change(datepicker, { target: { value: '2023-01-01 : 2023-01-31' } });
    expect(mockSetDataMask).toHaveBeenCalledWith({
      extraFormData: { time_range: '2023-01-01 : 2023-01-31' },
      filterState: { value: '2023-01-01 : 2023-01-31' },
    });
  });

  it('should handle quarterly filter', () => {
    render(<DateFilterPlugin {...defaultProps} formData={{ ...defaultProps.formData, quarterFilter: true }} />);
    const datepicker = screen.getByTestId('datepicker');
    fireEvent.change(datepicker, { target: { value: '2023-01-01 : 2023-03-31' } });
    expect(mockSetDataMask).toHaveBeenCalledWith({
      extraFormData: { time_range: '2023-01-01 : 2023-03-31' },
      filterState: { value: '2023-01-01 : 2023-03-31' },
    });
  });

  it('should handle yearly filter', () => {
    render(<DateFilterPlugin {...defaultProps} formData={{ ...defaultProps.formData, yearlyFilter: true }} />);
    const datepicker = screen.getByTestId('datepicker');
    fireEvent.change(datepicker, { target: { value: '2023-01-01 : 2023-12-31' } });
    expect(mockSetDataMask).toHaveBeenCalledWith({
      extraFormData: { time_range: '2023-01-01 : 2023-12-31' },
      filterState: { value: '2023-01-01 : 2023-12-31' },
    });
  });

  it('should handle filterState value change', () => {
    const { rerender } = render(<DateFilterPlugin {...defaultProps} />);
    const datepicker = screen.getByTestId('datepicker');
    expect(datepicker).toHaveValue('');

    rerender(<DateFilterPlugin {...defaultProps} filterState={{ value: '2023-01-01 : 2023-01-31' }} />);
    expect(datepicker).toHaveValue('2023-01-01 : 2023-01-31');
  });
});
