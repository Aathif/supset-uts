import { getNumberFormatter, NumberFormats, t } from '@superset-ui/core';

// Mocking functions
jest.mock('@superset-ui/core', () => ({
  getNumberFormatter: jest.fn().mockImplementation(() => (value: number) => `${value}%`),
  NumberFormats: {
    PERCENT_2_POINT: '0.00%',
  },
  t: jest.fn().mockImplementation((key: string) => key),
}));

interface TreeNode {
  value: number;
  secondaryValue?: number;
  name?: string;
  [key: string]: any;
}

interface CallbackDataParams {
  data: TreeNode;
  treePathInfo?: {
    name: string;
    dataIndex: number;
    value: number;
  }[];
}

type ValueFormatter = (value: number) => string;

describe('formatTooltip', () => {
  const primaryValueFormatter: ValueFormatter = (value) => `primary ${value}`;
  const secondaryValueFormatter: ValueFormatter = (value) => `secondary ${value}`;

  const tooltipHtml = jest.fn().mockImplementation((rows, title) => {
    return `${title} - ${JSON.stringify(rows)}`;
  });

  const NULL_STRING = 'N/A';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should format tooltip with parent node and colorByCategory', () => {
    const params = {
      data: { value: 100, secondaryValue: 50, name: 'Node 1' },
      treePathInfo: [
        { name: 'Root', dataIndex: 0, value: 1000 },
        { name: 'Node 1', dataIndex: 1, value: 100 },
      ],
    };
    const result = formatTooltip({
      params,
      primaryValueFormatter,
      secondaryValueFormatter,
      colorByCategory: true,
      totalValue: 1000,
      metricLabel: 'Metric',
      secondaryMetricLabel: 'Secondary Metric',
    });

    expect(result).toContain('Node 1');
    expect(result).toContain('% of total');
    expect(result).toContain('10%');
    expect(result).toContain('Metric');
    expect(result).toContain('primary 100');
    expect(result).toContain('N/A');
    expect(result).toContain('N/A');
  });

  it('should format tooltip without parent node and colorByCategory', () => {
    const params = {
      data: { value: 100, secondaryValue: 50, name: 'Node 1' },
      treePathInfo: [
        { name: 'Root', dataIndex: 0, value: 1000 },
      ],
    };
    const result = formatTooltip({
      params,
      primaryValueFormatter,
      secondaryValueFormatter,
      colorByCategory: false,
      totalValue: 1000,
      metricLabel: 'Metric',
      secondaryMetricLabel: 'Secondary Metric',
    });

    expect(result).toContain('Node 1');
    expect(result).toContain('% of total');
    expect(result).toContain('10%');
    expect(result).toContain('Metric');
    expect(result).toContain('primary 100');
    expect(result).toContain('Secondary Metric');
    expect(result).toContain('secondary 50');
    expect(result).toContain('Metric/Secondary Metric');
    expect(result).toContain('50%');
  });

  it('should handle missing secondaryMetricLabel and secondaryValueFormatter', () => {
    const params = {
      data: { value: 100, secondaryValue: 50, name: 'Node 1' },
      treePathInfo: [
        { name: 'Root', dataIndex: 0, value: 1000 },
        { name: 'Node 1', dataIndex: 1, value: 100 },
      ],
    };
    const result = formatTooltip({
      params,
      primaryValueFormatter,
      secondaryValueFormatter: undefined,
      colorByCategory: false,
      totalValue: 1000,
      metricLabel: 'Metric',
      secondaryMetricLabel: undefined,
    });

    expect(result).toContain('Node 1');
    expect(result).toContain('% of total');
    expect(result).toContain('10%');
    expect(result).toContain('Metric');
    expect(result).toContain('primary 100');
    expect(result).toContain('N/A');
    expect(result).toContain('Metric/N/A');
    expect(result).toContain('NaN%');
  });
});
