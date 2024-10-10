// FilterGroup.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import FilterGroup from './FilterGroup';
import { addSuccessToast, addDangerToast } from 'src/components/MessageToasts/actions';
import { setFilterGroupConfiguration } from 'src/dashboard/actions/nativeFilters';
import { useFilters } from 'src/dashboard/components/nativeFilters/FilterBar/state';
import { Modal } from 'antd';

// Mock necessary modules
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('src/dashboard/actions/nativeFilters', () => ({
  setFilterGroupConfiguration: jest.fn(),
}));
jest.mock('src/components/MessageToasts/actions', () => ({
  addSuccessToast: jest.fn(),
  addDangerToast: jest.fn(),
}));
jest.mock('src/dashboard/components/nativeFilters/FilterBar/state', () => ({
  useFilters: jest.fn(),
}));
jest.mock('antd', () => ({
  Modal: jest.fn(({ title, visible, onCancel, footer, children }) => (
    visible && (
      <div>
        <h1>{title}</h1>
        {children}
        <button onClick={onCancel}>Cancel</button>
        {footer}
      </div>
    )
  )),
}));

const mockDispatch = jest.fn();

describe('FilterGroup', () => {
  beforeEach(() => {
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as jest.Mock).mockReturnValue({
      dashboardInfo: { metadata: { filter_groups: [] } },
    });
    (useFilters as jest.Mock).mockReturnValue([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByText } = render(<FilterGroup hideButton={false} />);
    expect(getByText('Add Group')).toBeInTheDocument();
  });

  it('should open modal when Add Group button is clicked', () => {
    const { getByText } = render(<FilterGroup hideButton={false} />);
    const addButton = getByText('Add Group');
    
    fireEvent.click(addButton);
    expect(getByText('Group Filters')).toBeInTheDocument();
  });

  it('should close modal when Cancel button is clicked', async () => {
    const { getByText, queryByText } = render(<FilterGroup hideButton={false} />);
    const addButton = getByText('Add Group');
    
    fireEvent.click(addButton);
    expect(getByText('Group Filters')).toBeInTheDocument();
    
    fireEvent.click(getByText('Cancel'));
    await waitFor(() => {
      expect(queryByText('Group Filters')).toBeNull();
    });
  });

  it('should dispatch success toast and save group when Save button is clicked', async () => {
    const { getByText, getByLabelText } = render(<FilterGroup hideButton={false} />);
    const addButton = getByText('Add Group');
    
    fireEvent.click(addButton);

    fireEvent.change(getByLabelText('Group name'), { target: { value: 'Test Group' } });
    fireEvent.click(getByText('Save'));

    await waitFor(() => {
      expect(addSuccessToast).toHaveBeenCalledWith('Group created successfully');
    });
  });

  it('should show danger toast if no group name is provided on save', async () => {
    const { getByText } = render(<FilterGroup hideButton={false} />);
    const addButton = getByText('Add Group');
    
    fireEvent.click(addButton);
    fireEvent.click(getByText('Save'));

    await waitFor(() => {
      expect(addDangerToast).toHaveBeenCalledWith('Please add group name');
    });
  });
});
