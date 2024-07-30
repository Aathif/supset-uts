import {
  getColtypesMapping,
  getValueFormatter,
  getNumberFormatter,
  getMetricLabel,
  getTimeFormatter,
  getSequentialSchemeRegistry,
  formatSeriesName,
  treeBuilder,
  CategoricalColorNamespace,
  OpacityEnum,
  EChartsCoreOption,
  t,
} from '@superset-ui/core';

// Mocking dependencies
jest.mock('@superset-ui/core', () => ({
  getColtypesMapping: jest.fn(),
  getValueFormatter: jest.fn().mockImplementation(() => (value: number) => `formatted ${value}`),
  getNumberFormatter: jest.fn().mockImplementation(() => (value: number) => `${value}`),
  getMetricLabel: jest.fn().mockImplementation(metric => metric),
  getTimeFormatter: jest.fn().mockImplementation(() => (value: number) => `${value}`),
  getSequentialSchemeRegistry: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockImplementation(() => ({
      createLinearScale: jest.fn().mockImplementation(() => (value: number) => `linear ${value}`),
    })),
  })),
  formatSeriesName: jest.fn().mockImplementation((name, opts) => name),
  treeBuilder: jest.fn().mockImplementation((data, columnLabels, metricLabel, secondaryMetricLabel) => data),
  CategoricalColorNamespace: {
    getScale: jest.fn().mockImplementation(() => (name: string) => name),
  },
  OpacityEnum: {
    SemiTransparent: 0.5,
  },
  t: jest.fn().mockImplementation(key => key),
}));

describe('transformProps', () => {
  const chartProps = {
    formData: {
      groupby: ['col1'],
      columns: ['col2'],
      metric: 'metric1',
      secondaryMetric: 'metric2',
      colorScheme: 'scheme1',
      linearColorScheme: 'linearScheme1',
      labelType: 'KeyValue',
      numberFormat: '.2f',
      currencyFormat: '$',
      dateFormat: 'YYYY-MM-DD',
      showLabels: true,
      showLabelsThreshold: 0.1,
      showTotal: true,
      sliceId: 1,
    },
    height: 600,
    hooks: {
      setDataMask: jest.fn(),
      onContextMenu: jest.fn(),
    },
    filterState: {
      selectedValues: [],
    },
    queriesData: [
      {
        data: [
          { col1: 'value1', col2: 'value2', metric1: 100, metric2: 50 },
        ],
      },
    ],
    width: 800,
    theme: {
      gridUnit: 8,
      colors: {
        grayscale: {
          dark2: '#000000',
        },
      },
    },
    inContextMenu: false,
    emitCrossFilters: jest.fn(),
    datasource: {
      currencyFormats: {},
      columnFormats: {},
    },
  };

  it('should transform chart properties correctly', () => {
    const transformedProps = transformProps(chartProps);

    expect(transformedProps).toMatchObject({
      formData: chartProps.formData,
      width: chartProps.width,
      height: chartProps.height,
      echartOptions: expect.any(Object),
      setDataMask: chartProps.hooks.setDataMask,
      emitCrossFilters: chartProps.emitCrossFilters,
      labelMap: expect.any(Object),
      groupby: chartProps.formData.groupby,
      selectedValues: chartProps.filterState.selectedValues,
      onContextMenu: chartProps.hooks.onContextMenu,
      refs: expect.any(Object),
      coltypeMapping: expect.any(Object),
    });

    expect(transformedProps.echartOptions).toMatchObject({
      grid: expect.any(Object),
      tooltip: expect.any(Object),
      series: expect.any(Array),
      graphic: expect.any(Object),
    });

    expect(transformedProps.echartOptions.series[0]).toMatchObject({
      type: 'sunburst',
      emphasis: expect.any(Object),
      label: expect.any(Object),
      radius: expect.any(Array),
      data: expect.any(Array),
    });
  });

  it('should handle missing secondaryMetric', () => {
    const chartPropsNoSecondaryMetric = {
      ...chartProps,
      formData: {
        ...chartProps.formData,
        secondaryMetric: '',
      },
    };
    const transformedProps = transformProps(chartPropsNoSecondaryMetric);

    expect(transformedProps.echartOptions.tooltip).toMatchObject({
      formatter: expect.any(Function),
    });
  });

  it('should handle missing data', () => {
    const chartPropsNoData = {
      ...chartProps,
      queriesData: [{ data: [] }],
    };
    const transformedProps = transformProps(chartPropsNoData);

    expect(transformedProps.echartOptions.series[0].data).toEqual([]);
  });

  it('should handle showTotal', () => {
    const transformedProps = transformProps(chartProps);
    expect(transformedProps.echartOptions.graphic).toMatchObject({
      type: 'text',
      top: 'center',
      left: 'center',
      style: {
        text: expect.stringContaining('Total: formatted 100'),
        fontSize: 16,
        fontWeight: 'bold',
      },
      z: 10,
    });
  });

  it('should handle minShowLabelAngle', () => {
    const transformedProps = transformProps(chartProps);
    expect(transformedProps.echartOptions.series[0].label.minAngle).toBe(36);
  });
});
