import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TagList from './TagList'; // Replace with your path

jest.mock('src/views/CRUD/utils', () => ({
  useListViewResource: jest.fn(),
  useFavoriteStatus: jest.fn(),
  deleteTags: jest.fn(),
}));

jest.mock('src/features/tags/tags', () => ({
  TagModal: jest.fn(),
}));

describe('TagList component', () => {
  it('renders loading state', () => {
    const mockUseListViewResource = jest.fn().mockReturnValue({
      state: { loading: true },
      hasPerm: () => true,
      fetchData: jest.fn(),
      refreshData: jest.fn(),
    });
    jest.mocked(
      'src/views/CRUD/utils',
      'useListViewResource',
      mockUseListViewResource
    );

    render(<TagList user={{ userId: 1 }} addDangerToast={jest.fn()} addSuccessToast={jest.fn()} />);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('renders tags list with data', () => {
    const mockUseListViewResource = jest.fn().mockReturnValue({
      state: {
        loading: false,
        resourceCollection: [
          { id: 1, name: 'Tag 1' },
          { id: 2, name: 'Tag 2' },
        ],
      },
      hasPerm: () => true,
      fetchData: jest.fn(),
      refreshData: jest.fn(),
    });
    jest.mocked(
      'src/views/CRUD/utils',
      'useListViewResource',
      mockUseListViewResource
    );

    render(<TagList user={{ userId: 1 }} addDangerToast={jest.fn()} addSuccessToast={jest.fn()} />);

    expect(screen.getAllByText(/Tag/i)).toHaveLength(2);
  });

  it('shows tag modal on new tag button click', () => {
    const mockTagModal = jest.fn();
    jest.mocked('src/features/tags/tags', 'TagModal', mockTagModal);

    render(<TagList user={{ userId: 1 }} addDangerToast={jest.fn()} addSuccessToast={jest.fn()} />);

    const newTagButton = screen.getByRole('button', { name: /Tag/i });
    fireEvent.click(newTagButton);

    expect(mockTagModal).toHaveBeenCalledTimes(1);
  });

  it('calls deleteTags on bulk delete confirmation', async () => {
    const mockUseListViewResource = jest.fn().mockReturnValue({
      state: {
        loading: false,
        resourceCollection: [
          { id: 1, name: 'Tag 1' },
          { id: 2, name: 'Tag 2' },
        ],
      },
      hasPerm: () => true,
      fetchData: jest.fn(),
      refreshData: jest.fn(),
    });
    const mockDeleteTags = jest.fn().mockResolvedValue();
    jest.mocked('src/views/CRUD/utils', 'useListViewResource', mockUseListViewResource);
    jest.mocked('src/features/tags/tags', 'deleteTags', mockDeleteTags);

    render(<TagList user={{ userId: 1 }} addDangerToast={jest.fn()} addSuccessToast={jest.fn()} />);

    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox); // Select all tags

    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton);

    // Simulate confirm dialog click
    const confirmButton = await screen.findByRole('button', { name: /Confirm/i });
    fireEvent.click(confirmButton);

    expect(mockDeleteTags).toHaveBeenCalledWith([expect.any(), expect.any()], expect.any(), expect.any(), expect.any());
  });

  // Add more tests for different functionalities (sorting, filtering, favorite star, etc.)
});
