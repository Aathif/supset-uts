import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@superset-ui/core';
import DateFunctionTooltip from './path-to-your-DateFunctionTooltip';
import userEvent from '@testing-library/user-event';

// Mocking Tooltip component
jest.mock('src/components/Tooltip', () => ({
  Tooltip: ({ title, overlayClassName, ...props }: any) => (
    <div role="tooltip" className={overlayClassName} {...props}>
      {title}
    </div>
  ),
}));

describe('DateFunctionTooltip', () => {
  const theme = {
    gridUnit: 4,
    typography: {
      sizes: {
        s: 12,
        m: 16,
      },
      weights: {
        bold: 700,
      },
    },
  };

  const renderWithTheme = (props = {}) => {
    return render(
      <ThemeProvider theme={theme}>
        <DateFunctionTooltip {...props} />
      </ThemeProvider>,
    );
  };

  it('should render the tooltip correctly', () => {
    renderWithTheme();

    // Verify that the tooltip content is rendered correctly
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('should display the correct title content inside the tooltip', () => {
    renderWithTheme();

    // Check for DATETIME section
    expect(screen.getByText('DATETIME')).toBeInTheDocument();
    expect(screen.getByText('Return to specific datetime.')).toBeInTheDocument();
    expect(screen.getByText('Syntax')).toBeInTheDocument();
    expect(screen.getByText('Example')).toBeInTheDocument();

    // Check for dateadd examples
    expect(screen.getByText(/dateadd\(datetime\("today"\), -13, day\)/)).toBeInTheDocument();
    expect(screen.getByText(/dateadd\(datetime\("2020-03-01"\), 2, day\)/)).toBeInTheDocument();

    // Check for LASTDAY examples
    expect(screen.getByText(/lastday\(datetime\("today"\), month\)/)).toBeInTheDocument();

    // Check for HOLIDAY examples
    expect(screen.getByText(/holiday\("christmas", datetime\("2019"\)\)/)).toBeInTheDocument();
  });

  it('should apply the correct styles based on the theme', () => {
    renderWithTheme();

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveClass(expect.stringContaining('ant-tooltip-content'));

    // Check for max-height and other theme-related styles
    expect(tooltip).toHaveStyle({
      minWidth: `${theme.gridUnit * 125}px`,
      maxHeight: '410px',
    });

    // Check for typography-related styles inside the tooltip
    const headers = screen.getAllByText('Syntax');
    headers.forEach(header => {
      expect(header).toHaveStyle({
        fontSize: `${theme.typography.sizes.m}px`,
        fontWeight: `${theme.typography.weights.bold}`,
      });
    });
  });

  it('should show the tooltip content when hovering over the component', async () => {
    const user = userEvent.setup();
    renderWithTheme();

    // Simulate hover to trigger tooltip
    const tooltipTrigger = screen.getByRole('tooltip');
    await user.hover(tooltipTrigger);

    // Verify that tooltip content is shown
    expect(screen.getByText('DATETIME')).toBeInTheDocument();
  });
});
