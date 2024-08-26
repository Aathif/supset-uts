import { getExploreLongUrl } from './path-to-your-function'; // Adjust the import path
import URI from 'urijs';
import { safeStringify } from 'json-stringify-safe'; // Adjust the import path

jest.mock('urijs', () => {
  return jest.fn().mockImplementation(() => ({
    search: jest.fn().mockImplementation(() => ({
      toString: jest.fn(() => 'http://example.com?foo=bar')
    })),
    directory: jest.fn().mockImplementation(() => ({
      search: jest.fn().mockImplementation(() => ({
        toString: jest.fn(() => 'http://example.com/dir?foo=bar')
      }))
    }))
  }));
});

jest.mock('json-stringify-safe', () => ({
  safeStringify: jest.fn().mockImplementation((obj) => JSON.stringify(obj))
}));

describe('getExploreLongUrl', () => {
  it('should return a correct URL with basic parameters', () => {
    const formData = { datasource: 'ds1', viz_type: 'line_chart' };
    const url = getExploreLongUrl(formData, 'standalone');
    expect(url).toContain('form_data={"datasource":"ds1","viz_type":"line_chart"}');
    expect(url).toContain('standalone=true');
  });

  it('should include extraSearch parameters in the URL', () => {
    const formData = { datasource: 'ds1', viz_type: 'line_chart' };
    const extraSearch = { filter: 'active' };
    const url = getExploreLongUrl(formData, 'standalone', true, extraSearch);
    expect(url).toContain('filter=active');
  });

  it('should handle URL overflow by truncating formData', () => {
    const formData = { datasource: 'ds1', viz_type: 'line_chart', large_field: 'x'.repeat(9000) };
    const url = getExploreLongUrl(formData, 'standalone', false);
    expect(url).toContain('URL_IS_TOO_LONG_TO_SHARE');
  });

  it('should return null if formData is missing datasource', () => {
    const formData = { viz_type: 'line_chart' };
    const url = getExploreLongUrl(formData, 'standalone');
    expect(url).toBeNull();
  });

  it('should return null if formData is null', () => {
    const url = getExploreLongUrl(null, 'standalone');
    expect(url).toBeNull();
  });

  it('should handle no extraSearch parameters', () => {
    const formData = { datasource: 'ds1', viz_type: 'line_chart' };
    const url = getExploreLongUrl(formData, 'standalone');
    expect(url).not.toContain('URL_IS_TOO_LONG_TO_SHARE');
  });
});
