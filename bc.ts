import { setDatasource } from './path_to_setDatasource';
import { DatasourcesAction } from './path_to_DatasourcesAction'; // Assuming this contains the action type constants

describe('setDatasource action creator', () => {
  it('should create an action to set a specific datasource', () => {
    const mockDatasource = { id: 1, name: 'Test Datasource' };
    const key = 'testKey';

    const expectedAction = {
      type: DatasourcesAction.SetDatasource,
      key,
      datasource: mockDatasource,
    };

    expect(setDatasource(mockDatasource, key)).toEqual(expectedAction);
  });
});
