import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardCard from './DashboardCard';
import { Dashboard } from 'src/views/CRUD/types';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@superset-ui/core';
import { lightTheme } from '@superset-ui/core';

const mockDashboard: Dashboard = {
  id: 1,
  url: '/dashboard/1',
  dashboard_title: 'Test Dashboard',
  certified_by: null,
  certification_details: null,
  thumbnail_url: '',
  changed_on_delta_humanized: 'a day ago',
  published: true,
  owners: [],
};

const defaultProps = {
  dashboard: mockDashboard,
  hasPerm: jest.fn(() => true),
  bulkSelectEnabled: false,
  loading: false,
  favoriteStatus: false,
  saveFavoriteStatus: jest.fn(),
  handleBulkDashboardExport: jest.fn(),
  onDelete: jest.fn(),
};

const renderWithProviders = (props = {}) => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <MemoryRouter>
        <DashboardCard {...defaultProps} {...props} />
      </MemoryRouter>
    </ThemeProvider>,
  );
};

describe('DashboardCard', () => {
  it('renders the dashboard title and modified date', () => {
    renderWithProviders();
    expect(screen.getByText('Test Dashboard')).toBeInTheDocument();
    expect(screen.getByText('a day ago')).toBeInTheDocument();
  });

  it('renders the "published" label when the dashboard is published', () => {
    renderWithProviders();
    expect(screen.getByText('published')).toBeInTheDocument();
  });

  it('calls the "saveFavoriteStatus" function when the favorite star is clicked', () => {
    renderWithProviders({ userId: 1 });
    fireEvent.click(screen.getByRole('button', { name: /favorite/i }));
    expect(defaultProps.saveFavoriteStatus).toHaveBeenCalledWith(1, false);
  });

  it('calls the "openDashboardEditModal" when the edit option is clicked', () => {
    const openDashboardEditModal = jest.fn();
    renderWithProviders({ openDashboardEditModal });
    
    fireEvent.click(screen.getByTestId('dashboard-card-option-edit-button'));
    expect(openDashboardEditModal).toHaveBeenCalledWith(mockDashboard);
  });

  it('calls the "handleBulkDashboardExport" when the export option is clicked', () => {
    renderWithProviders();
    
    fireEvent.click(screen.getByTestId('dashboard-card-option-export-button'));
    expect(defaultProps.handleBulkDashboardExport).toHaveBeenCalledWith([mockDashboard]);
  });

  it('calls the "onDelete" function when the delete option is clicked', () => {
    renderWithProviders();
    
    fireEvent.click(screen.getByTestId('dashboard-card-option-delete-button'));
    expect(defaultProps.onDelete).toHaveBeenCalledWith(mockDashboard);
  });

  it('does not render edit, export, or delete options if permissions are not granted', () => {
    renderWithProviders({ hasPerm: jest.fn(() => false) });
    
    expect(screen.queryByTestId('dashboard-card-option-edit-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('dashboard-card-option-export-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('dashboard-card-option-delete-button')).not.toBeInTheDocument();
  });
});
