import { setDatastateFilter } from './path_to_setDatastateFilter';

describe('setDatastateFilter action creator', () => {
  it('should create an action to set the data state filter', () => {
    const mockDataState = 'ACTIVE';

    const expectedAction = {
      type: 'SET_DATASTATE',
      payload: mockDataState,
    };

    expect(setDatastateFilter(mockDataState)).toEqual(expectedAction);
  });
});
