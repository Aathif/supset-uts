import transformProps from './transformProps';
import { ChartProps } from '@superset-ui/core';
import { WordCloudProps, WordCloudFormData } from './types'; // Adjust the path as needed

describe('transformProps', () => {
  it('should transform chart properties correctly', () => {
    const chartProps: ChartProps = {
      width: 800,
      height: 600,
      formData: {
        encoding: 'UTF-8',
        rotation: 45,
        sliceId: 123,
        colorScheme: 'default',
      } as WordCloudFormData,
      queriesData: [
        {
          data: [
            { text: 'word1', value: 10 },
            { text: 'word2', value: 20 },
          ],
        },
      ],
    };

    const expectedProps: WordCloudProps = {
      data: [
        { text: 'word1', value: 10 },
        { text: 'word2', value: 20 },
      ],
      encoding: 'UTF-8',
      height: 600,
      rotation: 45,
      width: 800,
      sliceId: 123,
      colorScheme: 'default',
    };

    expect(transformProps(chartProps)).toEqual(expectedProps);
  });

  it('should handle missing colorScheme', () => {
    const chartProps: ChartProps = {
      width: 800,
      height: 600,
      formData: {
        encoding: 'UTF-8',
        rotation: 45,
        sliceId: 123,
      } as WordCloudFormData,
      queriesData: [
        {
          data: [
            { text: 'word1', value: 10 },
            { text: 'word2', value: 20 },
          ],
        },
      ],
    };

    const expectedProps: WordCloudProps = {
      data: [
        { text: 'word1', value: 10 },
        { text: 'word2', value: 20 },
      ],
      encoding: 'UTF-8',
      height: 600,
      rotation: 45,
      width: 800,
      sliceId: 123,
    };

    expect(transformProps(chartProps)).toEqual(expectedProps);
  });
});
