import HexChartPlugin from './HexChartPlugin';
import { ChartMetadata, ChartPlugin } from '@superset-ui/core';
import transformProps from '../../transformProps';
import controlPanel from './controlPanel';
import thumbnail from './images/thumbnail.png';

describe('HexChartPlugin', () => {
  it('should be an instance of ChartPlugin', () => {
    const plugin = new HexChartPlugin();
    expect(plugin).toBeInstanceOf(ChartPlugin);
  });

  it('should have correct metadata', () => {
    const plugin = new HexChartPlugin();
    const { metadata } = plugin;

    expect(metadata).toBeInstanceOf(ChartMetadata);
    expect(metadata.name).toBe('deck.gl 3D Hexagon');
    expect(metadata.category).toBe('Map');
    expect(metadata.thumbnail).toBe(thumbnail);
    expect(metadata.useLegacyApi).toBe(true);
  });

  it('should have correct controlPanel configuration', () => {
    const plugin = new HexChartPlugin();
    expect(plugin.controlPanel).toBe(controlPanel);
  });

  it('should use the correct transformProps function', () => {
    const plugin = new HexChartPlugin();
    expect(plugin.transformProps).toBe(transformProps);
  });

  it('should load the correct chart component', async () => {
    const plugin = new HexChartPlugin();
    const loadChart = plugin.loadChart;

    // Simulate loading the chart component
    const chartComponent = await loadChart();
    expect(chartComponent).toBeDefined();
  });
});
