
export function transformFormulaAnnotation(layer, data, colorScale) {
  const {
    name,
    color,
    opacity,
    width,
    style
  } = layer;
  return {
    name,
    id: name,
    itemStyle: {
      color: color || colorScale(name)
    },
    lineStyle: {
      opacity: parseAnnotationOpacity(opacity),
      type: style,
      width
    },
    type: 'line',
    smooth: true,
    data: evalFormula(layer, data),
    symbolSize: 0,
    z: 0
  };
}
