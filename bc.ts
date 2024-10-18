import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AllEntitiesTable from './AllEntitiesTable'; // Adjust the import path
import { t } from '@superset-ui/core';

const mockedSetShowTagModal = jest.fn();

const mockObjects = {
  dashboard: [
    {
      id: 1,
      type: 'dashboard',
      name: 'Sales Dashboard',
      url: '/dashboard/1',
      changed_on: '2023-08-10T12:00:00Z',
      created_by: 1,
      creator: 'Admin',
      owners: [{ id: 1, first_name: 'Admin', last_name: 'User' }],
      tags: [{ id: 1, name: 'Q1', type: 1 }],
    },
  ],
  chart: [
    {
      id: 2,
      type: 'chart',
      name: 'Sales by Country',
      url: '/chart/2',
      changed_on: '2023-08-11T12:00:00Z',
      created_by: 2,
      creator: 'User 2',
      owners: [{ id: 2, first_name: 'John', last_name: 'Doe' }],
      tags: [{ id: 2, name: 'Revenue', type: 1 }],
    },
  ],
  query: [],
};

describe('AllEntitiesTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render tables for dashboards and charts when data is available', () => {
    render(
      <AllEntitiesTable
        search=""
        setShowTagModal={mockedSetShowTagModal}
        objects={mockObjects}
      />
    );

    // Check if dashboard section is rendered
    expect(screen.getByText(t('Dashboards'))).toBeInTheDocument();
    expect(screen.getByText('Sales Dashboard')).toBeInTheDocument();

    // Check if chart section is rendered
    expect(screen.getByText(t('Charts'))).toBeInTheDocument();
    expect(screen.getByText('Sales by Country')).toBeInTheDocument();

    // Check if queries section is rendered but empty
    expect(screen.getByText(t('Queries'))).toBeInTheDocument();
    expect(screen.queryByText('Some Query')).not.toBeInTheDocument();
  });

  it('should render the empty state when there are no objects', () => {
    render(
      <AllEntitiesTable
        search=""
        setShowTagModal={mockedSetShowTagModal}
        objects={{ dashboard: [], chart: [], query: [] }}
      />
    );

    // Check for empty state message
    expect(
      screen.getByText(t('No entities have this tag currently assigned'))
    ).toBeInTheDocument();

    // Check for the "Add tag to entities" button
    const button = screen.getByText(t('Add tag to entities'));
    expect(button).toBeInTheDocument();

    // Test button click
    fireEvent.click(button);
    expect(mockedSetShowTagModal).toHaveBeenCalledWith(true);
  });

  it('should render the tags and owners correctly', () => {
    render(
      <AllEntitiesTable
        search=""
        setShowTagModal={mockedSetShowTagModal}
        objects={mockObjects}
      />
    );

    // Check for tags in the dashboards and charts
    expect(screen.getByText('Q1')).toBeInTheDocument(); // Tag for dashboard
    expect(screen.getByText('Revenue')).toBeInTheDocument(); // Tag for chart

    // Check for owners in the dashboards and charts
    expect(screen.getByText('Admin User')).toBeInTheDocument(); // Owner for dashboard
    expect(screen.getByText('John Doe')).toBeInTheDocument(); // Owner for chart
  });
});

