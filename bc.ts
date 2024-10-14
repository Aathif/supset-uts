import * as d3 from 'd3';
import {
  getNumberFormatter,
  CategoricalColorNamespace,
} from '@superset-ui/core';
import Chord from './Chord';

// Mock external dependencies
jest.mock('d3', () => ({
  select: jest.fn(() => ({
    classed: jest.fn().mockReturnThis(),
    append: jest.fn(() => ({
      attr: jest.fn().mockReturnThis(),
      append: jest.fn().mockReturnThis(),
      data: jest.fn(() => ({
        enter: jest.fn(() => ({
          append: jest.fn(() => ({
            attr: jest.fn().mockReturnThis(),
            on: jest.fn().mockReturnThis(),
            style: jest.fn().mockReturnThis(),
            text: jest.fn().mockReturnThis(),
            selectAll: jest.fn().mockReturnThis(),
            append: jest.fn(() => ({
              attr: jest.fn().mockReturnThis(),
            })),
          })),
        })),
      })),
      on: jest.fn().mockReturnThis(),
      selectAll: jest.fn().mockReturnThis(),
    })),
  })),
  svg: {
    arc: jest.fn(() => ({
      innerRadius: jest.fn().mockReturnThis(),
      outerRadius: jest.fn().mockReturnThis(),
    })),
    chord: jest.fn(() => ({
      radius: jest.fn().mockReturnThis(),
    })),
    layout: {
      chord: jest.fn(() => ({
        padding: jest.fn().mockReturnThis(),
        sortSubgroups: jest.fn().mockReturnThis(),
        sortChords: jest.fn().mockReturnThis(),
        matrix: jest.fn(),
      })),
    },
  },
}));

jest.mock('@superset-ui/core', () => ({
  getNumberFormatter: jest.fn(() => jest.fn(value => `${value}`)),
  CategoricalColorNamespace: {
    getScale: jest.fn(() => jest.fn(() => 'color')),
  },
}));

describe('Chord component', () => {
  const props = {
    data: {
      nodes: ['A', 'B', 'C'],
      matrix: [
        [0, 1, 2],
        [1, 0, 3],
        [2, 3, 0],
      ],
    },
    width: 500,
    height: 500,
    numberFormat: '0,0',
    colorScheme: 'scheme1',
    sliceId: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the chord diagram with correct props', () => {
    const element = document.createElement('div');

    // Call the Chord function
    Chord(element, props);

    // Test d3 selection and classed setup
    expect(d3.select).toHaveBeenCalledWith(element);
    expect(d3.select(element).classed).toHaveBeenCalledWith(
      'superset-legacy-chart-chord',
      true,
    );

    // Test d3 arc and layout
    expect(d3.svg.arc).toHaveBeenCalled();
    expect(d3.svg.arc().innerRadius).toHaveBeenCalled();
    expect(d3.svg.arc().outerRadius).toHaveBeenCalled();

    // Test matrix layout setup
    expect(d3.svg.layout.chord().matrix).toHaveBeenCalledWith(props.data.matrix);

    // Ensure color function is called correctly
    expect(CategoricalColorNamespace.getScale).toHaveBeenCalledWith(
      props.colorScheme,
    );
  });

  it('should handle mouseover events on groups', () => {
    const element = document.createElement('div');

    Chord(element, props);

    // Simulate a mouseover event (mocked)
    const mouseOverHandler = d3.select(element).append().on.mock.calls[0][1];
    mouseOverHandler({}, 0);

    expect(d3.select(element).selectAll().classed).toHaveBeenCalled();
  });

  it('should format numbers correctly using getNumberFormatter', () => {
    const element = document.createElement('div');

    Chord(element, props);

    // Check that the number formatter was called for tooltips
    const numberFormatter = getNumberFormatter();
    expect(numberFormatter).toHaveBeenCalledWith(0);
    expect(numberFormatter).toHaveBeenCalledWith(1);
    expect(numberFormatter).toHaveBeenCalledWith(2);
  });
});
