import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { TableRenderer } from './TableRenderer';
import { PivotData } from './utilities';

// Mock the t function for translations
jest.mock('@superset-ui/core', () => ({
  t: (str) => str,
}));

// Mock PivotData
jest.mock('./utilities', () => ({
  PivotData: jest.fn().mockImplementation(() => ({
    getRowKeys: jest.fn(() => []),
    getColKeys: jest.fn(() => []),
    getAggregator: jest.fn(() => ({
      value: jest.fn(() => 42),
      format: jest.fn((value) => `${value}`),
    })),
  })),
  flatKey: jest.fn((key) => key.join('-')),
}));

describe('TableRenderer', () => {
  const defaultProps = {
    rows: ['row1', 'row2'],
    cols: ['col1', 'col2'],
    tableOptions: {},
    subtotalOptions: {},
    namesMapping: {},
    aggregatorName: 'sum',
    onContextMenu: jest.fn(),
  };

  it('renders without crashing', () => {
    render(<TableRenderer {...defaultProps} />);
    expect(screen.getByText('row1')).toBeInTheDocument();
  });

  it('renders correct number of row and column headers', () => {
    const rowKeys = [['A'], ['B']];
    const colKeys = [['X'], ['Y']];

    PivotData.mockImplementationOnce(() => ({
      getRowKeys: jest.fn(() => rowKeys),
      getColKeys: jest.fn(() => colKeys),
      getAggregator: jest.fn(() => ({
        value: jest.fn(() => 42),
        format: jest.fn((value) => `${value}`),
      })),
    }));

    render(<TableRenderer {...defaultProps} />);

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('Y')).toBeInTheDocument();
  });

  it('triggers clickHeaderHandler when a column header is clicked', () => {
    const clickColumnHeaderCallback = jest.fn();
    render(
      <TableRenderer
        {...defaultProps}
        tableOptions={{ clickColumnHeaderCallback }}
      />
    );

    const colHeader = screen.getByText('col1');
    fireEvent.click(colHeader);
    expect(clickColumnHeaderCallback).toHaveBeenCalled();
  });

  it('toggles row and column expansion on click', () => {
    const rowKeys = [['A'], ['B']];
    const colKeys = [['X'], ['Y']];

    PivotData.mockImplementationOnce(() => ({
      getRowKeys: jest.fn(() => rowKeys),
      getColKeys: jest.fn(() => colKeys),
      getAggregator: jest.fn(() => ({
        value: jest.fn(() => 42),
        format: jest.fn((value) => `${value}`),
      })),
    }));

    const { rerender } = render(<TableRenderer {...defaultProps} />);

    const rowHeader = screen.getByText('A');
    fireEvent.click(rowHeader);
    expect(rowHeader).toHaveClass('pvtRowLabel');

    rerender(<TableRenderer {...defaultProps} />);
    const colHeader = screen.getByText('X');
    fireEvent.click(colHeader);
    expect(colHeader).toHaveClass('pvtColLabel');
  });

  it('renders Subtotal when rows or columns have subtotals enabled', () => {
    render(
      <TableRenderer
        {...defaultProps}
        subtotalOptions={{ rowSubtotals: true, colSubtotals: true }}
      />
    );

    expect(screen.getAllByText('Subtotal')).toHaveLength(2);
  });

  it('handles table click callback correctly', () => {
    const clickCallback = jest.fn();
    const rowKeys = [['A'], ['B']];
    const colKeys = [['X'], ['Y']];

    PivotData.mockImplementationOnce(() => ({
      getRowKeys: jest.fn(() => rowKeys),
      getColKeys: jest.fn(() => colKeys),
      getAggregator: jest.fn(() => ({
        value: jest.fn(() => 42),
        format: jest.fn((value) => `${value}`),
      })),
    }));

    render(
      <TableRenderer
        {...defaultProps}
        tableOptions={{ clickCallback }}
      />
    );

    const cell = screen.getAllByRole('gridcell')[0];
    fireEvent.click(cell);
    expect(clickCallback).toHaveBeenCalledWith(expect.anything(), 42, expect.anything(), expect.anything());
  });
});
