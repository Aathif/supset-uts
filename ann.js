import dt from 'datatables.net-bs';
import PropTypes from 'prop-types';
import {
  getTimeFormatter,
  getTimeFormatterForGranularity,
  smartDateFormatter,
  styled
} from '@superset-ui/core';
import { formatCellValue, formatDateCellValue } from './utils/formatCells';
import fixTableHeight from './utils/fixTableHeight';
import 'datatables.net-bs/css/dataTables.bootstrap.css';
import './PivotTable.css';

if (window.$) {
  dt(window, window.$);
}
const $ = window.$ || dt.$;

const propTypes = {
  data: PropTypes.shape({
    // TODO: replace this with raw data in SIP-6
    html: PropTypes.string,
    columns: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    ),
  }),
  height: PropTypes.number,
  columnFormats: PropTypes.objectOf(PropTypes.string),
  numberFormat: PropTypes.string,
  numGroups: PropTypes.number,
  verboseMap: PropTypes.objectOf(PropTypes.string),
  customizeBgCondition: PropTypes.object
};

const hasOnlyTextChild = node =>
  node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

function PivotTable(element, props) {
  const {
    columnFormats,
    data,
    dateFormat,
    granularity,
    height,
    numberFormat,
    numGroups,
    verboseMap,
    customizeBgCondition,
    cellBgColor,
    pageLength,
    includeSearch,
    groupby,
    columns: colNames,
    colsToHide,
    orderByCols
  } = props;

  let { html, columns } = data;
  const container = element;
  const $container = $(element);
  let dateFormatter;
  const customColor = {}
  const allSubjects = [];
  customizeBgCondition && customizeBgCondition.forEach((item) => {
    const { operator, comparator = '', subject = '' } = item;
    allSubjects.push(subject.toLowerCase())
    customColor[subject.toLowerCase()] = {
      operator,
      comparator,
      subject
    }
  })

  if (dateFormat === smartDateFormatter.id && granularity) {
    dateFormatter = getTimeFormatterForGranularity(granularity);
  } else if (dateFormat) {
    dateFormatter = getTimeFormatter(dateFormat);
  } else {
    dateFormatter = String;
  }
  // queryData data is a string of html with a single table element
  container.innerHTML = html;

  let tableHasRowSpan = false;
  let tableHasColSpan = false;
  let $headerRows = $container.find('thead tr');
  const $bodyRows = $container.find('tbody tr');
  // Make headers in single row if there are two table headers.
  if ($headerRows.length == 2) {
    const firstRow = $headerRows[0];
    $(firstRow).children().each(function (colIndex) {
      if ($(this).text()) {
        $($($headerRows[1]).children()[colIndex]).text($(this).text())
      }
    });
    $(firstRow).remove();
  }

  const sortingObj = {};
  let orderByArr = [];
  orderByCols && orderByCols.forEach(function (item, index) {
    item = JSON.parse(item);
    sortingObj[item[0]] = item[1] === true ? 'asc' : 'desc'
  })

  console.time('EmptyInsert')
  if (!(groupby.length > 0 && colNames.length > 0)) {
    // Add empty td as per rowspan count.

    $bodyRows.each(function (rowIndex) {
      var currentRow = $(this);
      currentRow.children().each(function (colIndex) {
        const $this = $(this)
        const hasRowSpan = parseInt($this.attr('rowspan'), 10);
        const hasColSpan = parseInt($this.attr('colspan'), 10);
        if (hasRowSpan && hasRowSpan > 1) {
          tableHasRowSpan = true;
          for (let j = 0; j < hasRowSpan - 1; j++) {
            $($($bodyRows[rowIndex + 1 + j]).children()[colIndex]).before(`<td style="display:none"></td>`)
          }
        }
        if (hasColSpan && hasColSpan > 1) {
          tableHasColSpan = true;
          for (let i = 0; i < hasColSpan - 1; i++) {
            $(currentRow.children()[colIndex]).after('<td style="display: none"></td>')
          }
        }
      });
    });
  }

  // Hide headers as per columns to hide.
  let indexToHide = [];
  $headerRows = $container.find('thead tr');
  const headerRowCount = $headerRows.length;
  $($headerRows[headerRowCount - 1]).children().each(function (index, value) {
    if (colsToHide.includes($(this).text())) {
      indexToHide.push(index);
      $(this).remove();
      $headerRows.each(function (index1, value) {
        if (index1 < (headerRowCount - 1)) {
          $($(this).children()[index]).remove();
        }
      })
    }
    if (sortingObj[$(this).text()]) {
      orderByArr.push([index, sortingObj[$(this).text()]])
    }
  })

  // hide table data as per columns to hide.
  indexToHide.forEach(function (value, index) {
    $container.find('tbody tr').each(function () {
      $($(this).children()[value - index]).remove()
    })
  })

  console.timeEnd('EmptyInsert')
  // let cols = Array.isArray(columns[0]) ? columns.map(col => col[0]) : columns;
  const dateRegex = /^__timestamp:(-?\d*\.?\d*)$/;

  let cols = [];
  const $headerCells = $container.find('thead th');
  $headerCells.each(function (index) {
    const val = $(this).text() || '';
    if (val) {
      cols.push(val.toLowerCase())
    }
  });

  console.time('hasTestOnly')
  $container.find('th').each(function formatTh() {
    if (hasOnlyTextChild(this)) {
      const cellValue = formatDateCellValue($(this).text(), verboseMap, dateRegex, dateFormatter);
      $(this).html(cellValue);
    }
  });
  console.timeEnd('hasTestOnly')

  console.time('Cellupdate')
  $bodyRows.each(function eachRow() {
    $(this)
      .children()
      .each(function eachTd(index) {
        if (hasOnlyTextChild(this)) {
          const $this = $(this)
          let tdText = $this.html();
          if (!isNaN(tdText)) {
            tdText = tdText;
          }
          const { textContent, sortAttributeValue } = formatCellValue(
            index,
            cols,
            tdText,
            columnFormats,
            numberFormat,
            dateRegex,
            dateFormatter,
          );
          $this.text(textContent).attr('data-sort', sortAttributeValue);

          if (allSubjects.includes(cols[index])) {
            const { operator, comparator = '', subject = '' } = customColor[cols[index]]
            let comparat, color;
            if (typeof comparator === 'string') {
              [comparat, color] = comparator.split(',')
            }
            let result = false;
            let compareVal = parseInt((comparat || comparator), 10);
            let isValidNumber = !isNaN(compareVal) && !isNaN(parseInt(sortAttributeValue, 10))
            switch (operator) {
              case '==':
                result = isValidNumber ? sortAttributeValue == compareVal : sortAttributeValue == (comparat || comparator);
                break;
              case '!=':
                result = isValidNumber ? sortAttributeValue != compareVal : sortAttributeValue == (comparat || comparator);;
                break;
              case '>':
                result = isValidNumber ? sortAttributeValue > compareVal : false;
                break;
              case '>=':
                result = isValidNumber ? sortAttributeValue >= compareVal : false;
                break;
              case '<':
                result = isValidNumber ? sortAttributeValue < compareVal : false;
                break;
              case '<=':
                result = isValidNumber ? sortAttributeValue <= compareVal : false;
                break;
              case '<=':
                result = isValidNumber ? sortAttributeValue <= compareVal : false;
                break;
              case 'IN':
                result = comparator.includes(sortAttributeValue.toString())
                break;
              case 'NOT IN':
                result = !(comparator.includes(sortAttributeValue.toString()))
                break;
              case 'IS NOT NULL':
                result = sortAttributeValue !== null
                break;
              case 'IS NULL':
                result = sortAttributeValue === null
                break;
            }
            if (result) {
              $this.attr('style', `background-color:${cellBgColor || color}`);
            }
          }
        }
      });
  });

  console.timeEnd('Cellupdate')
  if (numGroups && !tableHasRowSpan && !tableHasColSpan) {
    // When there is only 1 group by column,
    // we use the DataTable plugin to make the header fixed.
    // The plugin takes care of the scrolling so we don't need
    // overflow: 'auto' on the table.
    container.style.overflow = 'hidden';
    console.time('DataTable')
    const table = $container.find('table').DataTable({
      paging: pageLength,
      searching: includeSearch ? true : false,
      bInfo: false,
      scrollY: `${height}px`,
      scrollCollapse: true,
      scrollX: true,
      bSort: true,
      order: orderByArr
    });
    table.draw();
    console.timeEnd('DataTable')
    fixTableHeight($container.find('.dataTables_wrapper'), height);
    $('.dataTables_filter').find('input').attr('placeholder', 'Search');
  } else {
    // When there is more than 1 group by column we just render the table, without using
    // the DataTable plugin, so we need to handle the scrolling ourselves.
    // In this case the header is not fixed.
    container.style.overflow = 'auto';
    container.style.height = `${height + 10}px`;
  }
}

PivotTable.displayName = 'PivotTable';
PivotTable.propTypes = propTypes;

export default PivotTable;
