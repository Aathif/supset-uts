// utils.test.js
import { getQueryMode } from './utils';
import { QueryMode } from './constants';

describe('getQueryMode', () => {
  test('returns Aggregate when query_mode is Aggregate', () => {
    const formData = { query_mode: QueryMode.Aggregate };
    expect(getQueryMode(formData)).toBe(QueryMode.Aggregate);
  });

  test('returns Raw when query_mode is Raw', () => {
    const formData = { query_mode: QueryMode.Raw };
    expect(getQueryMode(formData)).toBe(QueryMode.Raw);
  });

  test('returns Raw when query_mode is undefined and all_columns is not empty', () => {
    const formData = { all_columns: ['col1', 'col2'] };
    expect(getQueryMode(formData)).toBe(QueryMode.Raw);
  });

  test('returns Aggregate when query_mode is undefined and all_columns is empty', () => {
    const formData = { all_columns: [] };
    expect(getQueryMode(formData)).toBe(QueryMode.Aggregate);
  });

  test('returns Aggregate when query_mode is undefined and all_columns is not present', () => {
    const formData = {};
    expect(getQueryMode(formData)).toBe(QueryMode.Aggregate);
  });

  test('returns Aggregate when query_mode is not recognized and all_columns is not present', () => {
    const formData = { query_mode: 'unknown_mode' };
    expect(getQueryMode(formData)).toBe(QueryMode.Aggregate);
  });
});
