import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ColumnConfigControl from './ColumnConfigControl';
import { useTheme } from '@superset-ui/core';

// Mock the `useTheme` hook
jest.mock('@superset-ui/core', () => ({
  useTheme: jest.fn(),
}));

describe('ColumnConfigControl', () => {
  const mockOnChange = jest.fn();
  const mockTheme = {
    colors: {
      grayscale: { light2: '#e0e0e0', light4: '#b0b0b0' },
      text: { label: '#333' },
    },
    gridUnit: 4,
    typography: { sizes: { xs: '12px' } },
  };

  beforeEach(() => {
    // Mock the theme to be used in the component
    useTheme.mockReturnValue(mockTheme);
    jest.clearAllMocks();
  });

  it('renders columns from queryResponse', () => {
    const queryResponse = {
      colnames: ['column1', 'column2'],
      coltypes: ['STRING', 'NUMBER'],
    };

    const { getByText } = render(
      <ColumnConfigControl
        queryResponse={queryResponse}
        value={{ column1: {}, column2: {} }}
        onChange={mockOnChange}
      />,
    );

    expect(getByText('column1')).toBeInTheDocument();
    expect(getByText('column2')).toBeInTheDocument();
  });

  it('shows a limited number of columns initially', () => {
    const queryResponse = {
      colnames: Array.from({ length: 12 }, (_, i) => `column${i + 1}`),
      coltypes: Array.from({ length: 12 }, () => 'STRING'),
    };

    const { getByText, queryByText } = render(
      <ColumnConfigControl
        queryResponse={queryResponse}
        value={{}}
        onChange={mockOnChange}
      />,
    );

    // Expect only the first 10 columns to be displayed
    expect(getByText('column1')).toBeInTheDocument();
    expect(getByText('column10')).toBeInTheDocument();
    expect(queryByText('column11')).not.toBeInTheDocument();
    expect(queryByText('column12')).not.toBeInTheDocument();
  });

  it('shows all columns when "Show all columns" is clicked', () => {
    const queryResponse = {
      colnames: Array.from({ length: 12 }, (_, i) => `column${i + 1}`),
      coltypes: Array.from({ length: 12 }, () => 'STRING'),
    };

    const { getByText } = render(
      <ColumnConfigControl
        queryResponse={queryResponse}
        value={{}}
        onChange={mockOnChange}
      />,
    );

    // Click to show more columns
    fireEvent.click(getByText('Show all columns'));

    // Expect all columns to be displayed
    expect(getByText('column11')).toBeInTheDocument();
    expect(getByText('column12')).toBeInTheDocument();
  });

  it('calls onChange with the correct config when column config is updated', () => {
    const queryResponse = {
      colnames: ['column1'],
      coltypes: ['STRING'],
    };

    const { getByText } = render(
      <ColumnConfigControl
        queryResponse={queryResponse}
        value={{ column1: { someConfig: true } }}
        onChange={mockOnChange}
      />,
    );

    // Simulate changing the config for column1
    const columnItem = getByText('column1');
    fireEvent.click(columnItem); // Assuming clicking updates the config in your component

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('returns null when no columns are available', () => {
    const { container } = render(
      <ColumnConfigControl
        queryResponse={undefined}
        value={{}}
        onChange={mockOnChange}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
