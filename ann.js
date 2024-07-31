export function transformIntervalAnnotation(layer, data, annotationData, colorScale) {
  const series = [];
  const annotations = extractRecordAnnotations(layer, annotationData);
  annotations.forEach(annotation => {
    const {
      name,
      color,
      opacity
    } = layer;
    const {
      descriptions,
      intervalEnd,
      time,
      title
    } = annotation;
    const label = formatAnnotationLabel(name, title, descriptions);
    const intervalData = [[{
      name: label,
      xAxis: time
    }, {
      xAxis: intervalEnd
    }]];
    series.push({
      id: `Interval - ${label}`,
      type: 'line',
      animation: false,
      markArea: {
        silent: false,
        itemStyle: {
          color: color || colorScale(name),
          opacity: parseAnnotationOpacity(opacity || AnnotationOpacity.Medium),
          emphasis: {
            opacity: 0.8
          }
        },
        label: {
          show: false,
          color: '#000000',
          // @ts-ignore
          emphasis: {
            fontWeight: 'bold',
            show: true,
            position: 'insideTop',
            verticalAlign: 'top',
            backgroundColor: '#ffffff'
          }
        },
        data: intervalData
      }
    });
  });
  return series;
}
