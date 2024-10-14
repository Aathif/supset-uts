import * as d3 from 'd3';
import {
  getNumberFormatter,
  getSequentialSchemeRegistry,
  CategoricalColorNamespace,
} from '@superset-ui/core';
import CountryMap from './CountryMap';
import countries from './countries';

// Mock external dependencies
jest.mock('d3', () => ({
  select: jest.fn(() => ({
    classed: jest.fn().mockReturnThis(),
    selectAll: jest.fn(() => ({
      data: jest.fn(() => ({
        enter: jest.fn(() => ({
          append: jest.fn(() => ({
            attr: jest.fn().mockReturnThis(),
            on: jest.fn().mockReturnThis(),
            style: jest.fn().mockReturnThis(),
          })),
        })),
      })),
    })),
    append: jest.fn(() => ({
      attr: jest.fn().mockReturnThis(),
      style: jest.fn().mockReturnThis(),
      on: jest.fn().mockReturnThis(),
    })),
    html: jest.fn().mockReturnThis(),
  })),
  geo: {
    path: jest.fn(() => ({
      centroid: jest.fn(() => [0, 0]),
      projection: jest.fn().mockReturnThis(),
      bounds: jest.fn(() => [
        [0, 0],
        [100, 100],
      ]),
    })),
    mercator: jest.fn(() => ({
      scale: jest.fn().mockReturnThis(),
      center: jest.fn().mockReturnThis(),
      translate: jest.fn().mockReturnThis(),
    })),
  },
  rgb: jest.fn(() => ({
    darker: jest.fn(() => 'darker-color'),
  })),
  json: jest.fn(),
  extent: jest.fn(),
}));

jest.mock('@superset-ui/core', () => ({
  getNumberFormatter: jest.fn(() => jest.fn(value => `${value}`)),
  getSequentialSchemeRegistry: jest.fn(() => ({
    get: jest.fn(() => ({
      createLinearScale: jest.fn(() => jest.fn(() => 'linear-color')),
    })),
  })),
  CategoricalColorNamespace: {
    getScale: jest.fn(() => jest.fn(() => 'categorical-color')),
  },
}));

jest.mock('./countries', () => ({
  default: {
    USA: 'url-to-usa-map',
  },
  countryOptions: [['USA', 'United States']],
}));

describe('CountryMap component', () => {
  const props = {
    data: [
      { country_id: 'USA', metric: 100 },
      { country_id: 'CAN', metric: 200 },
    ],
    width: 500,
    height: 400,
    country: 'USA',
    linearColorScheme: 'scheme1',
    colorScheme: 'scheme2',
    numberFormat: '0,0',
    sliceId: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the map and set up the SVG container', () => {
    const element = document.createElement('div');
    d3.json.mockImplementationOnce((url, callback) => {
      callback(null, { features: [] }); // Mock map data
    });

    CountryMap(element, props);

    expect(d3.select).toHaveBeenCalledWith(element);
    expect(d3.select(element).classed).toHaveBeenCalledWith(
      'superset-legacy-chart-country-map',
      true,
    );

    expect(d3.select(element).selectAll('*').remove).toHaveBeenCalled();
    expect(d3.select(element).append).toHaveBeenCalledWith('svg:svg');
  });

  it('should call d3.json to load map data', () => {
    const element = document.createElement('div');
    d3.json.mockImplementationOnce((url, callback) => {
      callback(null, { features: [] });
    });

    CountryMap(element, props);

    expect(d3.json).toHaveBeenCalledWith('url-to-usa-map', expect.any(Function));
  });

  it('should handle map data error gracefully', () => {
    const element = document.createElement('div');
    d3.json.mockImplementationOnce((url, callback) => {
      callback(new Error('Map data failed to load'), null);
    });

    CountryMap(element, props);

    expect(d3.select(element).html).toHaveBeenCalledWith(
      expect.stringContaining('Could not load map data for United States'),
    );
  });

  it('should apply color scale correctly', () => {
    const element = document.createElement('div');
    d3.json.mockImplementationOnce((url, callback) => {
      callback(null, { features: [{ properties: { ISO: 'USA' } }] });
    });

    CountryMap(element, props);

    // Test that the color scale is applied for a country
    const colorScale = CategoricalColorNamespace.getScale();
    expect(colorScale).toHaveBeenCalledWith('USA', props.sliceId);
  });

  it('should handle mouseenter and mouseout events', () => {
    const element = document.createElement('div');
    d3.json.mockImplementationOnce((url, callback) => {
      callback(null, { features: [{ properties: { ISO: 'USA' } }] });
    });

    CountryMap(element, props);

    // Simulate mouseenter event
    const mouseenterHandler = d3.select().selectAll().data().enter().append().on.mock.calls[0][1];
    mouseenterHandler({ properties: { ISO: 'USA' } });

    expect(d3.rgb).toHaveBeenCalledWith('categorical-color');
    expect(d3.select().style).toHaveBeenCalledWith('fill', 'darker-color');
  });
});
