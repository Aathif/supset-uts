import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Pagination from './Pagination'; // Adjust the import based on your file structure

describe('Pagination Component', () => {
  const mockOnPageChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  test('renders without crashing', () => {
    const { container } = render(
      <Pagination 
        pageCount={10} 
        currentPage={0} 
        onPageChange={mockOnPageChange} 
      />
    );
    expect(container).toBeInTheDocument();
  });

  test('displays correct page items', () => {
    const { getByText } = render(
      <Pagination 
        pageCount={10} 
        currentPage={0} 
        onPageChange={mockOnPageChange} 
      />
    );

    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
    expect(getByText('…')).toBeInTheDocument();
    expect(getByText('10')).toBeInTheDocument();
  });

  test('handles page change on number click', () => {
    const { getByText } = render(
      <Pagination 
        pageCount={10} 
        currentPage={0} 
        onPageChange={mockOnPageChange} 
      />
    );

    fireEvent.click(getByText('2'));

    expect(mockOnPageChange).toHaveBeenCalledWith(1); // 0-based index
  });

  test('handles page change on ellipsis click', () => {
    const { getByText } = render(
      <Pagination 
        pageCount={10} 
        currentPage={0} 
        onPageChange={mockOnPageChange} 
      />
    );

    // In this example, we assume clicking the ellipsis will not change the page
    expect(mockOnPageChange).not.toHaveBeenCalled(); // No calls yet

    fireEvent.click(getByText('…'));

    expect(mockOnPageChange).not.toHaveBeenCalled(); // No calls for ellipsis
  });

  test('marks current page as active', () => {
    const { getByText } = render(
      <Pagination 
        pageCount={10} 
        currentPage={1} 
        onPageChange={mockOnPageChange} 
      />
    );

    const activePage = getByText('2');
    expect(activePage.parentElement).toHaveClass('active'); // Check if parent <li> has 'active' class
  });
});
