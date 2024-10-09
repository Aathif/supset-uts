import { formatNumber } from '@superset-ui/core';

function formatCellValue(
  i: number,
  cols: string[],
  tdText: string,
  columnFormats: any,
  numberFormat: string,
  dateRegex: RegExp,
  dateFormatter: any,
) {
  const metric: string = cols[i];
  const format: string = columnFormats[metric] || numberFormat || '.3s';
  let textContent: string = tdText;
  let sortAttributeValue: any = tdText;

  function isNumeric(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  if (!isNumeric(tdText)) {
    textContent = tdText;
  }  else if (parseFloat(tdText)) {
    const parsedValue = parseFloat(tdText);
    textContent = formatNumber(format, parsedValue);
    sortAttributeValue = parsedValue;
  } else {
    const regexMatch = dateRegex.exec(tdText);
    if (regexMatch) {
      const date = new Date(parseFloat(regexMatch[1]));
      textContent = dateFormatter(date);
      sortAttributeValue = date;
    } else if (tdText === 'null') {
      textContent = '';
      sortAttributeValue = Number.NEGATIVE_INFINITY;
    }
  }

  return { textContent, sortAttributeValue };
}

function formatDateCellValue(text: string, verboseMap: any, dateRegex: RegExp, dateFormatter: any) {
  const regexMatch = dateRegex.exec(text);
  let cellValue;
  if (regexMatch) {
    const date = new Date(parseFloat(regexMatch[1]));
    cellValue = dateFormatter(date);
  } else {
    cellValue = verboseMap[text] || text;
  }
  return cellValue;
}

export { formatCellValue, formatDateCellValue };
