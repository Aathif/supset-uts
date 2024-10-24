import { setDatasources } from './path_to_setDatasources';
import { DatasourcesAction } from './path_to_DatasourcesAction'; // Import your action type enum or constants

describe('setDatasources action creator', () => {
  it('should create an action to set datasources with a non-null payload', () => {
    const mockDatasources = [
      { id: 1, name: 'Datasource 1' },
      { id: 2, name: 'Datasource 2' },
    ];

    const expectedAction = {
      type: DatasourcesAction.SetDatasources,
      datasources: mockDatasources,
    };

    expect(setDatasources(mockDatasources)).toEqual(expectedAction);
  });

  it('should create an action to set datasources with a null payload', () => {
    const expectedAction = {
      type: DatasourcesAction.SetDatasources,
      datasources: null,
    };

    expect(setDatasources(null)).toEqual(expectedAction);
  });
});
