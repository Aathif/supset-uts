import * as d3 from 'd3';
import { drawBarValues } from './yourModule'; // Replace with the correct import path
import { getNumberFormatter } from './utils'; // Mock getNumberFormatter if necessary

jest.mock('./utils', () => ({
  getNumberFormatter: jest.fn(() => (value) => value), // Simple formatter mock
}));

describe('drawBarValues', () => {
  let svg;
  let data;

  beforeEach(() => {
    // Setup a basic SVG element for testing
    svg = d3.select(document.body).append('svg').attr('width', 500).attr('height', 500);
    const g = svg.append('g').attr('class', 'nv-barsWrap');
    g.append('g').attr('class', 'nv-group').append('rect').attr('x', 50).attr('y', 50).attr('width', 40).attr('height', 100).attr('class', 'bar positive');
    g.append('g').attr('class', 'nv-group').append('rect').attr('x', 150).attr('y', 30).attr('width', 40).attr('height', 200).attr('class', 'bar negative');
    
    // Sample data for testing
    data = [
      {
        disabled: false,
        values: [{ y: 100 }, { y: 200 }]
      },
      {
        disabled: false,
        values: [{ y: 150 }, { y: 250 }]
      }
    ];
  });

  afterEach(() => {
    // Clean up the SVG after each test
    d3.select('svg').remove();
  });

  it('should draw bar values for stacked bars', () => {
    drawBarValues(svg, data, true, 'format'); // 'format' is just a placeholder

    const labels = svg.selectAll('.bar-chart-label-group text');
    expect(labels.size()).toBe(2); // Check that two labels are created

    expect(labels.nodes()[0].textContent).toBe('250'); // Total stacked value for the first bar
    expect(labels.nodes()[1].textContent).toBe('450'); // Total stacked value for the second bar
  });

  it('should draw bar values for unstacked bars', () => {
    drawBarValues(svg, data, false, 'format');

    const labels = svg.selectAll('.bar-chart-label-group text');
    expect(labels.size()).toBe(2); // Check that two labels are created

    expect(labels.nodes()[0].textContent).toBe('100'); // Value of the first bar
    expect(labels.nodes()[1].textContent).toBe('150'); // Value of the second bar
  });

  it('should adjust label position for positive bars', () => {
    drawBarValues(svg, data, true, 'format');

    const positiveLabel = svg.selectAll('.bar-chart-label-group text').nodes()[0];
    const yPos = parseFloat(positiveLabel.getAttribute('y'));
    
    expect(yPos).toBeLessThan(50); // The label for positive bar should be above the bar
  });

  it('should adjust label position for negative bars', () => {
    drawBarValues(svg, data, true, 'format');

    const negativeLabel = svg.selectAll('.bar-chart-label-group text').nodes()[1];
    const yPos = parseFloat(negativeLabel.getAttribute('y'));
    
    expect(yPos).toBeGreaterThan(230); // The label for negative bar should be below the bar
  });

  it('should remove existing labels before drawing new ones', () => {
    drawBarValues(svg, data, true, 'format'); // Draw the labels the first time
    expect(svg.selectAll('.bar-chart-label-group text').size()).toBe(2); // Check initial label count

    drawBarValues(svg, data, false, 'format'); // Draw new labels

    expect(svg.selectAll('.bar-chart-label-group text').size()).toBe(2); // Ensure it still has 2 labels
  });
});
