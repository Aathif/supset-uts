import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { t } from '@superset-ui/core';
import { CommonFrame } from './path-to-your-CommonFrame';
import { COMMON_RANGE_OPTIONS, DateFilterTestKey } from 'src/explore/components/controls/DateFilterControl/utils';

describe('CommonFrame Component', () => {
  const defaultProps = {
    value: 'Last week',
    onChange: jest.fn(),
  };

  it('should render the component correctly', () => {
    render(<CommonFrame {...defaultProps} />);

    // Verify that the section title is rendered
    expect(screen.getByTestId(DateFilterTestKey.CommonFrame)).toHaveTextContent(
      t('Configure Time Range: Last...')
    );

    // Verify that all radio buttons are rendered with correct labels
    COMMON_RANGE_OPTIONS.forEach(({ label }) => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it('should select the correct default value based on props', () => {
    const customProps = { ...defaultProps, value: 'Last 30 days' };
    render(<CommonFrame {...customProps} />);

    // Verify that the radio button corresponding to 'Last 30 days' is checked
    const selectedRadio = screen.getByLabelText('Last 30 days');
    expect(selectedRadio).toBeChecked();
  });

  it('should call onChange when a different option is selected', () => {
    render(<CommonFrame {...defaultProps} />);

    // Select a different radio button
    const lastMonthRadio = screen.getByLabelText('Last month');
    fireEvent.click(lastMonthRadio);

    // Verify that onChange is called with the correct value
    expect(defaultProps.onChange).toHaveBeenCalledWith('Last month');
  });

  it('should default to "Last week" if an invalid value is provided', () => {
    const customProps = { ...defaultProps, value: 'Invalid value' };
    render(<CommonFrame {...customProps} />);

    // Verify that "Last week" is selected by default
    const lastWeekRadio = screen.getByLabelText('Last week');
    expect(lastWeekRadio).toBeChecked();

    // Verify that onChange was called to reset the value to 'Last week'
    expect(customProps.onChange).toHaveBeenCalledWith('Last week');
  });
});
