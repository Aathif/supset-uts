export function getTooltipTimeFormatter(format) {
  if (format === smartDateFormatter.id) {
    return smartDateDetailedFormatter;
  }

  if (format) {
    return getTimeFormatter(format);
  }

  return String;
}
