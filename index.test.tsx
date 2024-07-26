import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AllEntities from './AllEntities'; // replace with the actual path
import * as tagsApi from 'src/features/tags/tags';
import { withToasts } from 'src/components/MessageToasts/withToasts';

jest.mock('src/features/tags/tags');
jest.mock('src/components/MessageToasts/withToasts', () => ({
  withToasts: (Component) => (props) => <Component {...props} addSuccessToast={jest.fn()} addDangerToast={jest.fn()} />,
}));

describe('AllEntities', () => {
  const mockTag = {
    id: 1,
    name: 'Test Tag',
    description: 'Test Description',
    created_by: { first_name: 'John', last_name: 'Doe' },
    created_on_delta_humanized: '2 days ago',
    changed_on_delta_humanized: '1 day ago',
    changed_by: { first_name: 'Jane', last_name: 'Smith' },
  };

  const mockTaggedObjects = [
    {
      id: 1,
      type: 'dashboard',
      name: 'Dashboard 1',
      url: '/dashboard/1',
      changed_on: '2021-01-01T00:00:00',
      created_by: 1,
      creator: 'John Doe',
      owners: [{ first_name: 'John', last_name: 'Doe' }],
      tags: [],
    },
    {
      id: 2,
      type: 'chart',
      name: 'Chart 1',
      url: '/chart/1',
      changed_on: '2021-01-01T00:00:00',
      created_by: 1,
      creator: 'John Doe',
      owners: [{ first_name: 'John', last_name: 'Doe' }],
      tags: [],
    },
  ];

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render and display loading state initially', () => {
    tagsApi.fetchSingleTag.mockImplementation((id, success) => success(mockTag));

    render(<AllEntities />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should fetch and display tag information', async () => {
    tagsApi.fetchSingleTag.mockImplementation((id, success) => success(mockTag));
    tagsApi.fetchObjectsByTagIds.mockImplementation((params, success) => success(mockTaggedObjects));

    render(<AllEntities />);

    await waitFor(() => expect(screen.getByText('Test Tag')).toBeInTheDocument());

    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('2 days ago')).toBeInTheDocument();
    expect(screen.getByText('1 day ago')).toBeInTheDocument();
    expect(screen.getByText('Dashboard 1')).toBeInTheDocument();
    expect(screen.getByText('Chart 1')).toBeInTheDocument();
  });

  it('should handle errors in fetching tag information', async () => {
    tagsApi.fetchSingleTag.mockImplementation((id, success, error) => error());

    render(<AllEntities />);

    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    expect(screen.getByText('Error Fetching Tagged Objects')).toBeInTheDocument();
  });

  it('should handle opening and closing of the TagModal', async () => {
    tagsApi.fetchSingleTag.mockImplementation((id, success) => success(mockTag));

    render(<AllEntities />);

    await waitFor(() => expect(screen.getByText('Test Tag')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Edit Tag'));

    expect(screen.getByText('Tag Modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close'));

    expect(screen.queryByText('Tag Modal')).not.toBeInTheDocument();
  });
});
