import React from 'react';
import { render } from '@testing-library/react';
import CustomListItem from './CustomListItem';
import { useTheme } from '@superset-ui/core';

// Mock the useTheme hook
jest.mock('@superset-ui/core', () => ({
  useTheme: jest.fn(),
}));

describe('CustomListItem', () => {
  const mockTheme = {
    colors: {
      grayscale: { light4: '#F7F7F7' },
    },
    gridUnit: 4,
  };

  beforeEach(() => {
    useTheme.mockReturnValue(mockTheme);
  });

  it('renders with children', () => {
    const { getByText } = render(
      <CustomListItem selectable={false}>
        Test Item
      </CustomListItem>
    );

    expect(getByText('Test Item')).toBeInTheDocument();
  });

  it('applies correct styles when selectable is true', () => {
    const { container } = render(
      <CustomListItem selectable={true}>
        Selectable Item
      </CustomListItem>
    );

    const listItem = container.firstChild;

    expect(listItem).toHaveStyle(`
      padding: ${mockTheme.gridUnit + 2}px ${mockTheme.gridUnit * 3}px;
    `);
    expect(listItem).toHaveStyle(`
      cursor: pointer;
      background-color: ${mockTheme.colors.grayscale.light4};
    `);
  });

  it('applies correct styles when selectable is false', () => {
    const { container } = render(
      <CustomListItem selectable={false}>
        Non-selectable Item
      </CustomListItem>
    );

    const listItem = container.firstChild;

    expect(listItem).toHaveStyle(`
      padding: ${mockTheme.gridUnit + 2}px ${mockTheme.gridUnit * 3}px;
    `);
    expect(listItem).not.toHaveStyle('cursor: pointer;');
    expect(listItem).not.toHaveStyle(`background-color: ${mockTheme.colors.grayscale.light4};`);
  });

  it('applies border radius styles for first and last items', () => {
    const { container } = render(
      <CustomListItem selectable={false}>
        First Item
      </CustomListItem>
    );

    const firstItem = container.firstChild;
    
    expect(firstItem).toHaveStyle(`border-top-left-radius: ${mockTheme.gridUnit}px`);
    expect(firstItem).toHaveStyle(`border-top-right-radius: ${mockTheme.gridUnit}px`);

    const { container: lastContainer } = render(
      <CustomListItem selectable={false}>
        Last Item
      </CustomListItem>
    );

    const lastItem = lastContainer.firstChild;

    expect(lastItem).toHaveStyle(`border-bottom-left-radius: ${mockTheme.gridUnit}px`);
    expect(lastItem).toHaveStyle(`border-bottom-right-radius: ${mockTheme.gridUnit}px`);
  });
});
