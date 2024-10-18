import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@superset-ui/core';
import supersetTheme from 'src/style/supersetTheme';
import AlertStatusIcon from './AlertStatusIcon';
import { AlertState } from '../types';
import Icons from 'src/components/Icons';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={supersetTheme}>{ui}</ThemeProvider>);
};

describe('AlertStatusIcon component', () => {
  test('renders "Report sent" when state is Success and report is enabled', () => {
    renderWithTheme(
      <AlertStatusIcon state={AlertState.Success} isReportEnabled={true} />
    );

    const tooltip = screen.getByText('Report sent');
    expect(tooltip).toBeInTheDocument();
    const checkIcon = screen.getByTestId('icon-check'); // Assuming Icons.Check has a data-testid
    expect(checkIcon).toBeInTheDocument();
  });

  test('renders "Alert triggered, notification sent" when state is Success and report is not enabled', () => {
    renderWithTheme(
      <AlertStatusIcon state={AlertState.Success} isReportEnabled={false} />
    );

    const tooltip = screen.getByText('Alert triggered, notification sent');
    expect(tooltip).toBeInTheDocument();
    const alertIcon = screen.getByTestId('icon-alert-solid-small'); // Assuming Icons.AlertSolidSmall has a data-testid
    expect(alertIcon).toBeInTheDocument();
  });

  test('renders "Report sending" when state is Working and report is enabled', () => {
    renderWithTheme(
      <AlertStatusIcon state={AlertState.Working} isReportEnabled={true} />
    );

    const tooltip = screen.getByText('Report sending');
    expect(tooltip).toBeInTheDocument();
    const runningIcon = screen.getByTestId('icon-running'); // Assuming Icons.Running has a data-testid
    expect(runningIcon).toBeInTheDocument();
  });

  test('renders "Alert running" when state is Working and report is not enabled', () => {
    renderWithTheme(
      <AlertStatusIcon state={AlertState.Working} isReportEnabled={false} />
    );

    const tooltip = screen.getByText('Alert running');
    expect(tooltip).toBeInTheDocument();
    const runningIcon = screen.getByTestId('icon-running'); // Assuming Icons.Running has a data-testid
    expect(runningIcon).toBeInTheDocument();
  });

  test('renders "Report failed" when state is Error and report is enabled', () => {
    renderWithTheme(
      <AlertStatusIcon state={AlertState.Error} isReportEnabled={true} />
    );

    const tooltip = screen.getByText('Report failed');
    expect(tooltip).toBeInTheDocument();
    const errorIcon = screen.getByTestId('icon-x-small'); // Assuming Icons.XSmall has a data-testid
    expect(errorIcon).toBeInTheDocument();
  });

  test('renders "Alert failed" when state is Error and report is not enabled', () => {
    renderWithTheme(
      <AlertStatusIcon state={AlertState.Error} isReportEnabled={false} />
    );

    const tooltip = screen.getByText('Alert failed');
    expect(tooltip).toBeInTheDocument();
    const errorIcon = screen.getByTestId('icon-x-small'); // Assuming Icons.XSmall has a data-testid
    expect(errorIcon).toBeInTheDocument();
  });

  test('renders "Nothing triggered" when state is Noop', () => {
    renderWithTheme(<AlertStatusIcon state={AlertState.Noop} isReportEnabled={false} />);

    const tooltip = screen.getByText('Nothing triggered');
    expect(tooltip).toBeInTheDocument();
    const checkIcon = screen.getByTestId('icon-check'); // Assuming Icons.Check has a data-testid
    expect(checkIcon).toBeInTheDocument();
  });

  test('renders "Alert Triggered, In Grace Period" when state is Grace', () => {
    renderWithTheme(<AlertStatusIcon state={AlertState.Grace} isReportEnabled={false} />);

    const tooltip = screen.getByText('Alert Triggered, In Grace Period');
    expect(tooltip).toBeInTheDocument();
    const alertIcon = screen.getByTestId('icon-alert-solid-small'); // Assuming Icons.AlertSolidSmall has a data-testid
    expect(alertIcon).toBeInTheDocument();
  });
});
