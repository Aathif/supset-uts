// TableRenderer.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TableRenderer } from './TableRenderer'; // Adjust import path as necessary
import '@testing-library/jest-dom/extend-expect'; // For extra matchers

// Mock data for testing
const mockProps = {
  cols: ['col1', 'col2'],
  rows: ['row1', 'row2'],
  tableOptions: {
    clickCallback: jest.fn(),
    clickRowHeaderCallback: jest.fn(),
    clickColumnHeaderCallback: jest.fn(),
  },
  subtotalOptions: {
    arrowCollapsed: '▲',
    arrowExpanded: '▼',
    colSubtotalDisplay: { enabled: true },
    rowSubtotalDisplay: { enabled: true },
  },
  namesMapping: { col1: 'Column 1', col2: 'Column 2', row1: 'Row 1', row2: 'Row 2' },
  aggregatorName: 'Sum',
};

describe('TableRenderer', () => {
  test('renders correctly with given props', () => {
    render(<TableRenderer {...mockProps} />);

    // Check if column headers are rendered correctly
    expect(screen.getByText('Column 1')).toBeInTheDocument();
    expect(screen.getByText('Column 2')).toBeInTheDocument();
    expect(screen.getByText('Row 1')).toBeInTheDocument();
    expect(screen.getByText('Row 2')).toBeInTheDocument();

    // Check if total label is rendered
    expect(screen.getByText(/Total \(Sum\)/)).toBeInTheDocument();
  });

  test('calls clickCallback on cell click', () => {
    render(<TableRenderer {...mockProps} />);

    // Trigger a click event on a cell
    fireEvent.click(screen.getByText('Row 1'));

    // Assert clickCallback has been called
    expect(mockProps.tableOptions.clickCallback).toHaveBeenCalled();
  });

  test('collapses and expands rows/columns correctly', () => {
    render(<TableRenderer {...mockProps} />);

    // Find and click the collapse button
    const collapseButton = screen.getByText('▲');
    fireEvent.click(collapseButton);

    // You can add more assertions here depending on the implementation
    // For example, you can check if the rows or columns are actually collapsed
  });

  test('handles context menu event', () => {
    render(<TableRenderer {...mockProps} />);

    // Trigger a context menu event on a cell
    fireEvent.contextMenu(screen.getByText('Row 1'));

    // Assert that the context menu callback is called
    // Example assertion, replace with actual logic
    // expect(mockProps.onContextMenu).toHaveBeenCalled();
  });
});
