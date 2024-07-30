import getScrollBarSize from './getScrollBarSize';

describe('getScrollBarSize', () => {
  beforeEach(() => {
    jest.resetModules(); // Clear cached module to reset the cache
  });

  it('should return 0 when document is undefined', () => {
    const originalDocument = global.document;
    delete global.document;
    expect(getScrollBarSize()).toBe(0);
    global.document = originalDocument;
  });

  it('should calculate and cache the scrollbar size', () => {
    // Mock the document to simulate browser environment
    document.body.innerHTML = ''; // Reset body

    const div = document.createElement('div');
    div.style.width = '100px';
    div.style.height = '50px';
    div.style.overflow = 'hidden';
    document.body.append(div);

    const scrollbarSize = getScrollBarSize(true);
    expect(scrollbarSize).toBeGreaterThan(0);

    const cachedScrollbarSize = getScrollBarSize();
    expect(cachedScrollbarSize).toBe(scrollbarSize);

    div.remove();
  });

  it('should refresh the scrollbar size when forceRefresh is true', () => {
    // Mock the document to simulate browser environment
    document.body.innerHTML = ''; // Reset body

    const div = document.createElement('div');
    div.style.width = '100px';
    div.style.height = '50px';
    div.style.overflow = 'hidden';
    document.body.append(div);

    const initialScrollbarSize = getScrollBarSize(true);
    expect(initialScrollbarSize).toBeGreaterThan(0);

    // Simulate a change in the scrollbar size
    const newDiv = document.createElement('div');
    newDiv.style.width = '200px';
    newDiv.style.height = '100px';
    newDiv.style.overflow = 'hidden';
    document.body.append(newDiv);

    const refreshedScrollbarSize = getScrollBarSize(true);
    expect(refreshedScrollbarSize).not.toBe(initialScrollbarSize);

    newDiv.remove();
  });

  it('should not recalculate the scrollbar size when it is cached', () => {
    // Mock the document to simulate browser environment
    document.body.innerHTML = ''; // Reset body

    const div = document.createElement('div');
    div.style.width = '100px';
    div.style.height = '50px';
    div.style.overflow = 'hidden';
    document.body.append(div);

    const scrollbarSize = getScrollBarSize(true);
    expect(scrollbarSize).toBeGreaterThan(0);

    const cachedScrollbarSize = getScrollBarSize();
    expect(cachedScrollbarSize).toBe(scrollbarSize);

    div.remove();
  });
});
