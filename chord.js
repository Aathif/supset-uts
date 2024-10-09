import React from 'react';
import { render, screen } from '@testing-library/react';
import Chord from './Chord';
import { getNumberFormatter, CategoricalColorNamespace } from '@superset-ui/core';

// Mock D3
jest.mock('d3', () => ({
  select: jest.fn(() => ({
    classed: jest.fn().mockReturnThis(),
    append: jest.fn().mockReturnThis(),
    attr: jest.fn().mockReturnThis(),
    style: jest.fn().mockReturnThis(),
    on: jest.fn().mockReturnThis(),
    data: jest.fn().mockReturnThis(),
    enter: jest.fn().mockReturnThis(),
    selectAll: jest.fn().mockReturnThis(),
    filter: jest.fn().mockReturnThis(),
    remove: jest.fn().mockReturnThis(),
    text: jest.fn().mockReturnThis(),
  })),
  svg: {
    arc: jest.fn(() => ({
      innerRadius: jest.fn().mockReturnThis(),
      outerRadius: jest.fn().mockReturnThis(),
    })),
    chord: jest.fn(() => ({
      radius: jest.fn().mockReturnThis(),
    })),
  },
  layout: {
    chord: jest.fn(() => ({
      padding: jest.fn().mockReturnThis(),
      sortSubgroups: jest.fn().mockReturnThis(),
      sortChords: jest.fn().mockReturnThis(),
      matrix: jest.fn().mockReturnThis(),
      groups: [],
      chords: [],
    })),
  },
  descending: jest.fn(),
}));

// Mock @superset-ui/core
jest.mock('@superset-ui/core', () => ({
  getNumberFormatter: jest.fn(),
  CategoricalColorNamespace: {
    getScale: jest.fn(),
  },
}));

describe('Chord Component', () => {
  const mockProps = {
    data: {
      matrix: [
        [11975, 5871, 8916, 2868],
        [1951, 10048, 2060, 6171],
        [8010, 16145, 8090, 8045],
        [1013, 990, 940, 6907],
      ],
      nodes: ['group1', 'group2', 'group3', 'group4'],
    },
    width: 800,
    height: 600,
    colorScheme: 'schemeCategory10',
    numberFormat: '.2f',
    sliceId: 1,
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock the getNumberFormatter return value
    getNumberFormatter.mockReturnValue(jest.fn(val => val.toFixed(2)));

    // Mock the CategoricalColorNamespace.getScale return value
    CategoricalColorNamespace.getScale.mockReturnValue(jest.fn(() => '#000000'));
  });

  test('renders without crashing', () => {
    render(<Chord {...mockProps} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  test('calls d3.select with the correct element', () => {
    render(<Chord {...mockProps} />);
    expect(d3.select).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  test('sets up the SVG with correct dimensions', () => {
    render(<Chord {...mockProps} />);
    const d3SelectMock = d3.select();
    expect(d3SelectMock.append).toHaveBeenCalledWith('svg');
    expect(d3SelectMock.attr).toHaveBeenCalledWith('width', mockProps.width);
    expect(d3SelectMock.attr).toHaveBeenCalledWith('height', mockProps.height);
  });

  test('sets up the chord layout', () => {
    render(<Chord {...mockProps} />);
    expect(d3.layout.chord).toHaveBeenCalled();
    const chordLayoutMock = d3.layout.chord();
    expect(chordLayoutMock.matrix).toHaveBeenCalledWith(mockProps.data.matrix);
  });

  test('creates the correct number of groups', () => {
    render(<Chord {...mockProps} />);
    const d3SelectMock = d3.select();
    expect(d3SelectMock.selectAll).toHaveBeenCalledWith('.group');
    expect(d3SelectMock.data).toHaveBeenCalled();
  });

  test('uses the correct color function', () => {
    render(<Chord {...mockProps} />);
    expect(CategoricalColorNamespace.getScale).toHaveBeenCalledWith(mockProps.colorScheme);
  });

  test('uses the correct number formatter', () => {
    render(<Chord {...mockProps} />);
    expect(getNumberFormatter).toHaveBeenCalledWith(mockProps.numberFormat);
  });
});
