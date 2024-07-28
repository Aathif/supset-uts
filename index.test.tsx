import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import TagList from './TagList';
import { useListViewResource, useFavoriteStatus } from 'src/views/CRUD/hooks';
import withToasts from 'src/components/MessageToasts/withToasts';

jest.mock('src/views/CRUD/hooks');
jest.mock('src/components/MessageToasts/withToasts');

const mockUseListViewResource = useListViewResource as jest.Mock;
const mockUseFavoriteStatus = useFavoriteStatus as jest.Mock;
const mockWithToasts = withToasts as jest.Mock;

const mockTags = [
  { id: 1, name: 'Tag1', changed_on_delta_humanized: '2 days ago', changed_by: { firstName: 'User', lastName: 'One' } },
  { id: 2, name: 'Tag2', changed_on_delta_humanized: '1 day ago', changed_by: { firstName: 'User', lastName: 'Two' } },
];

mockUseListViewResource.mockReturnValue({
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

mockUseFavoriteStatus.mockReturnValue([jest.fn(), { 1: true, 2: false }]);

mockWithToasts.mockImplementation((component) => component);

describe('TagList', () => {
  const addDangerToast = jest.fn();
  const addSuccessToast = jest.fn();

  const user = {
    userId: 1,
    firstName: 'Test',
    lastName: 'User',
  };

  beforeEach(() => {
    render(
      <MemoryRouter>
        <TagList addDangerToast={addDangerToast} addSuccessToast={addSuccessToast} user={user} />
      </MemoryRouter>
    );
  });

  test('renders TagList component', () => {
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Create a new Tag')).toBeInTheDocument();
  });

  test('renders tags correctly', () => {
    expect(screen.getByText('Tag1')).toBeInTheDocument();
    expect(screen.getByText('Tag2')).toBeInTheDocument();
  });

  test('handles tag edit', async () => {
    fireEvent.click(screen.getAllByTestId('edit-alt')[0]);
    await waitFor(() => {
      expect(screen.getByText('Tag Modal')).toBeInTheDocument();
    });
  });

  test('handles tag delete', async () => {
    fireEvent.click(screen.getAllByTestId('dashboard-list-trash-icon')[0]);
    await waitFor(() => {
      expect(screen.getByText('Please confirm')).toBeInTheDocument();
    });
  });
});
