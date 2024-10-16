import { renderHook, act } from '@testing-library/react-hooks';
import useSticky from './path-to-useSticky'; // Update with the actual path to your useSticky hook

// Mock the reducer actions and types
const ReducerActions = {
  init: 'init',
  setStickyState: 'setStickyState',
};

// Mock hooks object
const mockHooks = {
  useInstance: {
    push: jest.fn(),
  },
  stateReducers: {
    push: jest.fn(),
  },
};

describe('useSticky Hook', () => {
  it('should push useInstance and stateReducers into hooks', () => {
    useSticky(mockHooks);

    // Assert that push was called for both useInstance and stateReducers
    expect(mockHooks.useInstance.push).toHaveBeenCalledWith(expect.any(Function));
    expect(mockHooks.stateReducers.push).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should handle init action and set sticky state', () => {
    const mockState = { sticky: {} };
    const action = { type: ReducerActions.init };

    // Get the reducer pushed into stateReducers
    const reducer = mockHooks.stateReducers.push.mock.calls[0][0];

    const newState = reducer(mockState, action, {});

    // Check that sticky state is initialized
    expect(newState).toEqual({
      sticky: {},
    });
  });

  it('should handle setStickyState action and update sticky state', () => {
    const mockState = { sticky: {} };
    const action = {
      type: ReducerActions.setStickyState,
      size: { top: 100, bottom: 200 },
    };

    // Get the reducer pushed into stateReducers
    const reducer = mockHooks.stateReducers.push.mock.calls[0][0];

    const newState = reducer(mockState, action, {
      sticky: { top: 50 },
    });

    // Check that sticky state is updated correctly
    expect(newState).toEqual({
      sticky: {
        top: 100,
        bottom: 200,
      },
    });
  });

  it('should not update sticky state if size is missing', () => {
    const mockState = { sticky: {} };
    const action = {
      type: ReducerActions.setStickyState,
      size: null, // Missing size
    };

    // Get the reducer pushed into stateReducers
    const reducer = mockHooks.stateReducers.push.mock.calls[0][0];

    const newState = reducer(mockState, action, {
      sticky: { top: 50 },
    });

    // Check that sticky state remains unchanged
    expect(newState).toEqual(mockState);
  });
});
