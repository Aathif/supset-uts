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
 
