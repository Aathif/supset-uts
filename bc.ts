import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HeaderWithRadioGroup, { HeaderWithRadioGroupProps } from './HeaderWithRadioGroup';
import { ThemeProvider } from '@superset-ui/core';
import { supersetTheme } from 'src/themes';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={supersetTheme}>{ui}</ThemeProvider>);
};

describe('HeaderWithRadioGroup', () => {
  const defaultProps: HeaderWithRadioGroupProps = {
    headerTitle: 'Test Header',
    groupTitle: 'Test Group',
    groupOptions: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ],
    value: 'option1',
    onChange: jest.fn(),
  };

  it('renders the header title correctly', () => {
    renderWithTheme(<HeaderWithRadioGroup {...defaultProps} />);
    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  it('opens the popover and renders the radio group options', () => {
    renderWithTheme(<HeaderWithRadioGroup {...defaultProps} />);

    // Click the settings icon to open the popover
    fireEvent.click(screen.getByRole('img', { name: 'setting' }));

    // Check if the popover contains the group title and radio options
    expect(screen.getByText('Test Group')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('calls the onChange handler when a radio option is selected', () => {
    const onChangeMock = jest.fn();
    renderWithTheme(<HeaderWithRadioGroup {...defaultProps} onChange={onChangeMock} />);

    // Open the popover
    fireEvent.click(screen.getByRole('img', { name: 'setting' }));

    // Select "Option 2"
    fireEvent.click(screen.getByLabelText('Option 2'));

    // Ensure the onChange handler is called with the correct value
    expect(onChangeMock).toHaveBeenCalledWith('option2');
  });

  it('closes the popover after a selection', () => {
    renderWithTheme(<HeaderWithRadioGroup {...defaultProps} />);

    // Open the popover
    fireEvent.click(screen.getByRole('img', { name: 'setting' }));

    // Select "Option 2"
    fireEvent.click(screen.getByLabelText('Option 2'));

    // Ensure the popover is no longer visible
    expect(screen.queryByText('Test Group')).not.toBeInTheDocument();
  });
});
