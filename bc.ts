import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NotificationMethod } from './NotificationMethod';
import { NotificationSetting } from '../types';
import { ThemeProvider } from '@superset-ui/core';
import supersetTheme from 'src/style/supersetTheme';

const mockUpdate = jest.fn();
const mockRemove = jest.fn();

const notificationSetting: NotificationSetting = {
  method: 'Email',
  recipients: 'example@domain.com',
  options: ['Email', 'Slack'],
};

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={supersetTheme}>{ui}</ThemeProvider>);
};

describe('NotificationMethod component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders NotificationMethod correctly', () => {
    renderWithTheme(
      <NotificationMethod
        setting={notificationSetting}
        index={0}
        onUpdate={mockUpdate}
        onRemove={mockRemove}
      />
    );

    expect(screen.getByText('Notification Method')).toBeInTheDocument();
    expect(screen.getByText('Email recipients')).toBeInTheDocument();
    expect(screen.getByTestId('recipients')).toHaveValue(
      'example@domain.com',
    );
  });

  test('calls onUpdate when method is changed', () => {
    renderWithTheme(
      <NotificationMethod
        setting={notificationSetting}
        index={0}
        onUpdate={mockUpdate}
        onRemove={mockRemove}
      />
    );

    const selectMethod = screen.getByPlaceholderText('Select Delivery Method');
    fireEvent.change(selectMethod, { target: { value: 'Slack' } });

    expect(mockUpdate).toHaveBeenCalledWith(0, {
      ...notificationSetting,
      method: 'Slack',
      recipients: '',
    });
  });

  test('calls onUpdate when recipients are changed', () => {
    renderWithTheme(
      <NotificationMethod
        setting={notificationSetting}
        index={0}
        onUpdate={mockUpdate}
        onRemove={mockRemove}
      />
    );

    const recipientInput = screen.getByTestId('recipients');
    fireEvent.change(recipientInput, { target: { value: 'test@domain.com' } });

    expect(mockUpdate).toHaveBeenCalledWith(0, {
      ...notificationSetting,
      recipients: 'test@domain.com',
    });
  });

  test('calls onRemove when remove button is clicked', () => {
    renderWithTheme(
      <NotificationMethod
        setting={notificationSetting}
        index={1}
        onUpdate={mockUpdate}
        onRemove={mockRemove}
      />
    );

    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);

    expect(mockRemove).toHaveBeenCalledWith(1);
  });

  test('does not render delete button for the first index', () => {
    renderWithTheme(
      <NotificationMethod
        setting={notificationSetting}
        index={0}
        onUpdate={mockUpdate}
        onRemove={mockRemove}
      />
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
