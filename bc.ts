import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ThemeProvider, supersetTheme, ChartDataResponseResult, GenericDataType } from '@superset-ui/core';
import ColumnConfigControl from './ColumnConfigControl'; // Adjust the import path as needed
import { ColumnConfig } from './types';
import ControlHeader from '../../../components/ControlHeader';

jest.mock('../../../components/ControlHeader', () => jest.fn(() => <div>Control Header</div>));

const renderWithTheme = (ui, { theme = supersetTheme, ...options } = {}) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>, options);
};

describe('ColumnConfigControl', () => {
  const onChangeMock = jest.fn();

  const defaultProps = {
    onChange: onChangeMock,
    value: { col1: { key: 'value1' } },
    emitFilter: false,
    queryResponse: {
      colnames: ['col1', 'col2'],
      coltypes: [GenericDataType.STRING, GenericDataType.NUMERIC],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    const { container } = renderWithTheme(<ColumnConfigControl {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  test('calls onChange with the correct value when a column config is updated', () => {
    renderWithTheme(<ColumnConfigControl {...defaultProps} />);

    const columnConfigItem = screen.getByText('col1'); // Adjust if necessary to select the right element
    fireEvent.change(columnConfigItem, { target: { value: 'newValue' } });

    expect(onChangeMock).toHaveBeenCalledWith({ col1: 'newValue' });
  });

  test('handles the show all columns functionality correctly', () => {
    const longColnames = Array.from({ length: 20 }, (_, i) => `col${i + 1}`);
    const queryResponse = {
      colnames: longColnames,
      coltypes: longColnames.map(() => GenericDataType.STRING),
    };

    renderWithTheme(
      <ColumnConfigControl {...defaultProps} queryResponse={queryResponse} />
    );

    // Verify initial state (show limited columns)
    expect(screen.queryByText('col11')).not.toBeInTheDocument();

    // Show all columns
    fireEvent.click(screen.getByRole('button', { name: /Show all columns/i }));
    expect(screen.getByText('col11')).toBeInTheDocument();

    // Show less columns
    fireEvent.click(screen.getByRole('button', { name: /Show less columns/i }));
    expect(screen.queryByText('col11')).not.toBeInTheDocument();
  });

  test('renders with emitFilter correctly modifying configFormLayout', () => {
    const configFormLayout = {
      layout: [['someField']],
    };

    renderWithTheme(
      <ColumnConfigControl
        {...defaultProps}
        emitFilter
        configFormLayout={configFormLayout}
      />
    );

    // Verify emitTarget was added
    expect(configFormLayout.layout.some(arr => arr.includes('emitTarget'))).toBe(true);

    renderWithTheme(
      <ColumnConfigControl
        {...defaultProps}
        emitFilter={false}
        configFormLayout={configFormLayout}
      />
    );

    // Verify emitTarget was removed
    expect(configFormLayout.layout.some(arr => arr.includes('emitTarget'))).toBe(false);
  });
});
