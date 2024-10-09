import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GlobalFilter from './GlobalFilter';
import { Row } from 'react-table';

// Mock `useAsyncState` since it's not part of the test
jest.mock('../utils/useAsyncState', () => {
  return (initialValue: string, callback: (newValue: string) => void, delay: number) => {
    const [state, setState] = React.useState(initialValue);
    return [state, setState];
  };
});

describe('GlobalFilter Component', () => {
  const mockSetGlobalFilter = jest.fn();
  const preGlobalFilteredRows: Row<any>[] = [
    { id: 1, original: { name: 'Item 1' } },
    { id: 2, original: { name: 'Item 2' } },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default search input', () => {
    render(
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        filterValue=""
        setGlobalFilter={mockSetGlobalFilter}
      />
    );

    // Ensure that the default input is rendered
    const inputElement = screen.getByPlaceholderText(/2 records.../);
    expect(inputElement).toBeInTheDocument();
  });

  it('calls setGlobalFilter on input change', async () => {
    render(
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        filterValue=""
        setGlobalFilter={mockSetGlobalFilter}
      />
    );

    const inputElement = screen.getByPlaceholderText(/2 records.../);
    
    // Simulate changing the input value
    fireEvent.change(inputElement, { target: { value: 'Item' } });

    // Wait for the filter to be applied
    await waitFor(() => expect(mockSetGlobalFilter).toHaveBeenCalledWith('Item'));
  });

  it('resets global filter when input is cleared', async () => {
    render(
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        filterValue=""
        setGlobalFilter={mockSetGlobalFilter}
      />
    );

    const inputElement = screen.getByPlaceholderText(/2 records.../);
    
    // Simulate changing the input value
    fireEvent.change(inputElement, { target: { value: 'Item' } });

    // Simulate clearing the input value
    fireEvent.change(inputElement, { target: { value: '' } });

    // Wait for the filter to be cleared
    await waitFor(() => expect(mockSetGlobalFilter).toHaveBeenCalledWith(''));
  });

  it('renders with custom search input', () => {
    const CustomSearchInput = ({ count, value, onChange }: any) => (
      <div>
        Custom Search ({count}) <input value={value} onChange={onChange} />
      </div>
    );

    render(
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        filterValue=""
        setGlobalFilter={mockSetGlobalFilter}
        searchInput={CustomSearchInput}
      />
    );

    // Ensure that the custom search input is rendered
    const customInput = screen.getByText(/Custom Search \(2\)/);
    expect(customInput).toBeInTheDocument();
  });
});
