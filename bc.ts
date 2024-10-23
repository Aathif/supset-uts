import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { t } from '@superset-ui/core';
import { SingleQueryResultPane } from './SingleQueryResultPane';
import { TableControls } from './DataTableControls';
import TableView from 'src/components/TableView';
import {
  useFilteredTableData,
  useTableColumns,
} from 'src/explore/components/DataTableControl';

// Mock dependencies
jest.mock('@superset-ui/core', () => ({
  ...jest.requireActual('@superset-ui/core'),
  t: jest.fn((str) => str),
}));

jest.mock('src/components/TableView', () =>
  jest.fn(() => <div>TableView</div>),
);

jest.mock('src/explore/components/DataTableControl', () => ({
  useFilteredTableData: jest.fn(),
  useTableColumns: jest.fn(),
}));

jest.mock('./DataTableControls', () => ({
  TableControls: jest.fn(() => <div>TableControls</div>),
}));

describe('SingleQueryResultPane', () => {
  const defaultProps = {
    data: [
      { col1: 'John', col2: 35 },
      { col1: 'Jane', col2: 28 },
    ],
    colnames: ['col1', 'col2'],
    coltypes: ['string', 'int'],
    rowcount: 2,
    datasourceId: '1234',
    dataSize: 50,
    isVisible: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders TableControls and TableView with the correct data', () => {
    // Mock filtered data to be the same as original data
    useFilteredTableData.mockReturnValue(defaultProps.data);
    useTableColumns.mockReturnValue([
      { Header: 'col1', accessor: 'col1' },
      { Header: 'col2', accessor: 'col2' },
    ]);

    render(<SingleQueryResultPane {...defaultProps} />);

    // Check that TableControls was rendered
    expect(TableControls).toHaveBeenCalledWith(
      expect.objectContaining({
        data: defaultProps.data,
        columnNames: defaultProps.colnames,
        columnTypes: defaultProps.coltypes,
        rowcount: defaultProps.rowcount,
        datasourceId: defaultProps.datasourceId,
        isLoading: false,
      }),
      {},
    );

    // Check that TableView was rendered
    expect(TableView).toHaveBeenCalledWith(
      expect.objectContaining({
        columns: [
          { Header: 'col1', accessor: 'col1' },
          { Header: 'col2', accessor: 'col2' },
        ],
        data: defaultProps.data,
        pageSize: defaultProps.dataSize,
        noDataText: t('No results'),
      }),
      {},
    );
  });

  it('handles filter input change', () => {
    const mockSetFilterText = jest.fn();
    React.useState = jest.fn(() => ['', mockSetFilterText]);

    useFilteredTableData.mockReturnValue(defaultProps.data);
    useTableColumns.mockReturnValue([
      { Header: 'col1', accessor: 'col1' },
      { Header: 'col2', accessor: 'col2' },
    ]);

    render(<SingleQueryResultPane {...defaultProps} />);

    // Simulate filter input change
    const filterInput = screen.getByRole('textbox'); // Assuming the filter input is a textbox
    fireEvent.change(filterInput, { target: { value: 'Jane' } });

    // Expect filter text state to be updated
    expect(mockSetFilterText).toHaveBeenCalledWith('Jane');
  });

  it('displays no results message when data is empty', () => {
    // Mock empty filtered data
    useFilteredTableData.mockReturnValue([]);
    useTableColumns.mockReturnValue([
      { Header: 'col1', accessor: 'col1' },
      { Header: 'col2', accessor: 'col2' },
    ]);

    render(<SingleQueryResultPane {...defaultProps} />);

    // Check that the no data text is rendered
    expect(TableView).toHaveBeenCalledWith(
      expect.objectContaining({
        noDataText: t('No results'),
      }),
      {},
    );
  });
});
