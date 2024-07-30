import { transformFormulaAnnotation } from './transformFormulaAnnotation'; // Adjust the import path as needed
import { parseAnnotationOpacity } from './utils'; // Adjust import path
import { evalFormula } from './evalFormula'; // Adjust import path

jest.mock('./utils', () => ({
  parseAnnotationOpacity: jest.fn(),
}));

jest.mock('./evalFormula', () => ({
  evalFormula: jest.fn(),
}));

describe('transformFormulaAnnotation', () => {
  const mockParseAnnotationOpacity = parseAnnotationOpacity as jest.Mock;
  const mockEvalFormula = evalFormula as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should transform formula annotation correctly', () => {
    const layer = {
      name: 'testAnnotation',
      color: '#FF0000',
      opacity: 0.5,
      width: 2,
      style: 'solid'
    };
    
    const data = [/* sample data */];
    const colorScale = jest.fn().mockReturnValue('#00FF00');
    
    mockParseAnnotationOpacity.mockReturnValue(0.5);
    mockEvalFormula.mockReturnValue([[1, 10], [2, 20]]);

    const result = transformFormulaAnnotation(layer, data, colorScale);

    expect(result).toEqual({
      name: 'testAnnotation',
      id: 'testAnnotation',
      itemStyle: {
        color: '#FF0000' // The color provided in the layer should be used
      },
      lineStyle: {
        opacity: 0.5, // Mocked value of parseAnnotationOpacity
        type: 'solid', // From layer
        width: 2 // From layer
      },
      type: 'line',
      smooth: true,
      data: [[1, 10], [2, 20]], // Result of evalFormula
      symbolSize: 0,
      z: 0
    });
  });

  it('should use colorScale if color is not provided', () => {
    const layer = {
      name: 'testAnnotation',
      color: undefined,
      opacity: 0.8,
      width: 3,
      style: 'dotted'
    };
    
    const data = [/* sample data */];
    const colorScale = jest.fn().mockReturnValue('#00FF00');
    
    mockParseAnnotationOpacity.mockReturnValue(0.8);
    mockEvalFormula.mockReturnValue([[3, 30], [4, 40]]);

    const result = transformFormulaAnnotation(layer, data, colorScale);

    expect(result.itemStyle.color).toBe('#00FF00'); // The colorScale function result should be used
  });

  it('should handle cases with default values', () => {
    const layer = {
      name: 'defaultAnnotation',
      color: undefined,
      opacity: undefined,
      width: undefined,
      style: undefined
    };
    
    const data = [/* sample data */];
    const colorScale = jest.fn().mockReturnValue('#0000FF');
    
    mockParseAnnotationOpacity.mockReturnValue(1);
    mockEvalFormula.mockReturnValue([[5, 50]]);

    const result = transformFormulaAnnotation(layer, data, colorScale);

    expect(result).toEqual({
      name: 'defaultAnnotation',
      id: 'defaultAnnotation',
      itemStyle: {
        color: '#0000FF' // Default colorScale value
      },
      lineStyle: {
        opacity: 1, // Default opacity value
        type: 'solid', // Default style value
        width: 1 // Default width value
      },
      type: 'line',
      smooth: true,
      data: [[5, 50]], // Result of evalFormula
      symbolSize: 0,
      z: 0
    });
  });
});
