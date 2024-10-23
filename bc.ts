import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChartPills, ChartPillsProps } from './ChartPills'; // Assuming the file is named ChartPills.tsx
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';

// Mock components
jest.mock('src/explore/components/RowCountLabel', () => ({
  __esModule: true,
  default: ({ rowcount, limit }: { rowcount: number; limit: number }) => (
    <div>{`Rows: ${rowcount} / Limit: ${limit}`}</div>
  ),
}));

jest.mock('src/components/CachedLabel', () => ({
  __esModule: true,
  default: ({ cachedTimestamp, onClick }: { cachedTimestamp: string; onClick: () => void }) => (
    <div onClick={onClick}>{`Cached at: ${cachedTimestamp}`}</div>
  ),
}));

jest.mock('src/components/Timer', () => ({
  __esModule: true,
  default: ({ startTime, endTime, isRunning, status }: any) => (
    <div>{`Timer: ${isRunning ? 'Running' : 'Stopped'}, Status: ${status}, Time: ${startTime}-${endTime}`}</div>
  ),
}));

describe('ChartPills', () => {
  const defaultProps: ChartPillsProps = {
    queriesResponse: [
      {
        sql_rowcount: 100,
        is_cached: true,
        cached_dttm: '2024-10-10 12:00:00',
      },
    ] as any[], // as we mock queriesResponse, we simplify its structure
    chartStatus: 'success',
    chartUpdateStartTime: 1000,
    chartUpdateEndTime: 2000,
    refreshCachedQuery: jest.fn(),
    rowLimit: 500,
  };

  it('renders RowCountLabel and CachedLabel when not loading', () => {
    render(<ChartPills {...defaultProps} ref={null} />);

    // Check if RowCountLabel renders correctly
    expect(screen.getByText('Rows: 100 / Limit: 500')).toBeInTheDocument();

    // Check if CachedLabel renders correctly
    expect(screen.getByText('Cached at: 2024-10-10 12:00:00')).toBeInTheDocument();
  });

  it('calls refreshCachedQuery when CachedLabel is clicked', () => {
    render(<ChartPills {...defaultProps} ref={null} />);

    const cachedLabel = screen.getByText('Cached at: 2024-10-10 12:00:00');
    userEvent.click(cachedLabel);

    expect(defaultProps.refreshCachedQuery).toHaveBeenCalled();
  });

  it('renders Timer with correct status', () => {
    render(<ChartPills {...defaultProps} ref={null} />);

    // Check if Timer renders with correct props
    expect(screen.getByText('Timer: Stopped, Status: success, Time: 1000-2000')).toBeInTheDocument();
  });

  it('does not render RowCountLabel or CachedLabel when loading', () => {
    const loadingProps = { ...defaultProps, chartStatus: 'loading' };
    render(<ChartPills {...loadingProps} ref={null} />);

    // Check that RowCountLabel and CachedLabel do not render
    expect(screen.queryByText('Rows: 100 / Limit: 500')).not.toBeInTheDocument();
    expect(screen.queryByText('Cached at: 2024-10-10 12:00:00')).not.toBeInTheDocument();

    // Check if Timer renders with loading status
    expect(screen.getByText('Timer: Running, Status: warning, Time: 1000-2000')).toBeInTheDocument();
  });
});
