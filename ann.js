import { transformFormulaAnnotation } from './yourFile';
import { evalFormula } from '../utils/annotation';
import { parseAnnotationOpacity } from '../utils/annotation';

jest.mock('../utils/annotation', () => ({
  evalFormula: jest.fn(),
  parseAnnotationOpacity: jest.fn(),
}));

describe('transformFormulaAnnotation', () => {
  const mockLayer = {
    name: 'mock_name',
    color: 'blue',
    opacity: 0.5,
    width: 2,
    style: 'solid',
  };

  const mockData = [/* mock data here */];
  const mockSupersetColor = '#ff0000';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return a correctly formatted annotation object', () => {
    // Mock the return values of the dependencies
    (evalFormula as jest.Mock).mockReturnValue([[1, 2], [3, 4]]);
    (parseAnnotationOpacity as jest.Mock).mockReturnValue(0.5);

    const result = transformFormulaAnnotation(mockLayer, mockData, mockSupersetColor);

    expect(result).toEqual({
      name: 'mock_name',
      id: 'mock_name',
      itemStyle: { color: mockSupersetColor },
      lineStyle: {
        opacity: 0.5,
        type: 'solid',
        width: 2,
      },
      type: 'line',
      smooth: true,
      data: [[1, 2], [3, 4]],  // Mocked return from evalFormula
      symbolSize: 0,
      z: 0,
    });

    // Ensure the mocks were called with the correct arguments
    expect(evalFormula).toHaveBeenCalledWith(mockLayer, mockData);
    expect(parseAnnotationOpacity).toHaveBeenCalledWith(mockLayer.opacity);
  });

  test('should handle missing opacity and width', () => {
    const mockLayerWithoutOpacity = {
      ...mockLayer,
      opacity: undefined,
      width: undefined,
    };

    (evalFormula as jest.Mock).mockReturnValue([[5, 6], [7, 8]]);
    (parseAnnotationOpacity as jest.Mock).mockReturnValue(1); // Default opacity

    const result = transformFormulaAnnotation(mockLayerWithoutOpacity, mockData, mockSupersetColor);

    expect(result).toEqual({
      name: 'mock_name',
      id: 'mock_name',
      itemStyle: { color: mockSupersetColor },
      lineStyle: {
        opacity: 1,  // Default mocked opacity
        type: 'solid',
        width: undefined,  // Missing width
      },
      type: 'line',
      smooth: true,
      data: [[5, 6], [7, 8]],
      symbolSize: 0,
      z: 0,
    });

    expect(parseAnnotationOpacity).toHaveBeenCalledWith(undefined);
  });
});
