import { renderHook, act } from '@testing-library/react-hooks';
import { useAsyncState } from './path-to-useAsyncState'; // import your hook here
import { useAsyncDebounce } from 'some-debounce-library'; // mock the debounce function

jest.mock('some-debounce-library', () => ({
  useAsyncDebounce: jest.fn((callback, wait) => {
    return jest.fn((newValue) => setTimeout(() => callback(newValue), wait));
  }),
}));

describe('useAsyncState', () => {
  it('should initialize with the initial value', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useAsyncState('initial', callback));

    // Initial value should be set
    expect(result.current[0]).toBe('initial');
  });

  it('should update state and call the callback with debounce', async () => {
    const callback = jest.fn();
    const wait = 100;
    const { result } = renderHook(() => useAsyncState('initial', callback, wait));

    // Act to update the value
    act(() => {
      result.current[1]('new value'); // Calling setBoth('new value')
    });

    // State should update immediately
    expect(result.current[0]).toBe('new value');

    // Callback should not have been called yet (debounced)
    expect(callback).not.toHaveBeenCalled();

    // Fast forward the time to pass debounce delay
    jest.advanceTimersByTime(wait);

    // Now callback should be called
    expect(callback).toHaveBeenCalledWith('new value');
  });

  it('should handle updates to the initial value', () => {
    const callback = jest.fn();
    const { result, rerender } = renderHook(
      ({ initial }) => useAsyncState(initial, callback),
      {
        initialProps: { initial: 'initial' },
      }
    );

    // Initially the value should be the initial one
    expect(result.current[0]).toBe('initial');

    // Rerender with a new initial value
    rerender({ initial: 'updated initial' });

    // State should update to the new initial value
    expect(result.current[0]).toBe('updated initial');
  });

  it('should not update the callback during debounce', () => {
    const callback = jest.fn();
    const wait = 200;
    const { result } = renderHook(() => useAsyncState('initial', callback, wait));

    act(() => {
      result.current[1]('new value');
      result.current[1]('newer value');
    });

    // State should reflect the latest value
    expect(result.current[0]).toBe('newer value');

    // Fast forward time
    jest.advanceTimersByTime(wait);

    // Callback should be called with the latest value only
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('newer value');
  });
});
