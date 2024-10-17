import { renderHook, act } from '@testing-library/react-hooks';
import { useResizeDetectorByObserver } from './useResizeDetectorByObserver';

describe('useResizeDetectorByObserver', () => {
  it('should return default width and height when no resizing happens', () => {
    const { result } = renderHook(() => useResizeDetectorByObserver());

    expect(result.current.width).toBeUndefined();
    expect(result.current.height).toBeUndefined();
  });

  it('should update width and height when resize happens', () => {
    // Mock the DOM element and its boundingClientRect method
    const mockRef = {
      current: {
        getBoundingClientRect: jest.fn().mockReturnValue({ width: 100, height: 200 }),
      },
    };

    const { result } = renderHook(() => useResizeDetectorByObserver());

    // Mock useRef to use the custom mockRef
    result.current.ref.current = mockRef.current;

    // Trigger the resize
    act(() => {
      result.current.ref.current.getBoundingClientRect();
      result.current.observerRef.onResize();
    });

    expect(result.current.width).toBe(100);
    expect(result.current.height).toBe(200);
  });

  it('should debounce onResize and update the size only after 300ms', () => {
    jest.useFakeTimers(); // Use Jest's fake timers for debouncing

    const mockRef = {
      current: {
        getBoundingClientRect: jest.fn().mockReturnValue({ width: 150, height: 250 }),
      },
    };

    const { result } = renderHook(() => useResizeDetectorByObserver());

    result.current.ref.current = mockRef.current;

    // Trigger onResize
    act(() => {
      result.current.observerRef.onResize();
      jest.advanceTimersByTime(299); // Advance time by less than debounce period
    });

    // Ensure the width and height are still not updated before debounce time
    expect(result.current.width).toBeUndefined();
    expect(result.current.height).toBeUndefined();

    act(() => {
      jest.advanceTimersByTime(1); // Advance time by 1ms to pass debounce period
    });

    expect(result.current.width).toBe(150);
    expect(result.current.height).toBe(250);
  });
});
