import transformProps from './transformProps';
import { formatLabel } from './utils'; // Import any other utility functions as needed

jest.mock('./utils', () => ({
  formatLabel: jest.fn((input) => input), // Mock formatLabel for testing
  tokenizeToNumericArray: jest.fn((input) => Array.isArray(input) ? input.map(Number) : []),
  tokenizeToStringArray: jest.fn((input) => Array.isArray(input) ? input : [])
}));

describe('transformProps', () => {
  const defaultProps = {
    width: 500,
    height: 400,
    annotationData: [],
    datasource: {
      metrics: [{ metric_name: 'metric1', d3format: '.2f' }],
      verboseMap: {}
    },
    formData: {
      metric: 'metric1',
      vizType: 'bar',
      numberFormat: null,
      ranges: '',
      rangeLabels: '',
      markerLabels: '',
      markerLines: '',
      markers: '',
      stackedStyle: 'normal',
      y: 'yField',
      x: 'xField',
      // Add other formData fields as necessary
    },
    hooks: {
      onAddFilter: jest.fn(),
      onError: jest.fn(),
    },
    queriesData: [{ data: [{ key: 'value1', y: 10 }, { key: 'value2', y: 20 }] }]
  };

  it('should transform props correctly for bar chart', () => {
    const result = transformProps(defaultProps);

    expect(result.width).toBe(500);
    expect(result.height).toBe(400);
    expect(result.data).toHaveLength(2);
    expect(result.data[0].key).toBe('value1'); // check key transformation
    expect(result.data[1].key).toBe('value2');
    expect(result.numberFormat).toBe('.2f'); // grabbed from datasource
    expect(result.vizType).toBe('bar');
  });

  it('should handle pie chart with correct number format', () => {
    const pieProps = {
      ...defaultProps,
      formData: {
        ...defaultProps.formData,
        vizType: 'pie',
      }
    };

    const result = transformProps(pieProps);

    expect(result.numberFormat).toBe('.2f'); // Should grab number format for pie chart
  });

  it('should handle bullet chart and tokenize ranges', () => {
    const bulletProps = {
      ...defaultProps,
      formData: {
        ...defaultProps.formData,
        vizType: 'bullet',
        ranges: '10, 20',
        rangeLabels: 'Low, Medium, High',
        markerLabels: 'Target',
        markerLines: '15',
        markers: '12'
      }
    };

    const result = transformProps(bulletProps);

    expect(result.ranges).toEqual([10, 20]);
    expect(result.rangeLabels).toEqual(['Low', 'Medium', 'High']);
    expect(result.markerLabels).toEqual(['Target']);
    expect(result.markerLines).toEqual([15]);
    expect(result.markers).toEqual([12]);
  });

  it('should return default values if raw data is empty', () => {
    const emptyDataProps = {
      ...defaultProps,
      queriesData: [{ data: [] }] // No data
    };

    const result = transformProps(emptyDataProps);

    expect(result.data).toEqual([]); // Should return an empty data array
  });

  it('should call onError when provided', () => {
    const errorProps = {
      ...defaultProps,
      hooks: {
        ...defaultProps.hooks,
        onError: jest.fn()
      }
    };

    transformProps(errorProps);

    expect(errorProps.hooks.onError).toHaveBeenCalled();
  });
});
