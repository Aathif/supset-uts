import { renderHook, act } from '@testing-library/react-hooks';
import useMountedMemo from './useMountedMemo';

describe('useMountedMemo', () => {
  test('should return undefined on initial render', () => {
    const factory = jest.fn(() => 'test value');
    const { result } = renderHook(() => useMountedMemo(factory));
    
    expect(result.current).toBeUndefined();
    expect(factory).not.toHaveBeenCalled();
  });

  test('should return factory result after mount', () => {
    const factory = jest.fn(() => 'test value');
    const { result } = renderHook(() => useMountedMemo(factory));
    
    expect(result.current).toBeUndefined();
    
    // Force a re-render to simulate mounting
    act(() => {});
    
    expect(result.current).toBe('test value');
    expect(factory).toHaveBeenCalledTimes(1);
  });

  test('should not recompute when dependencies have not changed', () => {
    const factory = jest.fn(() => Math.random());
    const { result, rerender } = renderHook(() => useMountedMemo(factory, []));
    
    act(() => {});  // Force mount
    const initialValue = result.current;
    
    rerender();
    
    expect(result.current).toBe(initialValue);
    expect(factory).toHaveBeenCalledTimes(1);
  });

  test('should recompute when dependencies have changed', () => {
    let dep = 1;
    const factory = jest.fn(() => dep * 2);
    const { result, rerender } = renderHook(() => useMountedMemo(factory, [dep]));
    
    act(() => {});  // Force mount
    expect(result.current).toBe(2);
    
    dep = 2;
    rerender();
    
    expect(result.current).toBe(4);
    expect(factory).toHaveBeenCalledTimes(2);
  });

  test('should recompute when factory function changes', () => {
    const { result, rerender } = renderHook(
      ({ factory }) => useMountedMemo(factory),
      { initialProps: { factory: () => 'initial' } }
    );
    
    act(() => {});  // Force mount
    expect(result.current).toBe('initial');
    
    rerender({ factory: () => 'updated' });
    
    expect(result.current).toBe('updated');
  });
});
