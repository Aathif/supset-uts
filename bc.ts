import TreemapChartPlugin from './TreemapChartPlugin';
import transformProps from './transformProps';
import controlPanel from './controlPanel';
import { ChartMetadata } from '@superset-ui/core';

describe('TreemapChartPlugin', () => {
  test('should instantiate correctly', () => {
    const plugin = new TreemapChartPlugin();

    // Ensure it's an instance of ChartPlugin
    expect(plugin).toBeInstanceOf(TreemapChartPlugin);

    // Test that the metadata property is set up correctly
    expect(plugin.metadata).toBeInstanceOf(ChartMetadata);
    expect(plugin.metadata.name).toBe('Treemap');

    // Test that transformProps and controlPanel are set up correctly
    expect(plugin.transformProps).toBe(transformProps);
    expect(plugin.controlPanel).toBe(controlPanel);
  });

  test('should load chart asynchronously', async () => {
    const plugin = new TreemapChartPlugin();

    // Test that the chart loading function works
    const chartModule = await plugin.loadChart();
    expect(chartModule).toBeDefined();
  });
});
