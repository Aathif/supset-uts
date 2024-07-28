jest.mock('@superset-ui/core', () => ({
  isRecordAnnotationResult: jest.fn(),
  isTableAnnotationLayer: jest.fn(),
}));

describe('extractRecordAnnotations', () => {
  it('should extract record annotations correctly', () => {
    isRecordAnnotationResult.mockReturnValue(true);
    isTableAnnotationLayer.mockReturnValue(true);

    const annotationLayer = { name: 'testLayer' };
    const annotationData = {
      testLayer: {
        records: [
          { long_descr: 'desc1', end_dttm: 'end1', start_dttm: 'start1', short_descr: 'title1' },
        ],
      },
    };

    const result = extractRecordAnnotations(annotationLayer, annotationData);

    expect(result).toEqual([
      {
        descriptions: ['desc1'],
        intervalEnd: 'end1',
        time: 'start1',
        title: 'title1',
      },
    ]);
  });

  it('should throw an error if the annotation result is not valid', () => {
    isRecordAnnotationResult.mockReturnValue(false);

    expect(() => {
      extractRecordAnnotations({}, {});
    }).toThrow('Please rerun the query.');
  });
});
