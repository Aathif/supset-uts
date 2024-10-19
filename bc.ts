import React from 'react';
import { render } from '@testing-library/react';
import { ControlFormRow } from './ControlFormRow';
import { useTheme } from '@superset-ui/core';

// Mocking the `useTheme` hook
jest.mock('@superset-ui/core', () => ({
  useTheme: jest.fn(),
}));

describe('ControlFormRow', () => {
  const mockTheme = {
    gridUnit: 8, // Example gridUnit value for testing
  };

  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue(mockTheme);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders children and applies correct styling', () => {
    const { getByText } = render(
      <ControlFormRow>
        <div>Child 1</div>
        <div>Child 2</div>
      </ControlFormRow>
    );

    // Check that the children are rendered
    expect(getByText('Child 1')).toBeInTheDocument();
    expect(getByText('Child 2')).toBeInTheDocument();

    // Check that the flex container has the correct styles
    const formRow = getByText('Child 1').parentElement;
    expect(formRow).toHaveStyle('display: flex');
    expect(formRow).toHaveStyle('flex-wrap: nowrap');
    expect(formRow).toHaveStyle('margin-bottom: 8px'); // 8 comes from mockTheme.gridUnit
    expect(formRow).toHaveStyle('max-width: 100%');
  });
});
