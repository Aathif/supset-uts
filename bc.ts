import { hydrateDashboard, HYDRATE_DASHBOARD } from './path_to_hydrateDashboard';
import { applyDefaultFormData } from 'src/explore/store';
import { updateColorSchema } from './dashboardInfo';
import { getInitialNativeFilterState } from 'src/dashboard/reducers/nativeFilters';
import { buildActiveFilters } from 'src/dashboard/util/activeDashboardFilters';
import newComponentFactory from 'src/dashboard/util/newComponentFactory';
import extractUrlParams from '../util/extractUrlParams';
import { findPermission } from 'src/utils/findPermission';
import { canUserEditDashboard, canUserSaveAsDashboard } from 'src/dashboard/util/permissionUtils';
import { URL_PARAMS } from 'src/constants';
import { ResourceStatus } from 'src/hooks/apiResources/apiResources';

// Mock necessary dependencies
jest.mock('src/explore/store', () => ({
  applyDefaultFormData: jest.fn(formData => formData),
}));
jest.mock('./dashboardInfo', () => ({
  updateColorSchema: jest.fn(),
}));
jest.mock('src/dashboard/reducers/nativeFilters', () => ({
  getInitialNativeFilterState: jest.fn(),
}));
jest.mock('src/dashboard/util/activeDashboardFilters', () => ({
  buildActiveFilters: jest.fn(),
}));
jest.mock('../util/extractUrlParams', () => jest.fn());
jest.mock('src/utils/findPermission', () => ({
  findPermission: jest.fn(),
}));
jest.mock('src/dashboard/util/permissionUtils', () => ({
  canUserEditDashboard: jest.fn(),
  canUserSaveAsDashboard: jest.fn(),
}));
jest.mock('src/dashboard/util/newComponentFactory', () => jest.fn());

describe('hydrateDashboard', () => {
  const mockDashboard = {
    metadata: {
      shared_label_colors: { color1: '#ff0000' },
      label_colors: { label1: '#00ff00' },
      native_filter_configuration: [],
      expanded_slices: {},
      refresh_frequency: 0,
      css: '',
      color_namespace: null,
      color_scheme: null,
    },
    dashboard_title: 'Test Dashboard',
    changed_on: '2024-10-01',
    published: true,
  };

  const mockChart = {
    slice_id: 1,
    form_data: { slice_id: 1, viz_type: 'bar' },
    slice_url: '/slice/1',
    slice_name: 'Test Slice',
    datasource: { name: 'Test Datasource' },
    description: 'Test description',
    owners: [],
    modified: '2024-09-30',
    changed_on: '2024-09-30',
  };

  const mockCharts = [mockChart];
  const mockGetState = jest.fn(() => ({
    user: { userId: 1, roles: [] },
    common: { conf: {} },
    dashboardState: {},
  }));
  const mockDispatch = jest.fn();
  const mockHistory = {
    replace: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch HYDRATE_DASHBOARD action with the correct data', async () => {
    extractUrlParams.mockReturnValueOnce({ edit: 'false' });
    canUserEditDashboard.mockReturnValueOnce(true);
    canUserSaveAsDashboard.mockReturnValueOnce(true);
    findPermission.mockReturnValueOnce(true);
    getInitialNativeFilterState.mockReturnValueOnce({});

    await hydrateDashboard({
      history: mockHistory,
      dashboard: mockDashboard,
      charts: mockCharts,
      dataMask: {},
      activeTabs: [],
    })(mockDispatch, mockGetState);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: HYDRATE_DASHBOARD,
      data: expect.objectContaining({
        charts: expect.objectContaining({
          1: expect.objectContaining({
            id: 1,
            form_data: expect.any(Object),
          }),
        }),
        dashboardInfo: expect.objectContaining({
          dash_edit_perm: true,
          dash_save_perm: true,
          superset_can_explore: true,
        }),
      }),
    });

    expect(updateColorSchema).toHaveBeenCalledWith(
      mockDashboard.metadata,
      mockDashboard.metadata.shared_label_colors,
    );
  });

  it('should call updateColorSchema if label_colors exist', async () => {
    await hydrateDashboard({
      history: mockHistory,
      dashboard: mockDashboard,
      charts: mockCharts,
      dataMask: {},
      activeTabs: [],
    })(mockDispatch, mockGetState);

    expect(updateColorSchema).toHaveBeenCalledWith(
      mockDashboard.metadata,
      mockDashboard.metadata.label_colors,
    );
  });

  it('should handle URL parameters correctly', async () => {
    extractUrlParams.mockReturnValueOnce({ edit: 'true' });

    await hydrateDashboard({
      history: mockHistory,
      dashboard: mockDashboard,
      charts: mockCharts,
      dataMask: {},
      activeTabs: [],
    })(mockDispatch, mockGetState);

    expect(extractUrlParams).toHaveBeenCalledWith('regular');
    expect(mockHistory.replace).toHaveBeenCalled();
  });
});
