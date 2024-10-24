import { setVisibleColumns } from './path_to_setVisibleColumns';

describe('setVisibleColumns action creator', () => {
  it('should create an action to set visible columns', () => {
    const mockPayload = {
      slice_id: 1,
      groupBy: ['column1', 'column2'],
      metrics: ['metric1'],
      percent_metrics: ['metric2'],
      allColumns: ['column3', 'column4'],
    };

    const expectedAction = {
      type: 'SET_VISIBLE_COLOUMNS',
      payload: {
        slice_id: mockPayload.slice_id,
        groupBy: mockPayload.groupBy,
        metrics: mockPayload.metrics,
        percent_metrics: mockPayload.percent_metrics,
        allColumns: mockPayload.allColumns,
      },
    };

    expect(setVisibleColumns(mockPayload)).toEqual(expectedAction);
  });
});
