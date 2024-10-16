import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import DataTable from './path-to-DataTable'; // Update with the actual path
import { useTable } from 'react-table';
import copyTextToClipboard from '../../../../../../utils/copy';

jest.mock('react-table', () => ({
  useTable: jest.fn(),
  usePagination: jest.fn(),
  useSortBy: jest.fn(),
  useGlobalFilter: jest.fn(),
}));

jest.mock('../../../../../../utils/copy', () => jest.fn());

describe('DataTable Component', () => {
  const columns = [
    {
      Header: 'Column 1',
      accessor: 'col1',
    },
    {
      Header: 'Column 2',
      accessor: 'col2',
    },
  ];

  const data = [
    { col1: 'Row 1 Data 1', col2: 'Row 1 Data 2' },
    { col1: 'Row 2 Data 1', col2: 'Row 2 Data 2' },
  ];

  const serverPaginationData = { pageSize: 10, currentPage: 0 };

  const defaultProps = {
    columns,
    data,
    serverPaginationData,
    pageSize: 10,
    rowCount: 2,
    onServerPaginationChange: jest.fn(),
    onChangeFilter: jest.fn(),
    sliceId: 123,
  };

  beforeEach(() => {
    useTable.mockReturnValue({
      getTableProps: jest.fn(() => ({})),
      getTableBodyProps: jest.fn(() => ({})),
      prepareRow: jest.fn(),
      headerGroups: [
        {
          headers: [
            { id: 'col1', render: jest.fn(() => 'Column 1 Header'), getSortByToggleProps: jest.fn() },
            { id: 'col2', render: jest.fn(() => 'Column 2 Header'), getSortByToggleProps: jest.fn() },
          ],
          getHeaderGroupProps: jest.fn(() => ({})),
        },
      ],
      page: [
        {
          cells: [
            { value: 'Row 1 Data 1', render: jest.fn(() => 'Row 1 Data 1'), getCellProps: jest.fn() },
            { value: 'Row 1 Data 2', render: jest.fn(() => 'Row 1 Data 2'), getCellProps: jest.fn() },
          ],
          getRowProps: jest.fn(() => ({})),
        },
        {
          cells: [
            { value: 'Row 2 Data 1', render: jest.fn(() => 'Row 2 Data 1'), getCellProps: jest.fn() },
            { value: 'Row 2 Data 2', render: jest.fn(() => 'Row 2 Data 2'), getCellProps: jest.fn() },
          ],
          getRowProps: jest.fn(() => ({})),
        },
      ],
      state: { pageIndex: 0, pageSize: 10, globalFilter: '' },
      setGlobalFilter: jest.fn(),
      setPageSize: jest.fn(),
      gotoPage: jest.fn(),
      pageCount: 1,
      preGlobalFilteredRows: [],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the DataTable component with headers and rows', () => {
    render(<DataTable {...defaultProps} />);

    // Check that table headers are rendered
    expect(screen.getByText('Column 1 Header')).toBeInTheDocument();
    expect(screen.getByText('Column 2 Header')).toBeInTheDocument();

    // Check that table rows are rendered
    expect(screen.getByText('Row 1 Data 1')).toBeInTheDocument();
    expect(screen.getByText('Row 1 Data 2')).toBeInTheDocument();
    expect(screen.getByText('Row 2 Data 1')).toBeInTheDocument();
    expect(screen.getByText('Row 2 Data 2')).toBeInTheDocument();
  });

  it('should call the onServerPaginationChange when changing page size', () => {
    render(<DataTable {...defaultProps} />);

    // Simulate page size change
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '20' } });

    // Expect onServerPaginationChange to be called
    expect(defaultProps.onServerPaginationChange).toHaveBeenCalledWith(0, 20, '');
  });

  it('should display "No data found" when no results are available', () => {
    const props = { ...defaultProps, data: [], rowCount: 0 };
    render(<DataTable {...props} />);

    // Check for "No data found" message
    expect(screen.getByText('No data found')).toBeInTheDocument();
  });

  it('should copy cell value to clipboard on right-click', () => {
    render(<DataTable {...defaultProps} />);

    // Simulate right-click (context menu) on a cell
    const cell = screen.getByText('Row 1 Data 1');
    fireEvent.contextMenu(cell);

    // Trigger "Copy to clipboard" from context menu
    const copyMenuItem = screen.getByText('Copy to clipboard');
    fireEvent.click(copyMenuItem);

    // Ensure copy function is called with the stripped value of the cell
    expect(copyTextToClipboard).toHaveBeenCalledWith(expect.any(Function));
  });
});
