export function transformTimeseriesAnnotation(layer, markerSize, data, annotationData) {
  const series = [];
  const {
    hideLine,
    name,
    opacity,
    showMarkers,
    style,
    width,
    markLine,
    markPoint
  } = layer;
  const result = annotationData[name];

  if (isTimeseriesAnnotationResult(result)) {
    result.forEach(annotation => {
      const {
        key,
        values,
        markLine,
        markPoint
      } = annotation;
      series.push({
        type: 'line',
        id: key,
        name: key,
        data: values.map(row => [row.x, row.y]),
        symbolSize: showMarkers ? markerSize : 0,
        markLine : {
          data: [{
            type: "average"
          }],
          silent: true
        },
        markPoint : {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ],
          symbol: "pin",
          symbolSize: [45,40],
          symbolRotate: -180,
          label: {
            show: true,
            distance: 30,
            position: "inside",
            offset: [0, 8]
          }
        },
        lineStyle: {
          opacity: parseAnnotationOpacity(opacity),
          type: style,
          width: hideLine ? 0 : width
        }
      });
    });
  }

  return series;
}
