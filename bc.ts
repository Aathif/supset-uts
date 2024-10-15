import { render } from '@testing-library/react';
import { renderTooltipFactory } from './path-to-your-file'; // Update this with the actual path
import { t } from '@superset-ui/core'; // Assuming you have a translation function

// Mocking the translation function
jest.mock('@superset-ui/core', () => ({
  t: jest.fn((str) => str),
}));

describe('renderTooltipFactory', () => {
  const mockFormatDate = jest.fn((date) => date.toISOString());
  const mockFormatValue = jest.fn((value) => `formatted-${value}`);

  const renderTooltip = renderTooltipFactory(mockFormatDate, mockFormatValue);

  it('should render tooltip with formatted date and value', () => {
    const props = {
      datum: {
        x: new Date('2021-09-30T00:00:00Z').getTime(),
        y: 123.45,
      },
    };

    const { container } = render(renderTooltip(props));

    // Check if the formatted date is rendered
    expect(container.textContent).toContain(new Date('2021-09-30T00:00:00Z').toISOString());
    // Check if the formatted value is rendered
    expect(container.textContent).toContain('formatted-123.45');
    // Check the formatting functions were called
    expect(mockFormatDate).toHaveBeenCalledWith(new Date('2021-09-30T00:00:00Z'));
    expect(mockFormatValue).toHaveBeenCalledWith(123.45);
  });

  it('should render "N/A" when value is null', () => {
    const props = {
      datum: {
        x: new Date('2021-09-30T00:00:00Z').getTime(),
        y: null,
      },
    };

    const { container } = render(renderTooltip(props));

    // Check if the formatted date is rendered
    expect(container.textContent).toContain(new Date('2021-09-30T00:00:00Z').toISOString());
    // Check if "N/A" is rendered instead of the value
    expect(container.textContent).toContain('N/A');
    // Ensure the formatValue function wasn't called
    expect(mockFormatValue).not.toHaveBeenCalled();
  });

  it('should render with default padding style', () => {
    const props = {
      datum: {
        x: new Date('2021-09-30T00:00:00Z').getTime(),
        y: 456.78,
      },
    };

    const { container } = render(renderTooltip(props));
    const tooltipDiv = container.querySelector('div');

    // Check if the padding is correct
    expect(tooltipDiv).toHaveStyle('padding: 4px 8px');
  });
});
