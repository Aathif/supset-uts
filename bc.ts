import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TagList from './TagList'; // Adjust path as necessary
import { useListViewResource, useFavoriteStatus } from 'src/views/CRUD/hooks';
import { deleteTags } from 'src/features/tags/tags';
import TagModal from 'src/features/tags/TagModal';
import { t } from '@superset-ui/core';
import withToasts from 'src/components/MessageToasts/withToasts';

// Mock dependencies
jest.mock('src/views/CRUD/hooks', () => ({
  useListViewResource: jest.fn(),
  useFavoriteStatus: jest.fn(),
}));

jest.mock('src/features/tags/tags', () => ({
  deleteTags: jest.fn(),
}));

jest.mock('src/features/tags/TagModal', () => (props: any) => (
  <div data-testid="tag-modal" {...props} />
));

jest.mock('@superset-ui/core', () => ({
  t: jest.fn((key) => key), // Simple mock for translation
}));

jest.mock('src/components/MessageToasts/withToasts', () => (Component: any) => Component);

describe('TagList Component', () => {
  const mockAddDangerToast = jest.fn();
  const mockAddSuccessToast = jest.fn();
  const mockRefreshData = jest.fn();
  const mockFetchData = jest.fn();
  const mockToggleBulkSelect = jest.fn();
  const mockSaveFavoriteStatus = jest.fn();
  const mockFavoriteStatus = {};

  beforeEach(() => {
    (useListViewResource as jest.Mock).mockReturnValue({
      state: {
        loading: false,
        resourceCount: 5,
        resourceCollection: [{ id: 1, name: 'Tag1', changed_on_delta_humanized: '2024-08-13', changed_by: 'User' }],
        bulkSelectEnabled: false,
      },
      hasPerm: jest.fn().mockReturnValue(true),
      fetchData: mockFetchData,
      toggleBulkSelect: mockToggleBulkSelect,
      refreshData: mockRefreshData,
    });

    (useFavoriteStatus as jest.Mock).mockReturnValue([mockSaveFavoriteStatus, mockFavoriteStatus]);

    render(
      <TagList
        addDangerToast={mockAddDangerToast}
        addSuccessToast={mockAddSuccessToast}
        user={{ userId: 1, firstName: 'John', lastName: 'Doe' }}
      />
    );
  });

  test('should render TagList component', () => {
    expect(screen.getByTestId('tag-modal')).toBeInTheDocument();
  });

  test('should open TagModal on clicking "Create a new Tag"', () => {
    fireEvent.click(screen.getByText(/Create a new Tag/i));
    expect(screen.getByTestId('tag-modal')).toBeVisible();
  });

  test('should call deleteTags on confirm delete', async () => {
    const confirmDelete = jest.fn();
    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton);

    // Simulate confirmation
    confirmDelete();
    expect(deleteTags).toHaveBeenCalled();
  });

  test('should handle bulk delete', async () => {
    const bulkDeleteButton = screen.getByText(/Delete/i);
    fireEvent.click(bulkDeleteButton);
    await waitFor(() => expect(deleteTags).toHaveBeenCalled());
  });

  test('should handle the state of the bulk select', () => {
    const bulkSelectButton = screen.getByTestId('bulk-select');
    fireEvent.click(bulkSelectButton);
    expect(mockToggleBulkSelect).toHaveBeenCalled();
  });

  test('should handle TagModal close', () => {
    fireEvent.click(screen.getByRole('button', { name: /Create a new Tag/i }));
    fireEvent.click(screen.getByRole('button', { name: /Close/i }));
    expect(screen.queryByTestId('tag-modal')).not.toBeVisible();
  });
});
