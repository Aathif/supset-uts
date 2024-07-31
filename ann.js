import { transformIntervalAnnotation } from './transformIntervalAnnotation'; // Adjust the import path as needed
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

describe('transformIntervalAnnotation', () => {
  const mockParseAnnotationOpacity = parseAnnotationOpacity as jest.Mock;
  const mockExtractRecordAnnotations = extractRecordAnnotations as jest.Mock;
  const mockFormatAnnotationLabel = formatAnnotationLabel as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should transform interval annotation correctly', () => {
    const layer = {
      name: 'testAnnotation',
      color: '#FF0000',
      opacity: 0.5,
    };

    const data = [/* sample data */];
    const annotationData = {
      testAnnotation: [
        {
          descriptions: 'Test Description',
          intervalEnd: 1627852800000,
          time: 1627849200000,
          title: 'Test Title',
        },
      ],
    };
    const colorScale = jest.fn().mockReturnValue('#00FF00');

    mockParseAnnotationOpacity.mockReturnValue(0.5);
    mockExtractRecordAnnotations.mockReturnValue(annotationData.testAnnotation);
    mockFormatAnnotationLabel.mockReturnValue('Test Annotation Label');

    const result = transformIntervalAnnotation(layer, data, annotationData, colorScale);

    expect(result).toEqual([
      {
        id: 'Interval - Test Annotation Label',
        type: 'line',
        animation: false,
        markArea: {
          silent: false,
          itemStyle: {
            color: '#FF0000', // Layer color should be used
            opacity: 0.5, // Mocked value of parseAnnotationOpacity
            emphasis: {
              opacity: 0.8,
            },
          },
          label: {
            show: false,
            color: '#000000',
            emphasis: {
              fontWeight: 'bold',
              show: true,
              position: 'insideTop',
              verticalAlign: 'top',
              backgroundColor: '#ffffff',
            },
          },
          data: [
            [
              {
                name: 'Test Annotation Label',
                xAxis: 1627849200000,
              },
              {
                xAxis: 1627852800000,
              },
            ],
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
    };

    const data = [/* sample data */];
    const annotationData = {
      testAnnotation: [
        {
          descriptions: 'Test Description',
          intervalEnd: 1627852800000,
          time: 1627849200000,
          title: 'Test Title',
        },
      ],
    };
    const colorScale = jest.fn().mockReturnValue('#00FF00');

    mockParseAnnotationOpacity.mockReturnValue(0.8);
    mockExtractRecordAnnotations.mockReturnValue(annotationData.testAnnotation);
    mockFormatAnnotationLabel.mockReturnValue('Test Annotation Label');

    const result = transformIntervalAnnotation(layer, data, annotationData, colorScale);

    expect(result[0].markArea.itemStyle.color).toBe('#00FF00'); // The colorScale function result should be used
  });

  it('should handle cases with default values', () => {
    const layer = {
      name: 'defaultAnnotation',
      color: undefined,
      opacity: undefined,
    };

    const data = [/* sample data */];
    const annotationData = {
      defaultAnnotation: [
        {
          descriptions: 'Default Description',
          intervalEnd: 1627852800000,
          time: 1627849200000,
          title: 'Default Title',
        },
      ],
    };
    const colorScale = jest.fn().mockReturnValue('#0000FF');

    mockParseAnnotationOpacity.mockReturnValue(1);
    mockExtractRecordAnnotations.mockReturnValue(annotationData.defaultAnnotation);
    mockFormatAnnotationLabel.mockReturnValue('Default Annotation Label');

    const result = transformIntervalAnnotation(layer, data, annotationData, colorScale);

    expect(result).toEqual([
      {
        id: 'Interval - Default Annotation Label',
        type: 'line',
        animation: false,
        markArea: {
          silent: false,
          itemStyle: {
            color: '#0000FF', // Default colorScale value
            opacity: 1, // Default opacity value
            emphasis: {
              opacity: 0.8,
            },
          },
          label: {
            show: false,
            color: '#000000',
            emphasis: {
              fontWeight: 'bold',
              show: true,
              position: 'insideTop',
              verticalAlign: 'top',
              backgroundColor: '#ffffff',
            },
          },
          data: [
            [
              {
                name: 'Default Annotation Label',
                xAxis: 1627849200000,
              },
              {
                xAxis: 1627852800000,
              },
            ],
          ],
        },
      },
    ]);
  });
});
