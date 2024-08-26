import { getURIDirectory } from './path-to-your-function'; // Adjust the import path

describe('getURIDirectory', () => {
  it('should return the default directory for base endpointType', () => {
    const formData = {};
    const result = getURIDirectory(formData);
    expect(result).toBe('/superset/explore');
  });

  it('should return the explore_json directory for json endpointType', () => {
    const formData = {};
    const result = getURIDirectory(formData, 'json');
    expect(result).toBe('/superset/explore_json');
  });

  it('should return the explore_json directory for csv endpointType', () => {
    const formData = {};
    const result = getURIDirectory(formData, 'csv');
    expect(result).toBe('/superset/explore_json');
  });

  it('should return the explore_json directory for query endpointType', () => {
    const formData = {};
    const result = getURIDirectory(formData, 'query');
    expect(result).toBe('/superset/explore_json');
  });

  it('should return the explore_json directory for results endpointType', () => {
    const formData = {};
    const result = getURIDirectory(formData, 'results');
    expect(result).toBe('/superset/explore_json');
  });

  it('should return the explore_json directory for samples endpointType', () => {
    const formData = {};
    const result = getURIDirectory(formData, 'samples');
    expect(result).toBe('/superset/explore_json');
  });

  it('should return the default directory for an unknown endpointType', () => {
    const formData = {};
    const result = getURIDirectory(formData, 'unknown');
    expect(result).toBe('/superset/explore');
  });
});
