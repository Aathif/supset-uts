import { transformEventAnnotation } from './transformEventAnnotation'; // Adjust the import path as needed
import { parseAnnotationOpacity } from './utils'; // Adjust the import path
import { extractRecordAnnotations } from './extractRecordAnnotations'; // Adjust the import path
import { formatAnnotationLabel } from './formatAnnotationLabel'; // Adjust the import path

jest.mock('./utils', () => ({
  parseAnnotationOpacity: jest.fn(),
}));

jest.mock('./extractRecordAnnotations', () => ({
  extractRecordAnnotations: jest.fn(),
}));

jest.mock('./formatAnnotationLabel', () => ({
  formatAnnotationLabel: jest.fn(),
}));

describe('transformEventAnnotation', () => {
  const mockParseAnnotationOpacity = parseAnnotationOpacity as jest.Mock;
  const mockExtractRecordAnnotations = extractRecordAnnotations as jest.Mock;
  const mockFormatAnnotationLabel = formatAnnotationLabel as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should transform event annotation correctly', () => {
    const layer = {
      name: 'testAnnotation',
      color: '#FF0000',
      opacity: 0.5,
      style: 'solid',
      width: 2,
    };

    const data = [/* sample data */];
    const annotationData = {
      testAnnotation: [
        {
          descriptions: 'Test Description',
          time: 1627849200000,
          title: 'Test Title',
        },
      ],
    };
    const colorScale = jest.fn().mockReturnValue('#00FF00');

    mockParseAnnotationOpacity.mockReturnValue(0.5);
    mockExtractRecordAnnotations.mockReturnValue(annotationData.testAnnotation);
    mockFormatAnnotationLabel.mockReturnValue('Test Annotation Label');

    const result = transformEventAnnotation(layer, data, annotationData, colorScale);

    expect(result).toEqual([
      {
        id: 'Event - Test Annotation Label',
        type: 'line',
        animation: false,
        markLine: {
          silent: false,
          symbol: 'none',
          lineStyle: {
            width: 2,
            type: 'solid',
            color: '#FF0000', // Layer color should be used
            opacity: 0.5, // Mocked value of parseAnnotationOpacity
            emphasis: {
              width: 3,
              opacity: 1,
            },
          },
          label: {
            show: false,
            color: '#000000',
            position: 'insideEndTop',
            emphasis: {
              formatter: expect.any(Function),
              fontWeight: 'bold',
              show: true,
              backgroundColor: '#ffffff',
            },
          },
          data: [
            {
              name: 'Test Annotation Label',
              xAxis: 1627849200000,
            },
          ],
        },
      },
    ]);
  });

  it('should use colorScale if color is not provided in the layer', () => {
    const layer = {
      name: 'testAnnotation',
      color: undefined,
      opacity: 0.8,
      style: 'dotted',
      width: 3,
    };

    const data = [/* sample data */];
    const annotationData = {
      testAnnotation: [
        {
          descriptions: 'Test Description',
          time: 1627849200000,
          title: 'Test Title',
        },
      ],
    };
    const colorScale = jest.fn().mockReturnValue('#00FF00');

    mockParseAnnotationOpacity.mockReturnValue(0.8);
    mockExtractRecordAnnotations.mockReturnValue(annotationData.testAnnotation);
    mockFormatAnnotationLabel.mockReturnValue('Test Annotation Label');

    const result = transformEventAnnotation(layer, data, annotationData, colorScale);

    expect(result[0].markLine.lineStyle.color).toBe('#00FF00'); // The colorScale function result should be used
  });

  it('should handle cases with default values', () => {
    const layer = {
      name: 'defaultAnnotation',
      color: undefined,
      opacity: undefined,
      style: undefined,
      width: undefined,
    };

    const data = [/* sample data */];
    const annotationData = {
      defaultAnnotation: [
        {
          descriptions: 'Default Description',
          time: 1627849200000,
          title: 'Default Title',
        },
      ],
    };
    const colorScale = jest.fn().mockReturnValue('#0000FF');

    mockParseAnnotationOpacity.mockReturnValue(1);
    mockExtractRecordAnnotations.mockReturnValue(annotationData.defaultAnnotation);
    mockFormatAnnotationLabel.mockReturnValue('Default Annotation Label');

    const result = transformEventAnnotation(layer, data, annotationData, colorScale);

    expect(result).toEqual([
      {
        id: 'Event - Default Annotation Label',
        type: 'line',
        animation: false,
        markLine: {
          silent: false,
          symbol: 'none',
          lineStyle: {
            width: undefined,
            type: undefined,
            color: '#0000FF', // Default colorScale value
            opacity: 1, // Default opacity value
            emphasis: {
              width: undefined,
              opacity: 1,
            },
          },
          label: {
            show: false,
            color: '#000000',
            position: 'insideEndTop',
            emphasis: {
              formatter: expect.any(Function),
              fontWeight: 'bold',
              show: true,
              backgroundColor: '#ffffff',
            },
          },
          data: [
            {
              name: 'Default Annotation Label',
              xAxis: 1627849200000,
            },
          ],
        },
      },
    ]);
  });
});
