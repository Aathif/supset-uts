import transformProps from './transformProps';
import { ChartProps } from '@superset-ui/core';

describe('transformProps', () => {
  it('should transform chart properties correctly', () => {
    const chartProps: ChartProps = {
      datasource: {
        columnFormats: {},
        verboseMap: {},
      },
      height: 600,
      hooks: {
        onAddFilter: jest.fn(),
        setControlValue: jest.fn(),
      },
      queriesData: [
        {
          data: [
            { name: 'Alice', value: 1 },
            { name: 'Bob', value: 2 },
          ],
        },
      ],
      rawFormData: {
        viewport: {
          latitude: 37.7749,
          longitude: -122.4194,
          zoom: 10,
        },
      },
      width: 800,
    };

    const expectedProps = {
      datasource: {
        columnFormats: {},
        verboseMap: {},
      },
      formData: {
        viewport: {
          latitude: 37.7749,
          longitude: -122.4194,
          zoom: 10,
        },
      },
      height: 600,
      onAddFilter: chartProps.hooks.onAddFilter,
      payload: chartProps.queriesData[0],
      setControlValue: chartProps.hooks.setControlValue,
      viewport: {
        latitude: 37.7749,
        longitude: -122.4194,
        zoom: 10,
        height: 600,
        width: 800,
      },
      width: 800,
    };

    expect(transformProps(chartProps)).toEqual(expectedProps);
  });

  it('should use NOOP for hooks if not provided', () => {
    const chartProps: ChartProps = {
      datasource: {
        columnFormats: {},
        verboseMap: {},
      },
      height: 600,
      hooks: {},
      queriesData: [
        {
          data: [
            { name: 'Alice', value: 1 },
            { name: 'Bob', value: 2 },
          ],
        },
      ],
      rawFormData: {
        viewport: {
          latitude: 37.7749,
          longitude: -122.4194,
          zoom: 10,
        },
      },
      width: 800,
    };

    const expectedProps = {
      datasource: {
        columnFormats: {},
        verboseMap: {},
      },
      formData: {
        viewport: {
          latitude: 37.7749,
          longitude: -122.4194,
          zoom: 10,
        },
      },
      height: 600,
      onAddFilter: expect.any(Function),
      payload: chartProps.queriesData[0],
      setControlValue: expect.any(Function),
      viewport: {
        latitude: 37.7749,
        longitude: -122.4194,
        zoom: 10,
        height: 600,
        width: 800,
      },
      width: 800,
    };

    const transformedProps = transformProps(chartProps);

    expect(transformedProps).toEqual(expectedProps);
    expect(transformedProps.onAddFilter).toBeInstanceOf(Function);
    expect(transformedProps.setControlValue).toBeInstanceOf(Function);
  });
});
