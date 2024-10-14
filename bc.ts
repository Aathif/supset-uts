import transformProps from './transformProps';

describe('transformProps', () => {
  it('should transform the chart properties correctly', () => {
    // Define a sample chartProps input
    const chartProps = {
      formData: {
        groupby: ['group1', 'group2'],
        liftvaluePrecision: '2',
        metrics: ['metric1', { label: 'metric2' }],
        pvaluePrecision: '3',
        significanceLevel: 0.05,
      },
      queriesData: [
        {
          data: [
            { group1: 'A', group2: 'B', metric1: 1.2, metric2: 2.4 },
            { group1: 'C', group2: 'D', metric1: 1.5, metric2: 3.1 },
          ],
        },
      ],
    };

    // Call transformProps with the sample input
    const result = transformProps(chartProps);

    // Define the expected output
    const expectedOutput = {
      alpha: 0.05,
      data: [
        { group1: 'A', group2: 'B', metric1: 1.2, metric2: 2.4 },
        { group1: 'C', group2: 'D', metric1: 1.5, metric2: 3.1 },
      ],
      groups: ['group1', 'group2'],
      liftValPrec: 2,
      metrics: ['metric1', 'metric2'],
      pValPrec: 3,
    };

    // Assert that the output matches the expected result
    expect(result).toEqual(expectedOutput);
  });

  it('should handle empty or missing formData and queriesData', () => {
    const chartProps = {
      formData: {
        groupby: [],
        liftvaluePrecision: '',
        metrics: [],
        pvaluePrecision: '',
        significanceLevel: null,
      },
      queriesData: [
        {
          data: [],
        },
      ],
    };

    const result = transformProps(chartProps);

    const expectedOutput = {
      alpha: null,
      data: [],
      groups: [],
      liftValPrec: NaN,
      metrics: [],
      pValPrec: NaN,
    };

    expect(result).toEqual(expectedOutput);
  });

  it('should correctly convert string metrics to labels when needed', () => {
    const chartProps = {
      formData: {
        groupby: ['group1'],
        liftvaluePrecision: '1',
        metrics: [{ label: 'metric1' }],
        pvaluePrecision: '1',
        significanceLevel: 0.1,
      },
      queriesData: [
        {
          data: [{ group1: 'A', metric1: 5 }],
        },
      ],
    };

    const result = transformProps(chartProps);

    const expectedOutput = {
      alpha: 0.1,
      data: [{ group1: 'A', metric1: 5 }],
      groups: ['group1'],
      liftValPrec: 1,
      metrics: ['metric1'],
      pValPrec: 1,
    };

    expect(result).toEqual(expectedOutput);
  });
});
