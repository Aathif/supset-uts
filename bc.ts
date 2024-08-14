import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import moment from 'moment';
import DateFilterPlugin from './DateFilterPlugin';
import { RangePicker } from 'src/components/DatePicker';

jest.mock('src/components/DatePicker', () => ({
  RangePicker: jest.fn(({ onChange }) => (
    <input
      data-testid="range-picker"
      onChange={e => onChange(e.target.value, [moment(), moment().add(1, 'day')])}
    />
  )),
}));

describe('DateFilterPlugin', () => {
  const defaultProps = {
    setDataMask: jest.fn(),
    width: 400,
    height: 300,
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

  it('renders without crashing', () => {
    render(<DateFilterPlugin {...defaultProps} />);
    expect(screen.getByTestId('range-picker')).toBeInTheDocument();
  });

  it('handles date range change and updates data mask correctly', () => {
    render(<DateFilterPlugin {...defaultProps} />);

    fireEvent.change(screen.getByTestId('range-picker'), {
      target: { value: '2024-01-01 : 2024-12-31' },
    });

    expect(defaultProps.setDataMask).toHaveBeenCalledWith({
      extraFormData: {
        time_range: '2024-01-01 : 2024-12-31',
      },
      filterState: {
        value: '2024-01-01 : 2024-12-31',
      },
    });
  });

  it('applies monthly filter correctly', () => {
    const modifiedProps = {
      ...defaultProps,
      formData: {
        ...defaultProps.formData,
        monthlyFilter: true,
      },
    };

    render(<DateFilterPlugin {...modifiedProps} />);

    fireEvent.change(screen.getByTestId('range-picker'), {
      target: { value: '2024-01-01 : 2024-12-31' },
    });

    const expectedMinDate = moment('2024-01-01').startOf('month').format('YYYY-MM-DD');
    const expectedMaxDate = moment('2024-12-31').endOf('month').format('YYYY-MM-DD');

    expect(defaultProps.setDataMask).toHaveBeenCalledWith({
      extraFormData: {
        time_range: `${expectedMinDate} : ${expectedMaxDate}`,
      },
      filterState: {
        value: `${expectedMinDate} : ${expectedMaxDate}`,
      },
    });
  });

  it('applies quarterly filter correctly', () => {
    const modifiedProps = {
      ...defaultProps,
      formData: {
        ...defaultProps.formData,
        quarterFilter: true,
      },
    };

    render(<DateFilterPlugin {...modifiedProps} />);

    fireEvent.change(screen.getByTestId('range-picker'), {
      target: { value: '2024-01-01 : 2024-12-31' },
    });

    const expectedMinDate = moment('2024-01-01').startOf('quarter').format('YYYY-MM-DD');
    const expectedMaxDate = moment('2024-12-31').endOf('quarter').format('YYYY-MM-DD');

    expect(defaultProps.setDataMask).toHaveBeenCalledWith({
      extraFormData: {
        time_range: `${expectedMinDate} : ${expectedMaxDate}`,
      },
      filterState: {
        value: `${expectedMinDate} : ${expectedMaxDate}`,
      },
    });
  });

  it('applies yearly filter correctly', () => {
    const modifiedProps = {
      ...defaultProps,
      formData: {
        ...defaultProps.formData,
        yearlyFilter: true,
      },
    };

    render(<DateFilterPlugin {...modifiedProps} />);

    fireEvent.change(screen.getByTestId('range-picker'), {
      target: { value: '2024-01-01 : 2024-12-31' },
    });

    const expectedMinDate = '2024-01-01';
    const expectedMaxDate = '2024-12-31';

    expect(defaultProps.setDataMask).toHaveBeenCalledWith({
      extraFormData: {
        time_range: `${expectedMinDate} : ${expectedMaxDate}`,
      },
      filterState: {
        value: `${expectedMinDate} : ${expectedMaxDate}`,
      },
    });
  });

  it('handles empty time range correctly', () => {
    render(<DateFilterPlugin {...defaultProps} />);

    fireEvent.change(screen.getByTestId('range-picker'), {
      target: { value: '' },
    });

    expect(defaultProps.setDataMask).toHaveBeenCalledWith({
      extraFormData: {},
      filterState: {
        value: undefined,
      },
    });
  });
});
