import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateLabel } from './path-to-your-DateLabel';
import { ThemeProvider } from '@superset-ui/core'; // Import your theme provider

// Mock necessary components
jest.mock('src/components/Icons', () => ({
  CalendarOutlined: ({ iconSize, iconColor }: any) => (
    <span role="img" style={{ fontSize: iconSize, color: iconColor }}>
      🗓
    </span>
  ),
}));

describe('DateLabel', () => {
  const theme = {
    gridUnit: 4,
    colors: {
      grayscale: {
        light1: '#ccc',
        light2: '#ddd',
        light5: '#eee',
        dark1: '#000',
        base: '#333',
      },
    },
    borderRadius: 4,
  };

  const setup = (props: any) => {
    return render(
      <ThemeProvider theme={theme}>
        <DateLabel {...props} />
      </ThemeProvider>,
    );
  };

  it('should render with the correct label and calendar icon', () => {
    setup({ label: 'Date Label', isActive: false, isPlaceholder: false });

    // Check for the label text
    expect(screen.getByText('Date Label')).toBeInTheDocument();

    // Check for the calendar icon
    const calendarIcon = screen.getByRole('img');
    expect(calendarIcon).toBeInTheDocument();
    expect(calendarIcon).toHaveStyle({ fontSize: 's', color: theme.colors.grayscale.base });
  });

  it('should apply the active border color when "isActive" is true', () => {
    const { container } = setup({ label: 'Active Label', isActive: true });

    // Verify the active border color
    expect(container.firstChild).toHaveStyle(`border-color: ${'#45BED6'}`);
  });

  it('should render as a placeholder with a lighter text color when "isPlaceholder" is true', () => {
    const { container } = setup({ label: 'Placeholder Label', isPlaceholder: true });

    // Verify the placeholder text color
    const labelContent = container.querySelector('.date-label-content');
    expect(labelContent).toHaveStyle(`color: ${theme.colors.grayscale.light1}`);
  });

  it('should call the "onClick" handler when clicked', () => {
    const onClickMock = jest.fn();
    setup({ label: 'Clickable Label', onClick: onClickMock });

    // Simulate a click event
    fireEvent.click(screen.getByText('Clickable Label'));

    // Verify the onClick handler is called
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('should render with a translated string when the label is a string', () => {
    setup({ label: 'Date Label', isActive: false, isPlaceholder: false });

    // Check for the translated label text (assuming t function is mocked)
    expect(screen.getByText('Date Label')).toBeInTheDocument();
  });
});

