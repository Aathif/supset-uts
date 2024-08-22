import { renderTooltipFactory } from './path_to_your_function';
import { smartDateVerboseFormatter, defaultNumberFormatter } from 'somewhere_in_your_project';
import { t } from '@superset-ui/core';

describe('renderTooltipFactory', () => {
  const mockDate = '2023-08-16T00:00:00';
  const mockFormattedDate = 'August 16, 2023';
  const mockFormattedValue = '100.00';
  const mockData = { data: [mockDate, 100] };
  const mockParams = [{ data: mockData.data }];
  
  const customDateFormatter = jest.fn(() => mockFormattedDate);
  const customValueFormatter = jest.fn(() => mockFormattedValue);

  beforeAll(() => {
    // Mock the translation function
    jest.spyOn(global, 't').mockImplementation((key) => key);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render tooltip with custom formatters', () => {
    const renderTooltip = renderTooltipFactory(customDateFormatter, customValueFormatter);
    const result = renderTooltip(mockParams);

    expect(customDateFormatter).toHaveBeenCalledWith(mockDate);
    expect(customValueFormatter).toHaveBeenCalledWith(100);
    expect(result).toContain(mockFormattedDate);
    expect(result).toContain(mockFormattedValue);
  });

  it('should render tooltip with default formatters', () => {
    const renderTooltip = renderTooltipFactory();
    const result = renderTooltip(mockParams);

    expect(result).toContain(smartDateVerboseFormatter(mockDate));
    expect(result).toContain(defaultNumberFormatter(100));
  });

  it('should render "N/A" when value is null', () => {
    const mockNullData = { data: [mockDate, null] };
    const mockNullParams = [{ data: mockNullData.data }];
    const renderTooltip = renderTooltipFactory(customDateFormatter, customValueFormatter);
    const result = renderTooltip(mockNullParams);

    expect(customDateFormatter).toHaveBeenCalledWith(mockDate);
    expect(result).toContain(mockFormattedDate);
    expect(result).toContain(t('N/A'));
  });
});
