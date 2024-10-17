// postForm.js
export function postForm(url, payload, target = '_blank') {
  if (!url) {
    return;
  }
  const hiddenForm = document.createElement('form');
  hiddenForm.action = url;
  hiddenForm.method = 'POST';
  hiddenForm.target = target;
  const token = document.createElement('input');
  token.type = 'hidden';
  token.name = 'csrf_token';
  token.value = (document.getElementById('csrf_token') || {}).value;
  hiddenForm.appendChild(token);
  const data = document.createElement('input');
  data.type = 'hidden';
  data.name = 'form_data';
  data.value = safeStringify(payload);
  hiddenForm.appendChild(data);

  document.body.appendChild(hiddenForm);
  hiddenForm.submit();
  document.body.removeChild(hiddenForm);
}

// postForm.test.js
import { postForm } from './postForm'; // Adjust the import path
import { safeStringify } from './utils'; // Adjust the import path for safeStringify

jest.mock('./utils'); // Mocking the safeStringify function

describe('postForm', () => {
  beforeEach(() => {
    // Clear the document body before each test
    document.body.innerHTML = '';
    // Mocking the CSRF token element
    document.body.innerHTML += '<input type="hidden" id="csrf_token" value="mock_csrf_token" />';
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear any mocks after each test
  });

  it('should do nothing if the URL is not provided', () => {
    postForm('', { test: 'data' });
    expect(document.body.childNodes.length).toBe(0); // No form should be added
  });

  it('should create a form with the correct attributes and data', () => {
    const payload = { key: 'value' };
    safeStringify.mockReturnValueOnce(JSON.stringify(payload)); // Mocking safeStringify return value

    postForm('http://example.com', payload);

    const form = document.body.querySelector('form');
    expect(form).toBeTruthy();
    expect(form.action).toBe('http://example.com');
    expect(form.method).toBe('POST');
    expect(form.target).toBe('_blank');

    // Check for CSRF token input
    const csrfInput = form.querySelector('input[name="csrf_token"]');
    expect(csrfInput).toBeTruthy();
    expect(csrfInput.value).toBe('mock_csrf_token');

    // Check for form_data input
    const dataInput = form.querySelector('input[name="form_data"]');
    expect(dataInput).toBeTruthy();
    expect(dataInput.value).toBe(JSON.stringify(payload));
  });

  it('should submit the form and remove it from the DOM', () => {
    const payload = { key: 'value' };
    safeStringify.mockReturnValueOnce(JSON.stringify(payload));

    postForm('http://example.com', payload);

    const form = document.body.querySelector('form');
    expect(form).toBeTruthy();
    
    // Mock form submission
    const submitSpy = jest.spyOn(HTMLFormElement.prototype, 'submit');
    form.submit();

    expect(submitSpy).toHaveBeenCalled(); // Check that submit was called
    expect(document.body.childNodes.length).toBe(0); // Form should be removed from the DOM
  });
});
