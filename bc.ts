import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@superset-ui/core';
import supersetTheme from 'src/style/supersetTheme';
import { AlertReportCronScheduler } from './AlertReportCronScheduler';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={supersetTheme}>{ui}</ThemeProvider>);
};

describe('AlertReportCronScheduler component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renders recurring schedule picker by default', () => {
    renderWithTheme(
      <AlertReportCronScheduler value="0 0 * * *" onChange={mockOnChange} />,
    );

    // Verify that the schedule type select is rendered
    const scheduleTypeSelect = screen.getByLabelText('Schedule type');
    expect(scheduleTypeSelect).toBeInTheDocument();

    // Verify that the CronPicker is rendered (since "Picker" is the default type)
    expect(screen.getByText('Minute')).toBeInTheDocument(); // A CronPicker label
  });

  test('switches to CRON input on schedule type change', () => {
    renderWithTheme(
      <AlertReportCronScheduler value="0 0 * * *" onChange={mockOnChange} />,
    );

    // Change the schedule type to 'CRON Schedule'
    fireEvent.change(screen.getByLabelText('Schedule type'), {
      target: { value: 'input' }, // Simulate selecting CRON schedule
    });

    // Verify that the CRON input field is now rendered
    const cronInput = screen.getByPlaceholderText('CRON expression');
    expect(cronInput).toBeInTheDocument();
  });

  test('calls onChange when a valid CRON expression is entered', () => {
    renderWithTheme(
      <AlertReportCronScheduler value="" onChange={mockOnChange} />,
    );

    // Switch to CRON schedule input
    fireEvent.change(screen.getByLabelText('Schedule type'), {
      target: { value: 'input' },
    });

    // Enter a valid CRON expression
    const cronInput = screen.getByPlaceholderText('CRON expression');
    fireEvent.change(cronInput, { target: { value: '0 0 * * *' } });
    fireEvent.blur(cronInput); // Simulate blur event

    // Ensure the onChange callback is called with the correct value
    expect(mockOnChange).toHaveBeenCalledWith('0 0 * * *');
  });

  test('displays validation error when invalid CRON expression is entered', () => {
    renderWithTheme(
      <AlertReportCronScheduler value="" onChange={mockOnChange} />,
    );

    // Switch to CRON schedule input
    fireEvent.change(screen.getByLabelText('Schedule type'), {
      target: { value: 'input' },
    });

    // Enter an invalid CRON expression
    const cronInput = screen.getByPlaceholderText('CRON expression');
    fireEvent.change(cronInput, { target: { value: 'invalid cron' } });
    fireEvent.blur(cronInput); // Simulate blur event

    // Verify that the error border color is applied to the input
    expect(cronInput).toHaveStyle({ borderColor: supersetTheme.colors.error.base });

    // Ensure onChange is not called with invalid input
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  test('calls onChange with recurring schedule from picker', () => {
    renderWithTheme(
      <AlertReportCronScheduler value="0 0 * * *" onChange={mockOnChange} />,
    );

    // CronPicker is shown by default, enter a new value
    fireEvent.change(screen.getByLabelText('Minute'), {
      target: { value: '15' }, // Simulate selecting a different minute value
    });

    // Ensure onChange is called with updated value
    expect(mockOnChange).toHaveBeenCalledWith('15 0 * * *');
  });
});
