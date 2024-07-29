import transformProps from './transformProps';

describe('transformProps', () => {
  it('should transform chartProps correctly', () => {
    const chartProps = {
      width: 800,
      height: 600,
      formData: {
        includeSeries: true,
        linearColorScheme: 'schemeBlues',
        metrics: [{ label: 'metric1' }, { label: 'metric2' }],
        secondaryMetric: { label: 'secondaryMetric' },
        series: 'seriesName',
        showDatatable: true,
      },
      queriesData: [
        {
          data: [
            { x: 1, y: 2 },
            { x: 2, y: 3 },
          ],
        },
      ],
    };

    const expectedTransformedProps = {
      width: 800,
      height: 600,
      data: [
        { x: 1, y: 2 },
        { x: 2, y: 3 },
      ],
      includeSeries: true,
      linearColorScheme: 'schemeBlues',
      metrics: ['metric1', 'metric2'],
      colorMetric: 'secondaryMetric',
      series: 'seriesName',
      showDatatable: true,
    };

    const result = transformProps(chartProps);

    expect(result).toEqual(expectedTransformedProps);
  });

  it('should handle secondaryMetric without a label correctly', () => {
    const chartProps = {
      width: 800,
      height: 600,
      formData: {
        includeSeries: true,
        linearColorScheme: 'schemeBlues',
        metrics: [{ label: 'metric1' }, { label: 'metric2' }],
        secondaryMetric: 'secondaryMetric',
        series: 'seriesName',
        showDatatable: true,
      },
      queriesData: [
        {
          data: [
            { x: 1, y: 2 },
            { x: 2, y: 3 },
          ],
        },
      ],
    };

    const expectedTransformedProps = {
      width: 800,
      height: 600,
      data: [
        { x: 1, y: 2 },
        { x: 2, y: 3 },
      ],
      includeSeries: true,
      linearColorScheme: 'schemeBlues',
      metrics: ['metric1', 'metric2'],
      colorMetric: 'secondaryMetric',
      series: 'seriesName',
      showDatatable: true,
    };

    const result = transformProps(chartProps);

    expect(result).toEqual(expectedTransformedProps);
  });

  it('should handle metrics without labels correctly', () => {
    const chartProps = {
      width: 800,
      height: 600,
      formData: {
        includeSeries: true,
        linearColorScheme: 'schemeBlues',
        metrics: ['metric1', 'metric2'],
        secondaryMetric: { label: 'secondaryMetric' },
        series: 'seriesName',
        showDatatable: true,
      },
      queriesData: [
        {
          data: [
            { x: 1, y: 2 },
            { x: 2, y: 3 },
          ],
        },
      ],
    };

    const expectedTransformedProps = {
      width: 800,
      height: 600,
      data: [
        { x: 1, y: 2 },
        { x: 2, y: 3 },
      ],
      includeSeries: true,
      linearColorScheme: 'schemeBlues',
      metrics: ['metric1', 'metric2'],
      colorMetric: 'secondaryMetric',
      series: 'seriesName',
      showDatatable: true,
    };

    const result = transformProps(chartProps);

    expect(result).toEqual(expectedTransformedProps);
  });
});
