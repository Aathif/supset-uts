import { transformFormulaAnnotation } from './transformFormulaAnnotation'; // Adjust the import path as needed
export function transformEventAnnotation(layer, data, annotationData, colorScale) {
  const series = [];
  const annotations = extractRecordAnnotations(layer, annotationData);
  annotations.forEach(annotation => {
    const {
      name,
      color,
      opacity,
      style,
      width
    } = layer;
    const {
      descriptions,
      time,
      title
    } = annotation;
    const label = formatAnnotationLabel(name, title, descriptions);
    const eventData = [{
      name: label,
      xAxis: time
    }];
    const lineStyle = {
      width,
      type: style,
      color: color || colorScale(name),
      opacity: parseAnnotationOpacity(opacity),
      emphasis: {
        width: width ? width + 1 : width,
        opacity: 1
      }
    };
    series.push({
      id: `Event - ${label}`,
      type: 'line',
      animation: false,
      markLine: {
        silent: false,
        symbol: 'none',
        lineStyle,
        label: {
          show: false,
          color: '#000000',
          position: 'insideEndTop',
          // @ts-ignore
          emphasis: {
            formatter: params => params.name,
            fontWeight: 'bold',
            show: true,
            backgroundColor: '#ffffff'
          }
        },
        data: eventData
      }
    });
  });
  return series;
}
