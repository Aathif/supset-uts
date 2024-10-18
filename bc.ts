import vm from 'vm';
import sandboxedEval from './sandboxedEval';
import _ from 'underscore';
import * as d3array from 'd3-array';
import * as colors from './colors';

// Mocking the external dependencies like `d3array` and `colors`
jest.mock('underscore', () => ({
  map: jest.fn(),
}));

jest.mock('d3-array', () => ({
  mean: jest.fn(),
}));

jest.mock('./colors', () => ({
  red: '#ff0000',
}));

describe('sandboxedEval', () => {
  const GLOBAL_CONTEXT = {
    console,
    _,
    colors,
    d3array,
  };

  test('executes simple code correctly', () => {
    const code = '1 + 2';
    const result = sandboxedEval(code);
    
    expect(result).toBe(3);
  });

  test('executes code with context', () => {
    const code = 'a + b';
    const context = { a: 5, b: 10 };
    const result = sandboxedEval(code, context);
    
    expect(result).toBe(15);
  });

  test('uses global context functions like underscore', () => {
    const code = '_.map([1, 2, 3], n => n * 2)';
    _.map.mockReturnValue([2, 4, 6]); // Mock the underscore map function
    const result = sandboxedEval(code);

    expect(result).toEqual([2, 4, 6]);
    expect(_.map).toHaveBeenCalledWith([1, 2, 3], expect.any(Function));
  });

  test('uses global context libraries like d3-array', () => {
    const code = 'd3array.mean([10, 20, 30])';
    d3array.mean.mockReturnValue(20); // Mock the d3-array mean function
    const result = sandboxedEval(code);

    expect(result).toBe(20);
    expect(d3array.mean).toHaveBeenCalledWith([10, 20, 30]);
  });

  test('uses global context for custom libraries like colors', () => {
    const code = 'colors.red';
    const result = sandboxedEval(code);

    expect(result).toBe('#ff0000');
  });

  test('returns a function on error and the function returns the error when called', () => {
    const code = 'unknownVariable + 5'; // This will throw an error since `unknownVariable` is not defined
    const result = sandboxedEval(code);

    expect(typeof result).toBe('function');
    expect(result()).toBeInstanceOf(Error);
  });

  test('executes code with custom script options', () => {
    const code = '1 + 2';
    const opts = { timeout: 1000 }; // Custom vm script options
    const result = sandboxedEval(code, {}, opts);
    
    expect(result).toBe(3);
  });
});
