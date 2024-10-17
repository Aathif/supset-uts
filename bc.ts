import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CalendarFrame } from './path-to-your-CalendarFrame';
import { CALENDAR_RANGE_OPTIONS, CalendarRangeType, PreviousCalendarWeek } from 'src/explore/components/controls/DateFilterControl/utils';

describe('CalendarFrame Component', () => {
  const defaultProps = {
    value: 'Last week', // This should be a valid CalendarRangeType for the test
    onChange: jest.fn(),
  };

  it('should render the component correctly with valid props', () => {
    render(<CalendarFrame {...defaultProps} />);

    // Verify that the section title is rendered
    expect(screen.getByText('Configure Time Range: Previous...')).toBeInTheDocument();

    // Verify that all radio buttons are rendered with correct labels
    CALENDAR_RANGE_OPTIONS.forEach(({ label }) => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it('should call onChange with PreviousCalendarWeek when an invalid value is provided', () => {
    const customProps = { ...defaultProps, value: 'Invalid value' }; // Using an invalid value
    render(<CalendarFrame {...customProps} />);

    // Verify that onChange is called with PreviousCalendarWeek
    expect(customProps.onChange).toHaveBeenCalledWith(PreviousCalendarWeek);
  });

  it('should not render the component when an invalid value is provided', () => {
    const customProps = { ...defaultProps, value: 'Invalid value' }; // Using an invalid value
    const { container } = render(<CalendarFrame {...customProps} />);

    // The component should not render anything
    expect(container).toBeEmptyDOMElement();
  });

  it('should call onChange when a different option is selected', () => {
    render(<CalendarFrame {...defaultProps} />);

    // Select a different radio button
    const newRange = CALENDAR_RANGE_OPTIONS[1].value; // Choose the second option
    const newRangeRadio = screen.getByLabelText(CALENDAR_RANGE_OPTIONS[1].label);
    fireEvent.click(newRangeRadio);

    // Verify that onChange is called with the selected value
    expect(defaultProps.onChange).toHaveBeenCalledWith(newRange);
  });

  it('should default to PreviousCalendarWeek if an invalid value is initially set', () => {
    const customProps = { ...defaultProps, value: 'Invalid value' }; // Using an invalid value
    render(<CalendarFrame {...customProps} />);

    // Verify that onChange was called with PreviousCalendarWeek
    expect(customProps.onChange).toHaveBeenCalledWith(PreviousCalendarWeek);
  });
});
