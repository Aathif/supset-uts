import { formatTooltip } from './path_to_formatTooltip';
import { NumberFormats, getNumberFormatter } from '@superset-ui/core';

// Mock theme and formatters
const mockTheme = {
  typography: {
    sizes: { m: 14 },
    weights: { bold: 700 },
  },
  colors: {
    grayscale: { base: '#000000' },
  },
};

const primaryValueFormatter = jest.fn(value => `Primary: ${value}`);
const secondaryValueFormatter = jest.fn(value => `Secondary: ${value}`);
const percentFormatter = jest.fn(value => `${(value * 100).toFixed(2)}%`);

jest.mock('@superset-ui/core', () => ({
  NumberFormats: {
    PERCENT_2_POINT: '0.00%',
  },
  getNumberFormatter: jest.fn(() => percentFormatter),
}));

describe('formatTooltip', () => {
  const params = {
    data: {
      value: 100,
      secondaryValue: 50,
      name: 'NodeName',
    },
    treePathInfo: [
      { name: 'Root', dataIndex: 0, value: 500 },
      { name: 'ParentNode', dataIndex: 1, value: 200 },
      { name: 'NodeName', dataIndex: 2, value: 100 },
    ],
  };

  it('should format tooltip with parent node and secondary metric', () => {
    const result = formatTooltip({
      params,
      primaryValueFormatter,
      secondaryValueFormatter,
      colorByCategory: false,
      totalValue: 1000,
      metricLabel: 'Metric',
      secondaryMetricLabel: 'SecondaryMetric',
      theme: mockTheme,
    });

    expect(result).toContain('<div style="font-weight: 700">NodeName</div>');
    expect(result).toContain('<div>10.00% of total</div>');
    expect(result).toContain('<div>50.00% of ParentNode</div>');
    expect(result).toContain('<div>Metric: Primary: 100, SecondaryMetric: Secondary: 50</div>');
    expect(result).toContain('<div>Metric/SecondaryMetric: 50.00%</div>');
  });

  it('should format tooltip without parent node', () => {
    const result = formatTooltip({
      params: {
        ...params,
        treePathInfo: [
          { name: 'Root', dataIndex: 0, value: 500 },
          { name: 'NodeName', dataIndex: 1, value: 100 },
        ],
      },
      primaryValueFormatter,
      secondaryValueFormatter,
      colorByCategory: false,
      totalValue: 1000,
      metricLabel: 'Metric',
      secondaryMetricLabel: 'SecondaryMetric',
      theme: mockTheme,
    });

    expect(result).not.toContain('of ParentNode');
    expect(result).toContain('<div>Metric: Primary: 100, SecondaryMetric: Secondary: 50</div>');
  });

  it('should format tooltip with color by category', () => {
    const result = formatTooltip({
      params,
      primaryValueFormatter,
      secondaryValueFormatter,
      colorByCategory: true,
      totalValue: 1000,
      metricLabel: 'Metric',
      secondaryMetricLabel: 'SecondaryMetric',
      theme: mockTheme,
    });

    expect(result).toContain('<div>Metric: Primary: 100</div>');
    expect(result).not.toContain('SecondaryMetric: Secondary: 50');
    expect(result).not.toContain('Metric/SecondaryMetric: 50.00%');
  });

  it('should escape HTML characters in node name', () => {
    const result = formatTooltip({
      params: {
        ...params,
        data: {
          ...params.data,
          name: 'Node<Name>',
        },
      },
      primaryValueFormatter,
      secondaryValueFormatter,
      colorByCategory: true,
      totalValue: 1000,
      metricLabel: 'Metric',
      secondaryMetricLabel: 'SecondaryMetric',
      theme: mockTheme,
    });

    expect(result).toContain('<div style="font-weight: 700">Node&lt;Name&gt;</div>');
  });
});
