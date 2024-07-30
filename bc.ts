// utils.test.js
import { cachedBuildQuery } from './utils';
import { buildQuery } from './buildQuery'; // Import the buildQuery function

// Mock buildQuery
jest.mock('./buildQuery', () => ({
  buildQuery: jest.fn()
}));

describe('cachedBuildQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mock calls
  });

  test('should initialize with empty cachedChanges', () => {
    const queryBuilder = cachedBuildQuery();
    const formData = {};
    const options = {};

    queryBuilder(formData, options);

    expect(buildQuery).toHaveBeenCalledWith(
      formData,
      expect.objectContaining({
        extras: { cachedChanges: {} },
        ownState: {},
        hooks: expect.objectContaining({
          setDataMask: expect.any(Function),
          setCachedChanges: expect.any(Function),
        }),
      })
    );
  });

  test('should include cachedChanges in the extras parameter', () => {
    const queryBuilder = cachedBuildQuery();
    const formData = {};
    const options = {};
    
    // Update cachedChanges
    const setCachedChanges = queryBuilder(formData, options).hooks.setCachedChanges;
    setCachedChanges({ key: 'value' });

    queryBuilder(formData, options);

    expect(buildQuery).toHaveBeenCalledWith(
      formData,
      expect.objectContaining({
        extras: { cachedChanges: { key: 'value' } },
      })
    );
  });

  test('should use provided ownState and hooks options', () => {
    const queryBuilder = cachedBuildQuery();
    const formData = {};
    const options = {
      ownState: { someState: true },
      hooks: {
        customHook: () => {},
      },
    };

    queryBuilder(formData, options);

    expect(buildQuery).toHaveBeenCalledWith(
      formData,
      expect.objectContaining({
        extras: { cachedChanges: {} },
        ownState: { someState: true },
        hooks: expect.objectContaining({
          setDataMask: expect.any(Function),
          setCachedChanges: expect.any(Function),
          customHook: expect.any(Function),
        }),
      })
    );
  });
});
