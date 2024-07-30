export function getXAxisFormatter(format) {
  if (format === smartDateFormatter.id || !format) {
    return undefined;
  }
 
  if (format) {
    return getTimeFormatter(format);
  }
 
  return String;
}
