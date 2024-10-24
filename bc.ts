import { fetchDatasourceMetadata } from './path_to_fetchDatasourceMetadata';
import { setDatasource } from './path_to_setDatasource'; // Mocked action creator
import { SupersetClient } from '@superset-ui/core'; // Mock SupersetClient

jest.mock('@superset-ui/core', () => ({
  SupersetClient: {
    get: jest.fn(),
  },
}));

jest.mock('./path_to_setDatasource', () => ({
  setDatasource: jest.fn(),
}));

describe('fetchDatasourceMetadata', () => {
  const mockDispatch = jest.fn();
  const mockGetState = jest.fn();
  const key = 'testKey';
  const mockDatasource = { id: 1, name: 'Test Datasource' };

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test to avoid interference
  });

  it('should dispatch setDatasource if datasource is already in state', async () => {
    // Mock the state to have the datasource
    mockGetState.mockReturnValue({
      datasources: { [key]: mockDatasource },
    });

    await fetchDatasourceMetadata(key)(mockDispatch, mockGetState);

    // Ensure setDatasource was called with the datasource from state
    expect(setDatasource).toHaveBeenCalledWith(mockDatasource, key);
    // Ensure dispatch was called
    expect(mockDispatch).toHaveBeenCalledWith(setDatasource(mockDatasource, key));
    // Ensure SupersetClient.get was not called since the datasource is already in state
    expect(SupersetClient.get).not.toHaveBeenCalled();
  });

  it('should fetch datasource from API if not in state and dispatch setDatasource', async () => {
    // Mock the state to not have the datasource
    mockGetState.mockReturnValue({
      datasources: {},
    });

    // Mock SupersetClient's response
    SupersetClient.get.mockResolvedValue({ json: mockDatasource });

    await fetchDatasourceMetadata(key)(mockDispatch, mockGetState);

    // Ensure SupersetClient.get was called with the correct endpoint
    expect(SupersetClient.get).toHaveBeenCalledWith({
      endpoint: `/superset/fetch_datasource_metadata?datasourceKey=${key}`,
    });

    // Ensure setDatasource was called with the fetched datasource
    expect(setDatasource).toHaveBeenCalledWith(mockDatasource, key);
    // Ensure dispatch was called with the result of setDatasource
    expect(mockDispatch).toHaveBeenCalledWith(setDatasource(mockDatasource, key));
  });
});
