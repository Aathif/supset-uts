import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@superset-ui/core';
import { useTheme } from 'styled-components';
import ControlFormRow from './ControlFormRow';

// Mock useTheme to provide the theme gridUnit
jest.mock('styled-components', () => ({
  useTheme: jest.fn(),
}));

describe('ControlFormRow', () => {
  beforeEach(() => {
    // Mock the theme to return a gridUnit of 10
    useTheme.mockReturnValue({ gridUnit: 10 });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders its children', () => {
    const { getByText } = render(
      <ControlFormRow>
        <div>Test Child 1</div>
        <div>Test Child 2</div>
      </ControlFormRow>
    );

    expect(getByText('Test Child 1')).toBeInTheDocument();
    expect(getByText('Test Child 2')).toBeInTheDocument();
  });

  it('applies the correct styles', () => {
    const { container } = render(
      <ControlFormRow>
        <div>Test Child</div>
      </ControlFormRow>
    );

    const rowDiv = container.firstChild;
    expect(rowDiv).toHaveStyle(`
      display: flex;
      flex-wrap: nowrap;
      margin-bottom: 10px;
      max-width: 100%;
    `);
  });
});
