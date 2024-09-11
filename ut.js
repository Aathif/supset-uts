// getScrollBarSize.test.js
import getScrollBarSize from './getScrollBarSize';

describe('getScrollBarSize', () => {
    let originalBodyAppend;
    let clientWidthGetter;

    beforeEach(() => {
        // Save original methods before mocking
        originalBodyAppend = document.body.append;
        clientWidthGetter = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth').get;

        // Mock body.append to prevent actual DOM manipulation
        document.body.append = jest.fn();

        // Mock clientWidth properties for inner and outer divs
        Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
            get() {
                if (this.style.overflow === 'scroll') {
                    return 100; // Assume scrollbar size
                }
                return 120; // Assume outer div width
            },
        });
    });

    afterEach(() => {
        // Restore original methods after each test
        document.body.append = originalBodyAppend;
        Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
            get: clientWidthGetter,
        });
    });

    test('should return scrollbar size', () => {
        const size = getScrollBarSize();
        expect(size).toBe(20); // Example value: 120 - 100 = 20
    });

    test('should return cached size if already calculated', () => {
        // Call the function first to cache the value
        getScrollBarSize();
        // Call the function again and ensure the cached value is returned
        const size = getScrollBarSize();
        expect(size).toBe(20);
    });

    test('should force refresh scrollbar size when forceRefresh is true', () => {
        getScrollBarSize();
        const sizeBefore = getScrollBarSize();

        // Mock a new scrollbar size
        Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
            get() {
                if (this.style.overflow === 'scroll') {
                    return 90;
                }
                return 120;
            },
        });

        const sizeAfter = getScrollBarSize(true); // Force refresh
        expect(sizeBefore).toBe(20); // Cached size
        expect(sizeAfter).toBe(30);  // New size: 120 - 90 = 30
    });
});
