// Importing the necessary modules
const naturalSort = require('natural-sort'); // Assuming naturalSort is a separate function
const sortAs = require('./path/to/your/module'); // Replace with the correct path

// Unit test for the sortAs function
describe('sortAs', () => {
  it('should sort according to the provided order', () => {
    const order = ['apple', 'banana', 'cherry'];
    const sorter = sortAs(order);
    
    const array = ['cherry', 'banana', 'apple'];
    const sortedArray = array.sort(sorter);
    
    expect(sortedArray).toEqual(['apple', 'banana', 'cherry']);
  });

  it('should sort case-insensitively when not in the original order', () => {
    const order = ['Apple', 'banana', 'Cherry'];
    const sorter = sortAs(order);
    
    const array = ['cherry', 'Banana', 'apple'];
    const sortedArray = array.sort(sorter);
    
    expect(sortedArray).toEqual(['apple', 'Banana', 'cherry']);
  });

  it('should place items not in the order at the end, sorted naturally', () => {
    const order = ['apple', 'banana'];
    const sorter = sortAs(order);
    
    const array = ['cherry', 'banana', 'apple', 'date'];
    const sortedArray = array.sort(sorter);
    
    expect(sortedArray).toEqual(['apple', 'banana', 'cherry', 'date']);
  });

  it('should handle when no elements are in the order and fallback to natural sort', () => {
    const order = [];
    const sorter = sortAs(order);
    
    const array = ['cherry', 'banana', 'apple'];
    const sortedArray = array.sort(sorter);
    
    expect(sortedArray).toEqual(['apple', 'banana', 'cherry']);
  });

  it('should return 0 if both elements are the same and are not in the order', () => {
    const order = ['apple', 'banana'];
    const sorter = sortAs(order);
    
    const result = sorter('date', 'date');
    
    expect(result).toBe(0);
  });
});
