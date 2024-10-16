import exportCsvReducer, { EXPORT_CSV_INITIAL_STATE } from './exportCsvReducer';
import { SET_VISIBLE_COLUMNS, SET_DATASTATE } from '../actions/types';

describe('exportCsvReducer', () => {
  it('should return the initial state when no action is provided', () => {
    const result = exportCsvReducer(undefined, {});
    expect(result).toEqual(EXPORT_CSV_INITIAL_STATE);
  });

  it('should handle SET_VISIBLE_COLUMNS action', () => {
    const action = {
      type: SET_VISIBLE_COLUMNS,
      payload: { column1: true, column2: false },
    };
    const expectedState = {
      ...EXPORT_CSV_INITIAL_STATE,
      formData: { column1: true, column2: false },
    };

    const result = exportCsvReducer(EXPORT_CSV_INITIAL_STATE, action);
    expect(result).toEqual(expectedState);
  });

  it('should handle SET_DATASTATE action', () => {
    const action = {
      type: SET_DATASTATE,
      payload: { isLoading: true, data: [] },
    };
    const expectedState = {
      ...EXPORT_CSV_INITIAL_STATE,
      dataState: { isLoading: true, data: [] },
    };

    const result = exportCsvReducer(EXPORT_CSV_INITIAL_STATE, action);
    expect(result).toEqual(expectedState);
  });

  it('should return the current state for unknown action types', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const currentState = {
      formData: { column1: true },
      dataState: { isLoading: false },
    };

    const result = exportCsvReducer(currentState, action);
    expect(result).toEqual(currentState);
  });
});
