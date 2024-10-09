import { generatePageItems } from './path-to-generatePageItems'; // import your function here

const MINIMAL_PAGE_ITEM_COUNT = 3; // Make sure to define this constant in your tests if it's not imported

describe('generatePageItems', () => {
  it('should throw an error if width is less than the minimal page item count', () => {
    expect(() => generatePageItems(10, 1, MINIMAL_PAGE_ITEM_COUNT - 1)).toThrowError(
      `Must allow at least ${MINIMAL_PAGE_ITEM_COUNT} page items`
    );
  });

  it('should throw an error if width is an even number', () => {
    expect(() => generatePageItems(10, 1, 4)).toThrowError(
      'Must allow odd number of page items'
    );
  });

  it('should return an array of total length if total is less than width', () => {
    const result = generatePageItems(3, 1, 5);
    expect(result).toEqual([0, 1, 2]);
  });

  it('should return correct pagination items when total is greater than width', () => {
    const result = generatePageItems(10, 5, 5);
    expect(result).toEqual([3, 4, 5, 6, 7]); // Example output based on current
  });

  it('should replace non-ending items with placeholders', () => {
    const result = generatePageItems(10, 1, 5);
    expect(result).toEqual([0, 'prev-more', 0, 1, 2]); // Example output with placeholders
  });

  it('should replace the last item with next-more if it does not point to the last total', () => {
    const result = generatePageItems(10, 9, 5);
    expect(result).toEqual([7, 8, 9, 'next-more', 9]); // Example output with next-more
  });

  it('should return the correct items when near the start', () => {
    const result = generatePageItems(10, 2, 5);
    expect(result).toEqual([0, 1, 2, 3, 4]); // Output when current is near the start
  });

  it('should return the correct items when near the end', () => {
    const result = generatePageItems(10, 8, 5);
    expect(result).toEqual([6, 7, 8, 9, 9]); // Output when current is near the end
  });
});
