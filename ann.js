import { transformTimeseriesAnnotation } from './transformTimeseriesAnnotation'; // Adjust the import path as needed
import { isTimeseriesAnnotationResult, parseAnnotationOpacity } from './utils'; // Adjust import paths

jest.mock('./utils', () => ({
  isTimeseriesAnnotationResult: jest.fn(),
  parseAnnotationOpacity: jest.fn(),
}));

describe('transformTimeseriesAnnotation', () => {
  const mockIsTimeseriesAnnotationResult = isTimeseriesAnnotationResult as jest.Mock;
  const mockParseAnnotationOpacity = parseAnnotationOpacity as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should transform annotation data into series correctly', () => {
    const layer = {
      hideLine: false,
      name: 'testLayer',
      opacity: 0.5,
      showMarkers: true,
      style: 'solid',
      width: 2,
      markLine: {},
      markPoint: {}
    };
    
    const markerSize = 10;
    const data = [];
    const annotationData = {
      testLayer: [
        {
          key: 'annotation1',
          values: [{ x: 1, y: 10 }, { x: 2, y: 20 }],
          markLine: {},
          markPoint: {}
        },
        {
          key: 'annotation2',
          values: [{ x: 3, y: 30 }, { x: 4, y: 40 }],
          markLine: {},
          markPoint: {}
        }
      ]
    };

    mockIsTimeseriesAnnotationResult.mockReturnValue(true);
    mockParseAnnotationOpacity.mockReturnValue(0.5);

    const result = transformTimeseriesAnnotation(layer, markerSize, data, annotationData);

    expect(result).toEqual([
      {
        type: 'line',
        id: 'annotation1',
        name: 'annotation1',
        data: [[1, 10], [2, 20]],
        symbolSize: 10,
        markLine: {
          data: [{ type: "average" }],
          silent: true
        },
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ],
          symbol: "pin",
          symbolSize: [45, 40],
          symbolRotate: -180,
          label: {
            show: true,
            distance: 30,
            position: "inside",
            offset: [0, 8]
          }
        },
        lineStyle: {
          opacity: 0.5,
          type: 'solid',
          width: 2
        }
      },
      {
        type: 'line',
        id: 'annotation2',
        name: 'annotation2',
        data: [[3, 30], [4, 40]],
        symbolSize: 10,
        markLine: {
          data: [{ type: "average" }],
          silent: true
        },
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ],
          symbol: "pin",
          symbolSize: [45, 40],
          symbolRotate: -180,
          label: {
            show: true,
            distance: 30,
            position: "inside",
            offset: [0, 8]
          }
        },
        lineStyle: {
          opacity: 0.5,
          type: 'solid',
          width: 2
        }
      }
    ]);
  });

  it('should handle case when isTimeseriesAnnotationResult returns false', () => {
    const layer = {
      hideLine: false,
      name: 'testLayer',
      opacity: 0.5,
      showMarkers: true,
      style: 'solid',
      width: 2,
      markLine: {},
      markPoint: {}
    };
    
    const markerSize = 10;
    const data = [];
    const annotationData = {
      testLayer: []
    };

    mockIsTimeseriesAnnotationResult.mockReturnValue(false);

    const result = transformTimeseriesAnnotation(layer, markerSize, data, annotationData);

    expect(result).toEqual([]);
  });

  it('should apply opacity and line style correctly', () => {
    const layer = {
      hideLine: true,
      name: 'testLayer',
      opacity: 0.7,
      showMarkers: false,
      style: 'dotted',
      width: 3,
      markLine: {},
      markPoint: {}
    };

    const markerSize = 5;
    const data = [];
    const annotationData = {
      testLayer: [
        {
          key: 'annotation1',
          values: [{ x: 1, y: 10 }],
          markLine: {},
          markPoint: {}
        }
      ]
    };

    mockIsTimeseriesAnnotationResult.mockReturnValue(true);
    mockParseAnnotationOpacity.mockReturnValue(0.7);

    const result = transformTimeseriesAnnotation(layer, markerSize, data, annotationData);

    expect(result).toEqual([
      {
        type: 'line',
        id: 'annotation1',
        name: 'annotation1',
        data: [[1, 10]],
        symbolSize: 0,
        markLine: {
          data: [{ type: "average" }],
          silent: true
        },
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ],
          symbol: "pin",
          symbolSize: [45, 40],
          symbolRotate: -180,
          label: {
            show: true,
            distance: 30,
            position: "inside",
            offset: [0, 8]
          }
        },
        lineStyle: {
          opacity: 0.7,
          type: 'dotted',
          width: 0
        }
      }
    ]);
  });
});
