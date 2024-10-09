import React from 'react';
import { render, screen } from '@testing-library/react';
import $ from 'jquery';
import PivotTable from './PivotTable'; // Adjust the import based on your file structure

jest.mock('datatables.net-bs', () => jest.fn());
jest.mock('@superset-ui/core', () => ({
  getTimeFormatter: jest.fn(() => jest.fn((date) => date)),
  getTimeFormatterForGranularity: jest.fn(() => jest.fn((date) => date)),
  smartDateFormatter: { id: 'smart_date' },
}));

// Mock the utils
jest.mock('./utils/formatCells', () => ({
  formatCellValue: jest.fn((index, cols, textContent) => ({
    textContent,
    sortAttributeValue: textContent,
  })),
  formatDateCellValue: jest.fn((text, verboseMap, dateRegex, dateFormatter) => text),
}));

jest.mock('./utils/fixTableHeight', () => jest.fn());

describe('PivotTable Component', () => {
  const mockData = {
    html: '<table><thead><tr><th>Header 1</th><th>Header 2</th></tr></thead><tbody><tr><td>Value 1</td><td>Value 2</td></tr></tbody></table>',
    columns: ['Header 1', 'Header 2'],
  };

  const props = {
    data: mockData,
    height: 400,
    columnFormats: {},
    numberFormat: '',
    numGroups: 1,
    verboseMap: {},
    customizeBgCondition: [],
    granularity: 'day',
    dateFormat: '',
    cellBgColor: 'yellow',
    pageLength: 5,
    includeSearch: true,
    groupby: [],
    columns: ['Header 1', 'Header 2'],
    colsToHide: [],
    orderByCols: [],
  };

  beforeEach(() => {
    document.body.innerHTML = '<div id="pivot-table-container"></div>';
  });

  test('renders without crashing', () => {
    render(<PivotTable {...props} element={document.getElementById('pivot-table-container')} />);
    expect(screen.getByText('Header 1')).toBeInTheDocument();
    expect(screen.getByText('Value 1')).toBeInTheDocument();
  });

  test('formats cells correctly', () => {
    render(<PivotTable {...props} element={document.getElementById('pivot-table-container')} />);
    expect(screen.getByText('Value 1')).toHaveAttribute('data-sort', 'Value 1');
  });

  test('sets container height and overflow for multiple groups', () => {
    render(<PivotTable {...props} element={document.getElementById('pivot-table-container')} />);
    const container = document.getElementById('pivot-table-container');
    expect(container.style.overflow).toBe('auto');
    expect(container.style.height).toBe('410px'); // height + 10
  });

  test('applies custom background color based on conditions', () => {
    const customProps = {
      ...props,
      customizeBgCondition: [
        { operator: '==', comparator: 'Value 1', subject: 'Header 1' },
      ],
    };
    render(<PivotTable {...customProps} element={document.getElementById('pivot-table-container')} />);
    const cell = screen.getByText('Value 1');
    expect(cell).toHaveStyle('background-color:yellow');
  });

  test('initializes DataTable with correct options for single group', () => {
    render(<PivotTable {...props} element={document.getElementById('pivot-table-container')} />);
    expect($.fn.DataTable).toHaveBeenCalledWith(expect.objectContaining({
      paging: props.pageLength,
      searching: props.includeSearch,
      scrollY: '400px',
      scrollCollapse: true,
      scrollX: true,
      bSort: true,
    }));
  });
});
