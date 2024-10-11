import { wrapTooltip } from './wrapTooltip';

describe('wrapTooltip', () => {
  let chart;

  beforeEach(() => {
    // Mocking the chart object and its methods
    chart = {
      useInteractiveGuideline: jest.fn(),
      interactiveLayer: {
        tooltip: {
          contentGenerator: jest.fn().mockReturnValue(jest.fn(() => 'Original Tooltip Content')),
        },
      },
      tooltip: {
        contentGenerator: jest.fn().mockReturnValue(jest.fn(() => 'Original Tooltip Content')),
      },
    };
  });

  it('should wrap the tooltip content for interactive layer', () => {
    // Arrange: Set up the chart to use interactive guideline
    chart.useInteractiveGuideline.mockReturnValue(true);

    // Act: Call the wrapTooltip function
    wrapTooltip(chart);

    // Assert: Check if the tooltip content generator is modified correctly
    const modifiedTooltipGenerator = chart.interactiveLayer.tooltip.contentGenerator();
    const result = modifiedTooltipGenerator({});

    expect(result).toBe('<div>Original Tooltip Content</div>');
    expect(chart.interactiveLayer.tooltip.contentGenerator).toHaveBeenCalled();
  });

  it('should wrap the tooltip content for non-interactive layer', () => {
    // Arrange: Set up the chart not to use interactive guideline
    chart.useInteractiveGuideline.mockReturnValue(false);

    // Act: Call the wrapTooltip function
    wrapTooltip(chart);

    // Assert: Check if the tooltip content generator is modified correctly
    const modifiedTooltipGenerator = chart.tooltip.contentGenerator();
    const result = modifiedTooltipGenerator({});

    expect(result).toBe('<div>Original Tooltip Content</div>');
    expect(chart.tooltip.contentGenerator).toHaveBeenCalled();
  });
});
