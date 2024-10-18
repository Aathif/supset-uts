import { getURIDirectory } from './getURIDirectory';

describe('getURIDirectory', () => {
  test('should return /explore/ for the default (base) endpoint type', () => {
    const result = getURIDirectory();
    expect(result).toBe('/explore/');
  });

  test('should return /explore/ for unrecognized endpoint types', () => {
    const result = getURIDirectory('unknownType');
    expect(result).toBe('/explore/');
  });

  test('should return /superset/explore_json/ for json endpoint type', () => {
    const result = getURIDirectory('json');
    expect(result).toBe('/superset/explore_json/');
  });

  test('should return /superset/explore_json/ for csv endpoint type', () => {
    const result = getURIDirectory('csv');
    expect(result).toBe('/superset/explore_json/');
  });

  test('should return /superset/explore_json/ for query endpoint type', () => {
    const result = getURIDirectory('query');
    expect(result).toBe('/superset/explore_json/');
  });

  test('should return /superset/explore_json/ for results endpoint type', () => {
    const result = getURIDirectory('results');
    expect(result).toBe('/superset/explore_json/');
  });

  test('should return /superset/explore_json/ for samples endpoint type', () => {
    const result = getURIDirectory('samples');
    expect(result).toBe('/superset/explore_json/');
  });
});
