import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TagList from './TagList';
import { deleteTags } from 'src/features/tags/tags';
import { useListViewResource, useFavoriteStatus } from 'src/views/CRUD/hooks';

// Mock necessary modules and functions
jest.mock('src/views/CRUD/hooks');
jest.mock('src/features/tags/tags');
jest.mock('src/utils/localStorageHelpers', () => ({
  dangerouslyGetItemDoNotUse: jest.fn(),
}));

const mockAddDangerToast = jest.fn();
const mockAddSuccessToast = jest.fn();
const mockUser = { userId: 1, firstName: 'John', lastName: 'Doe' };

const mockTags = [
  { id: 1, name: 'Tag1', changed_on_delta_humanized: '2 days ago', changed_by: 'User1' },
  { id: 2, name: 'Tag2', changed_on_delta_humanized: '5 days ago', changed_by: 'User2' },
];

// Mock hook responses
useListViewResource.mockReturnValue({
  state: {
    loading: false,
    resourceCount: mockTags.length,
    resourceCollection: mockTags,
    bulkSelectEnabled: false,
  },
  hasPerm: () => true,
  fetchData: jest.fn(),
  toggleBulkSelect: jest.fn(),
  refreshData: jest.fn(),
});

useFavoriteStatus.mockReturnValue([jest.fn(), {}]);

describe('TagList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the list of tags correctly', () => {
    render(
      <TagList
        addDangerToast={mockAddDangerToast}
        addSuccessToast={mockAddSuccessToast}
        user={mockUser}
      />,
    );

    // Check if tags are rendered
    mockTags.forEach(tag => {
      expect(screen.getByText(tag.name)).toBeInTheDocument();
    });
  });

  test('should call deleteTags when a tag is deleted', async () => {
    deleteTags.mockImplementation((tags, onSuccess) => onSuccess('Tag deleted successfully'));

    render(
      <TagList
        addDangerToast={mockAddDangerToast}
        addSuccessToast={mockAddSuccessToast}
        user={mockUser}
      />,
    );

    // Find the delete button (Trash icon) and click it
    const deleteButton = screen.getAllByTestId('dashboard-list-trash-icon')[0];
    fireEvent.click(deleteButton);

    // Confirm deletion action in the confirm modal
    const confirmDeleteButton = screen.getByText('Delete');
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => {
      expect(deleteTags).toHaveBeenCalledWith(
        [mockTags[0]],
        expect.any(Function),
        expect.any(Function),
      );
      expect(mockAddSuccessToast).toHaveBeenCalledWith('Tag deleted successfully');
    });
  });

  test('should open and close the tag modal when creating or editing a tag', () => {
    render(
      <TagList
        addDangerToast={mockAddDangerToast}
        addSuccessToast={mockAddSuccessToast}
        user={mockUser}
      />,
    );

    // Open the "New Tag" modal
    const newTagButton = screen.getByText(/Create a new Tag/i);
    fireEvent.click(newTagButton);

    expect(screen.getByText('Create Tag')).toBeInTheDocument();

    // Close the modal
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(screen.queryByText('Create Tag')).not.toBeInTheDocument();
  });

  test('renders the empty state when no tags are present', () => {
    useListViewResource.mockReturnValueOnce({
      state: {
        loading: false,
        resourceCount: 0,
        resourceCollection: [],
        bulkSelectEnabled: false,
      },
      hasPerm: () => true,
      fetchData: jest.fn(),
      toggleBulkSelect: jest.fn(),
      refreshData: jest.fn(),
    });

    render(
      <TagList
        addDangerToast={mockAddDangerToast}
        addSuccessToast={mockAddSuccessToast}
        user={mockUser}
      />,
    );

    expect(screen.getByText('No Tags created')).toBeInTheDocument();
  });
});
