import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Legend, { LegendProps } from './Legend';
import { formatNumber, styled } from '@superset-ui/core';

jest.mock('@superset-ui/core', () => ({
  formatNumber: jest.fn().mockImplementation((format, value) => value.toString()),
  styled: jest.fn((component) => component),
}));

describe('Legend Component', () => {
  const mockToggleCategory = jest.fn();
  const mockShowSingleCategory = jest.fn();

  const defaultProps: LegendProps = {
    format: '0.2f',
    categories: {
      category1: { enabled: true, color: [255, 0, 0] },
      category2: { enabled: false, color: [0, 255, 0] },
    },
    toggleCategory: mockToggleCategory,
    showSingleCategory: mockShowSingleCategory,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with categories', () => {
    render(<Legend {...defaultProps} />);
    expect(screen.getByText(/category1/i)).toBeInTheDocument();
    expect(screen.getByText(/category2/i)).toBeInTheDocument();
  });

  it('does not render when there are no categories', () => {
    const { container } = render(<Legend {...defaultProps} categories={{}} />);
    expect(container.firstChild).toBeNull();
  });

  it('calls toggleCategory when a category is clicked', () => {
    render(<Legend {...defaultProps} />);
    const category1 = screen.getByText(/category1/i);
    fireEvent.click(category1);
    expect(mockToggleCategory).toHaveBeenCalledWith('category1');
  });

  it('calls showSingleCategory when a category is double-clicked', () => {
    render(<Legend {...defaultProps} />);
    const category1 = screen.getByText(/category1/i);
    fireEvent.doubleClick(category1);
    expect(mockShowSingleCategory).toHaveBeenCalledWith('category1');
  });

  it('applies correct styles based on position prop', () => {
    const { rerender } = render(<Legend {...defaultProps} position="tl" />);
    let legend = screen.getByRole('list').parentElement;
    expect(legend).toHaveStyle({ top: '0px', left: '10px' });

    rerender(<Legend {...defaultProps} position="br" />);
    legend = screen.getByRole('list').parentElement;
    expect(legend).toHaveStyle({ bottom: '0px', right: '10px' });
  });
});
