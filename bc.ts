import { renderHook, act } from '@testing-library/react-hooks';
import { useTabId } from './path-to-your-useTabId'; // Adjust the import path
import shortid from 'shortid';

// Mocking localStorage and sessionStorage
const mockSetItem = jest.fn();
const mockGetItem = jest.fn();
const mockPostMessage = jest.fn();

const mockBroadcastChannel = {
  postMessage: mockPostMessage,
  onmessage: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  // Mock the localStorage and sessionStorage
  Object.defineProperty(window, 'localStorage', {
    value: {
      setItem: mockSetItem,
      getItem: mockGetItem,
    },
    writable: true,
  });
  Object.defineProperty(window, 'sessionStorage', {
    value: {
      setItem: mockSetItem,
      getItem: mockGetItem,
    },
    writable: true,
  });
  // Mocking the BroadcastChannel
  (global as any).BroadcastChannel = jest.fn().mockImplementation(() => mockBroadcastChannel);
});

describe('useTabId Hook', () => {
  it('should generate a tab ID using shortid when storage is unavailable', () => {
    const { result } = renderHook(() => useTabId());

    expect(result.current).toBeUndefined(); // Initially undefined
    expect(shortid.generate).toHaveBeenCalled(); // Verify shortid is called
  });

  it('should use sessionStorage to get the existing tab ID', () => {
    const existingTabId = 'existingTabId';
    mockGetItem.mockReturnValueOnce(existingTabId); // Mock sessionStorage to return existing ID

    const { result } = renderHook(() => useTabId());

    expect(result.current).toEqual(existingTabId); // Verify the existing tab ID is used
    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'REQUESTING_TAB_ID',
      tabId: existingTabId,
    });
  });

  it('should update tab ID in session and local storage', () => {
    const { result } = renderHook(() => useTabId());

    act(() => {
      // Simulating an update in the tab ID
      mockGetItem.mockReturnValueOnce(null); // Simulate no existing ID
      expect(mockSetItem).toHaveBeenCalledWith('tab_id', expect.any(String)); // Check tab ID is set
      expect(mockSetItem).toHaveBeenCalledWith('last_tab_id', expect.any(String)); // Check last tab ID is set
    });
  });

  it('should handle broadcast messages for tab ID', () => {
    const { result } = renderHook(() => useTabId());
    const tabId = 'someTabId';
    act(() => {
      mockBroadcastChannel.onmessage({
        tabId: 'anotherTabId',
        type: 'REQUESTING_TAB_ID',
      });
    });

    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'TAB_ID_DENIED',
      tabId: 'anotherTabId',
    });

    act(() => {
      mockBroadcastChannel.onmessage({
        tabId: 'someTabId',
        type: 'TAB_ID_DENIED',
      });
    });

    expect(mockSetItem).toHaveBeenCalled(); // Check that tab ID is updated again
  });
});
