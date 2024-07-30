export function formatColumnValue(column: DataColumnMeta, value: DataRecordValue) {
  const { dataType, formatter, config = {} } = column;
  const isNumber = dataType === GenericDataType.Numeric;
  const smallNumberFormatter =
    config.d3SmallNumberFormat === undefined
      ? formatter
      : getNumberFormatter(config.d3SmallNumberFormat);
  return formatValue(
    isNumber && typeof value === 'number' && Math.abs(value) < 1 ? smallNumberFormatter : formatter,
    value,
  );
}
