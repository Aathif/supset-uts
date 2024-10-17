import { requiresQuery } from './path_to_your_function'; // Update with actual path

describe('requiresQuery', () => {
  it('should return true for truthy values', () => {
    expect(requiresQuery('annotation')).toBe(true);
    expect(requiresQuery(1)).toBe(true);
    expect(requiresQuery({})).toBe(true);
    expect(requiresQuery([])).toBe(true);
  });

  it('should return false for falsy values', () => {
    expect(requiresQuery(null)).toBe(false);
    expect(requiresQuery(undefined)).toBe(false);
    expect(requiresQuery('')).toBe(false);
    expect(requiresQuery(0)).toBe(false);
    expect(requiresQuery(false)).toBe(false);
  });
});
