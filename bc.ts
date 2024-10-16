import datasourcesReducer from './datasourcesReducer';
import { DatasourcesActionPayload, DatasourcesAction } from '../actions/datasources';
import { DatasourcesState } from 'src/dashboard/types';
import { keyBy } from 'lodash';

describe('datasourcesReducer', () => {
  const initialState: DatasourcesState = {
    'datasource1': { uid: 'datasource1', name: 'Datasource 1' },
    'datasource2': { uid: 'datasource2', name: 'Datasource 2' },
  };

  it('should handle SetDatasources action', () => {
    const action: DatasourcesActionPayload = {
      type: DatasourcesAction.SetDatasources,
      datasources: [
        { uid: 'datasource3', name: 'Datasource 3' },
        { uid: 'datasource4', name: 'Datasource 4' },
      ],
    };

    const expectedState = {
      ...initialState,
      datasource3: { uid: 'datasource3', name: 'Datasource 3' },
      datasource4: { uid: 'datasource4', name: 'Datasource 4' },
    };

    expect(datasourcesReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle SetDatasource action', () => {
    const action: DatasourcesActionPayload = {
      type: DatasourcesAction.SetDatasource,
      key: 'datasource1',
      datasource: { uid: 'datasource1', name: 'Updated Datasource 1' },
    };

    const expectedState = {
      ...initialState,
      datasource1: { uid: 'datasource1', name: 'Updated Datasource 1' },
    };

    expect(datasourcesReducer(initialState, action)).toEqual(expectedState);
  });

  it('should return the initial state if action type is unknown', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    expect(datasourcesReducer(initialState, action)).toEqual(initialState);
  });

  it('should return an empty object if no initial state is provided and action type is unknown', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    expect(datasourcesReducer(undefined, action)).toEqual({});
  });
});
