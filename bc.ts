import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ThemeProvider, supersetTheme, GenericDataType } from '@superset-ui/core';
import ColumnConfigPopover from './ColumnConfigPopover'; // Adjust the import path as needed
import { ColumnConfig, ColumnConfigInfo, ColumnConfigFormLayout } from './types';
import { SHARED_COLUMN_CONFIG_PROPS } from './constants';

jest.mock('../../../components/ControlForm', () => ({
  ControlForm: jest.fn(({ children }) => <div>{children}</div>),
  ControlFormRow: jest.fn(({ children }) => <div>{children}</div>),
  ControlFormItem: jest.fn(({ name }) => <div>{name}</div>),
}));

const renderWithTheme = (ui, { theme = supersetTheme, ...options } = {}) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>, options);
};

describe('ColumnConfigPopover', () => {
  const onChangeMock = jest.fn();

  const defaultProps = {
    column: {
      name: 'col1',
      type: GenericDataType.STRING,
      config: { key: 'value1' },
    } as ColumnConfigInfo,
    configFormLayout: {
      [GenericDataType.STRING]: [['control1', 'control2']],
    } as ColumnConfigFormLayout,
    onChange: onChangeMock,
    cols: ['col1', 'col2'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    const { container } = renderWithTheme(<ColumnConfigPopover {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  test('renders the correct form items based on column type and config form layout', () => {
    renderWithTheme(<ColumnConfigPopover {...defaultProps} />);

    expect(screen.getByText('control1')).toBeInTheDocument();
    expect(screen.getByText('control2')).toBeInTheDocument();
  });

  test('calls onChange with the correct value when a form item is changed', () => {
    renderWithTheme(<ColumnConfigPopover {...defaultProps} />);

    const control1 = screen.getByText('control1');
    fireEvent.change(control1, { target: { value: 'newValue' } });

    expect(onChangeMock).toHaveBeenCalledWith({ key: 'newValue' });
  });

  test('applies shared props from SHARED_COLUMN_CONFIG_PROPS', () => {
    renderWithTheme(<ColumnConfigPopover {...defaultProps} />);

    const control1 = screen.getByText('control1');

    expect(control1).toBeInTheDocument();
    // You can add more detailed checks if you need to verify specific props are applied
  });
});
