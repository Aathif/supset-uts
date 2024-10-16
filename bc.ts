import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'src/components/MessageToasts/withToasts';
import { useDashboard, useDashboardCharts, useDashboardDatasets } from 'src/hooks/apiResources';
import { hydrateDashboard } from 'src/dashboard/actions/hydrate';
import { setDatasources } from 'src/dashboard/actions/datasources';
import { setDatasetsStatus } from 'src/dashboard/actions/dashboardState';
import DashboardPage from './DashboardPage';

// Mock necessary imports
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(),
}));
jest.mock('src/components/MessageToasts/withToasts', () => ({
  useToasts: jest.fn(),
}));
jest.mock('src/hooks/apiResources', () => ({
  useDashboard: jest.fn(),
  useDashboardCharts: jest.fn(),
  useDashboardDatasets: jest.fn(),
}));
jest.mock('src/dashboard/actions/hydrate', () => ({
  hydrateDashboard: jest.fn(),
}));
jest.mock('src/dashboard/actions/datasources', () => ({
  setDatasources: jest.fn(),
}));
jest.mock('src/dashboard/actions/dashboardState', () => ({
  setDatasetsStatus: jest.fn(),
}));
jest.mock('src/dashboard/util/injectCustomCss', () => jest.fn());
jest.mock('src/dashboard/containers/Dashboard', () => jest.fn(() => <div>DashboardContainer</div>));
jest.mock('src/dashboard/components/DashboardBuilder/DashboardBuilder', () => jest.fn(() => <div>DashboardBuilder</div>));

describe('DashboardPage', () => {
  const mockDispatch = jest.fn();
  const mockHistory = jest.fn();
  const mockAddDangerToast = jest.fn();
  const mockUseSelector = jest.fn();
  const mockUseDashboard = jest.fn();
  const mockUseDashboardCharts = jest.fn();
  const mockUseDashboardDatasets = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useHistory as jest.Mock).mockReturnValue(mockHistory);
    (useToasts as jest.Mock).mockReturnValue({ addDangerToast: mockAddDangerToast });
    (useSelector as jest.Mock).mockImplementation(mockUseSelector);
    (useDashboard as jest.Mock).mockImplementation(mockUseDashboard);
    (useDashboardCharts as jest.Mock).mockImplementation(mockUseDashboardCharts);
    (useDashboardDatasets as jest.Mock).mockImplementation(mockUseDashboardDatasets);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading component when dashboard data is not ready', () => {
    mockUseDashboard.mockReturnValue({ result: null });
    mockUseDashboardCharts.mockReturnValue({ result: null });

    render(<DashboardPage idOrSlug="1" />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('renders the dashboard components when data is ready', async () => {
    mockUseDashboard.mockReturnValue({ result: { dashboard_title: 'Test Dashboard', id: 1 } });
    mockUseDashboardCharts.mockReturnValue({ result: [] });
    mockUseDashboardDatasets.mockReturnValue({ result: [], status: 'success' });
    mockUseSelector.mockReturnValue(true);

    render(<DashboardPage idOrSlug="1" />);

    await waitFor(() => expect(screen.getByText('DashboardContainer')).toBeInTheDocument());
    expect(screen.getByText('DashboardBuilder')).toBeInTheDocument();
  });

  it('dispatches the hydrateDashboard action when data is ready', async () => {
    mockUseDashboard.mockReturnValue({ result: { dashboard_title: 'Test Dashboard', id: 1 } });
    mockUseDashboardCharts.mockReturnValue({ result: [] });
    mockUseDashboardDatasets.mockReturnValue({ result: [], status: 'success' });
    mockUseSelector.mockReturnValue(true);

    render(<DashboardPage idOrSlug="1" />);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        hydrateDashboard({
          history: mockHistory,
          dashboard: { dashboard_title: 'Test Dashboard', id: 1 },
          charts: [],
          activeTabs: undefined,
          dataMask: {},
        })
      );
    });
  });

  it('shows an error toast if there is a dataset API error', async () => {
    mockUseDashboard.mockReturnValue({ result: { dashboard_title: 'Test Dashboard', id: 1 } });
    mockUseDashboardCharts.mockReturnValue({ result: [] });
    mockUseDashboardDatasets.mockReturnValue({ result: [], error: 'Error' });
    mockUseSelector.mockReturnValue(true);

    render(<DashboardPage idOrSlug="1" />);

    await waitFor(() => {
      expect(mockAddDangerToast).toHaveBeenCalledWith(
        'Error loading chart datasources. Filters may not work correctly.',
      );
    });
  });
});
