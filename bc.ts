import { tokenizeToNumericArray } from './path-to-your-function'; // Adjust the import path

jest.mock('@superset-ui/core', () => ({
  validateNumber: jest.fn(),
}));

describe('tokenizeToNumericArray', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null for null input', () => {
    expect(tokenizeToNumericArray(null)).toBeNull();
  });

  it('should return null for undefined input', () => {
    expect(tokenizeToNumericArray(undefined)).toBeNull();
  });

  it('should return null for empty string input', () => {
    expect(tokenizeToNumericArray('')).toBeNull();
  });

  it('should return null for string with only whitespace', () => {
    expect(tokenizeToNumericArray('   ')).toBeNull();
  });

  it('should return an array of numbers for valid numeric input', () => {
    const mockValidateNumber = jest.requireMock('@superset-ui/core').validateNumber;
    mockValidateNumber.mockReturnValue(false);

    expect(tokenizeToNumericArray('1,2,3.5')).toEqual([1, 2, 3.5]);
  });

  it('should throw an error if any token is not numeric', () => {
    const mockValidateNumber = jest.requireMock('@superset-ui/core').validateNumber;
    mockValidateNumber.mockImplementation(token => isNaN(parseFloat(token)));

    expect(() => tokenizeToNumericArray('1,2,a')).toThrow('All values should be numeric');
  });

  it('should handle leading and trailing whitespace in tokens', () => {
    const mockValidateNumber = jest.requireMock('@superset-ui/core').validateNumber;
    mockValidateNumber.mockReturnValue(false);

    expect(tokenizeToNumericArray(' 1 , 2 , 3 ')).toEqual([1, 2, 3]);
  });

  it('should handle a single numeric token', () => {
    const mockValidateNumber = jest.requireMock('@superset-ui/core').validateNumber;
    mockValidateNumber.mockReturnValue(false);

    expect(tokenizeToNumericArray('42')).toEqual([42]);
  });

  it('should handle a single invalid token', () => {
    const mockValidateNumber = jest.requireMock('@superset-ui/core').validateNumber;
    mockValidateNumber.mockImplementation(token => isNaN(parseFloat(token)));

    expect(() => tokenizeToNumericArray('a')).toThrow('All values should be numeric');
  });
});
