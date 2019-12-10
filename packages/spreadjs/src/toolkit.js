/**
 * @file 工具箱
 * @author Angus Yang
 * @date 2019/12/10
 * @description
 */

import $ from 'jquery';
import { GC, workbook } from './init';
import { BUTTON_STYLE, SPLIT_STYLE, UNCHECKED_COLOR, CHECKED_COLOR } from './style';
import { formatterOptions, fontOptions, fontsizeOptions } from './options';
import tcellStyle from '../../../../TaxModule/Modules/System/MouldProvision/ProvisionTemplate';

let worksheet = null;
const clickCell = {};

// 格式刷
const formatPainter = {
  isPainting: false,
  fromSheet: null,
  fromRange: null,
};

// 单元格样式
const cellStyle = {
  cellBold: false,
  cellItalic: false,
  cellUnderline: false,
  cellLeft: false,
  cellCenter: false,
  cellRight: false,
  cellTop: false,
  cellMiddle: false,
  cellBottom: false,
  cellFormatter: 'normal',
  cellFont: '宋体',
  cellFontsize: '12px',
  cellMicrometerOperator: false,
};

/**
 * method cell changed event.
 */
function bindEvnet() {
  workbook.bind(GC.Spread.Sheets.Events.CellClick, (e, args) => {
    clickCell.row = args.row;
    clickCell.col = args.col;

    painterPaste();

    Object.assign(cellStyle, getCellStyle());
  });
}

/**
 * method update spread current status.
 */
function syncSpread() {
  worksheet = workbook.getActiveSheet();
  clickCell.row = worksheet.getActiveRowIndex();
  clickCell.col = worksheet.getActiveColumnIndex();
}

/**
 * method get current checked cell style.
 */
function getCellStyle() {
  const sheet = worksheet;
  const sel = sheet.getSelections();
  if (sel.length > 0) {
    const style = sheet.getStyle(sel[0].row, sel[0].col) || new GC.Spread.Sheets.Style();
    if (!style) {
      return;
    }

    // 粗体
    cellStyle.cellBold = !!((style.font && style.font.indexOf('bold') > -1));

    // 倾斜
    cellStyle.cellItalic = !!((style.font && style.font.indexOf('italic') > -1));

    // 下划线
    cellStyle.cellUnderline = style.textDecoration === GC.Spread.Sheets.TextDecorationType.underline;

    // 水平对齐方式
    cellStyle.cellLeft = style.hAlign === GC.Spread.Sheets.HorizontalAlign.left;
    cellStyle.cellCenter = style.hAlign === GC.Spread.Sheets.HorizontalAlign.center;
    cellStyle.cellRight = style.hAlign === GC.Spread.Sheets.HorizontalAlign.right;

    // 垂直对齐方式
    cellStyle.cellTop = style.vAlign === GC.Spread.Sheets.VerticalAlign.top;
    cellStyle.cellMiddle = style.vAlign === GC.Spread.Sheets.VerticalAlign.center;
    cellStyle.cellBottom = style.vAlign === GC.Spread.Sheets.VerticalAlign.bottom;

    // 单元格格式
    cellStyle.cellFormatter = !style.formatter ? 'normal' : style.formatter;

    // 字体
    if (style.font) {
      const fontArray = style.font.split(' ');
      for (const [index, elem] of fontArray.entries()) {
        if (elem.indexOf('px') > -1) {
          cellStyle.cellFont = fontArray[index + 1];
          break;
        } else {
          cellStyle.cellFont = '';
        }
      }
    } else {
      cellStyle.cellFont = '';
    }

    // 字体大小
    if (style.font) {
      const fontArray = style.font.split(' ');
      for (const [index, elem] of fontArray.entries()) {
        if (elem.indexOf('px') > -1) {
          cellStyle.cellFontsize = elem.match(/(\S*)px/)[0];
          break;
        } else {
          cellStyle.cellFontsize = '';
        }
      }
    } else {
      cellStyle.cellFontsize = '';
    }

    updateCellStyle();
    return cellStyle;
  }
}

/**
 * method update cell style.
 */
function updateCellStyle() {
  // for(const key of Object.keys(cellStyle)) {
  //   checked(key, cellStyle[key]);
  // }
  checked('#cellBold', cellStyle.cellBold);
  checked('#cellItalic', cellStyle.cellItalic);
  checked('#cellUnderline', cellStyle.cellUnderline);
  checked('#cellLeft', cellStyle.cellLeft);
  checked('#cellCenter', cellStyle.cellCenter);
  checked('#cellRight', cellStyle.cellRight);
  checked('#cellTop', cellStyle.cellTop);
  checked('#cellMiddle', cellStyle.cellMiddle);
  checked('#cellBottom', cellStyle.cellBottom);
  checked('#cellMicrometerOperator', cellStyle.cellFormatter === '#,##0.00');

  $('#cellFont').val(cellStyle.cellFont);
  $('#cellFontsize').val(cellStyle.cellFontsize);
  $('#cellFormatter').val(cellStyle.cellFormatter);
}

/**
 * method change checked or unchecked color.
 * @param {String} id Dom id.
 * @param {Boolean} checked Wheather checked.
 */
function checked(id, checked) {
  $(id).css('color', checked ? CHECKED_COLOR : UNCHECKED_COLOR);
}

/**
 * method painter copy.
 */
function painterCopy() {
  formatPainter.fromRange = worksheet.getSelections()[0];
  formatPainter.fromSheet = worksheet;
  formatPainter.isPainting = true;
  checked('#painter', true);
}

/**
 * method painter paste.
 */
function painterPaste() {
  if (!formatPainter.isPainting) {
    return;
  }
  formatPainter.isPainting = false;
  const sheet = worksheet;
  sheet.suspendPaint();
  const toRange = sheet.getSelections()[0];
  const fromRange = formatPainter.fromRange;
  const fromSheet = formatPainter.fromSheet;
  // toRange biger than fromRange
  if (fromRange.rowCount > toRange.rowCount) {
    toRange.rowCount = fromRange.rowCount;
  }
  if (fromRange.colCount > toRange.colCount) {
    toRange.colCount = fromRange.colCount;
  }
  // toRange must in Sheet
  if (toRange.row + toRange.rowCount > sheet.getRowCount()) {
    toRange.rowCount = sheet.getRowCount() - toRange.row;
  }
  if (toRange.col + toRange.colCount > sheet.getColumnCount()) {
    toRange.colCount = sheet.getColumnCount() - toRange.col;
  }
  const rowStep = fromRange.rowCount;
  const colStep = fromRange.colCount;
  const endRow = toRange.row + toRange.rowCount - 1;
  const endCol = toRange.col + toRange.colCount - 1;

  // if toRange bigger than fromRange, repeat paint
  for (let startRow = toRange.row; startRow <= endRow; startRow += rowStep) {
    for (let startCol = toRange.col; startCol <= endCol; startCol += colStep) {
      const rowCount = startRow + rowStep > endRow + 1 ? endRow - startRow + 1 : rowStep;
      const colCount = startCol + colStep > endCol + 1 ? endCol - startCol + 1 : colStep;
      const fromRanges = new GC.Spread.Sheets.Range(fromRange.row, fromRange.col, rowCount, colCount);
      const pastedRange = new GC.Spread.Sheets.Range(startRow, startCol, rowCount, colCount);
      workbook.commandManager()
        .execute({
          cmd: 'clipboardPaste',
          sheetName: sheet.name(),
          fromSheet,
          fromRanges: [fromRanges],
          pastedRanges: [pastedRange],
          isCutting: false,
          clipboardText: '',
          pasteOption: GC.Spread.Sheets.ClipboardPasteOptions.formatting,
        });
    }
  }
  sheet.resumePaint();
  checked('#painter', false);
}

/**
 * method bold.
 */
function boldCell() {
  const sheet = worksheet;
  const sel = sheet.getSelections();
  sheet.suspendPaint();
  if (sel.length > 0) {
    const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
    for (let row = range.row; row < (range.row + range.rowCount); row++) {
      for (let col = range.col; col < (range.col + range.colCount); col++) {
        const style = sheet.getStyle(row, col) || new GC.Spread.Sheets.Style();
        if (!style.font) {
          style.font = 'normal normal 12px 宋体';
        }
        const fontArray = style.font.split(' ');
        if (cellStyle.cellBold) {
          for (const [index, elem] of fontArray.entries()) {
            if (elem === 'bold') {
              fontArray[index] = 'normal';
              break;
            }
          }
        } else if (!cellStyle.cellBold && fontArray.length >= 4) {
          for (const [index, elem] of fontArray.entries()) {
            if (elem === 'normal' && index <= 1) {
              fontArray[index] = 'bold';
              break;
            }
          }
        } else {
          fontArray.unshift('bold');
        }
        const newFont = fontArray.join(' ');
        sheet.getCell(row, col).font(newFont);
      }
    }
    cellStyle.cellBold = !cellStyle.cellBold;
    checked('#cellBold', cellStyle.cellBold);
  }
  sheet.resumePaint();
}

/**
 * method italic.
 */
function italicCell() {
  const sheet = worksheet;
  const sel = sheet.getSelections();
  sheet.suspendPaint();
  if (sel.length > 0) {
    const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
    for (let row = range.row; row < (range.row + range.rowCount); row++) {
      for (let col = range.col; col < (range.col + range.colCount); col++) {
        const style = sheet.getStyle(row, col) || new GC.Spread.Sheets.Style();
        if (!style.font) {
          style.font = 'normal normal 12px 宋体';
        }
        const fontArray = style.font.split(' ');
        if (cellStyle.cellItalic) {
          for (const [index, elem] of fontArray.entries()) {
            if (elem === 'italic') {
              fontArray[index] = 'normal';
              break;
            }
          }
        } else if (!cellStyle.cellItalic && fontArray.length >= 4) {
          for (const [index, elem] of fontArray.entries()) {
            if (elem === 'normal' && index <= 1) {
              fontArray[index] = 'italic';
              break;
            }
          }
        } else {
          fontArray.unshift('italic');
        }
        const newFont = fontArray.join(' ');
        sheet.getCell(row, col).font(newFont);
      }
    }
    cellStyle.cellItalic = !cellStyle.cellItalic;
    checked('#cellItalic', cellStyle.cellItalic);
  }
  sheet.resumePaint();
}

/**
 * method underline.
 */
function underlineCell() {
  const sheet = worksheet;
  const sel = sheet.getSelections();
  sheet.suspendPaint();
  if (sel.length > 0) {
    const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
    for (let row = range.row; row < (range.row + range.rowCount); row++) {
      for (let col = range.col; col < (range.col + range.colCount); col++) {
        if (cellStyle.cellUnderline) {
          sheet.getCell(row, col).textDecoration(undefined);
        } else {
          sheet.getCell(row, col).textDecoration(GC.Spread.Sheets.TextDecorationType.underline);
        }
      }
    }
    cellStyle.cellUnderline = !cellStyle.cellUnderline;
    checked('#cellUnderline', cellStyle.cellUnderline);
  }
  sheet.resumePaint();
}

/**
 * method set font.
 * @param {Object | String} e Selected font.
 */
function setFont(e) {
  var value;
  if (typeof e === 'object') {
    value = e.target.value;
  } else {
    value = e;
  }
  const sheet = worksheet;
  const sel = sheet.getSelections();
  sheet.suspendPaint();
  if (sel.length > 0) {
    const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
    for (let row = range.row; row < (range.row + range.rowCount); row++) {
      for (let col = range.col; col < (range.col + range.colCount); col++) {
        const style = sheet.getStyle(row, col) || new GC.Spread.Sheets.Style();
        if (!style.font) {
          style.font = 'normal normal 12px 宋体';
        }
        const fontArray = style.font.split(' ');
        for (const [index, elem] of fontArray.entries()) {
          if (elem.indexOf('px') > -1) {
            fontArray[index + 1] = value;
            break;
          }
        }
        const newFont = fontArray.join(' ');
        sheet.getCell(row, col).font(newFont);
      }
    }
    cellStyle.cellFont = value;
  }
  sheet.resumePaint();
}

/**
 * method set font size.
 * @param {Object | String} e Selected font size.
 */
function setFontsize(e) {
  var value;
  if (typeof e === 'object') {
    value = e.target.value;
  } else {
    value = e;
  }
  const sheet = worksheet;
  const sel = sheet.getSelections();
  sheet.suspendPaint();
  if (sel.length > 0) {
    const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
    for (let row = range.row; row < (range.row + range.rowCount); row++) {
      for (let col = range.col; col < (range.col + range.colCount); col++) {
        const style = sheet.getStyle(row, col) || new GC.Spread.Sheets.Style();
        if (!style.font) {
          style.font = 'normal normal 12px 宋体';
        }
        const fontArray = style.font.split(' ');
        for (const [index, elem] of fontArray.entries()) {
          if (elem.indexOf('px') > -1) {
            fontArray[index] = value;
            break;
          }
        }
        const newFont = fontArray.join(' ');
        sheet.getCell(row, col).font(newFont);
      }
    }
    cellStyle.cellFontsize = value;
  }
  sheet.resumePaint();
}

/**
 * method Horizontal alignment.
 * @param {String} align Align the direction.
 */
function hAlignCell(align = 'center') {
  cellStyle.cellLeft = false;
  cellStyle.cellRight = false;
  cellStyle.cellCenter = false;
  const sheet = worksheet;
  const sel = sheet.getSelections();
  sheet.suspendPaint();
  if (sel.length > 0) {
    const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
    for (let row = range.row; row < (range.row + range.rowCount); row++) {
      for (let col = range.col; col < (range.col + range.colCount); col++) {
        sheet.getCell(row, col).hAlign(GC.Spread.Sheets.HorizontalAlign[align]);
      }
    }
  }
  switch (align) {
    case 'center':
      cellStyle.cellCenter = true;
      break;
    case 'left':
      cellStyle.cellLeft = true;
      break;
    case 'right':
      cellStyle.cellRight = true;
      break;
  }
  checked('#cellLeft', cellStyle.cellLeft);
  checked('#cellCenter', cellStyle.cellCenter);
  checked('#cellRight', cellStyle.cellRight);
  sheet.resumePaint();
}

/**
 * method Vertical alignment.
 * @param {String} align Align the direction.
 */
function vAlignCell(align = 'center') {
  cellStyle.cellTop = false;
  cellStyle.cellMiddle = false;
  cellStyle.cellBottom = false;
  const sheet = worksheet;
  const sel = sheet.getSelections();
  sheet.suspendPaint();
  if (sel.length > 0) {
    const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
    for (let row = range.row; row < (range.row + range.rowCount); row++) {
      for (let col = range.col; col < (range.col + range.colCount); col++) {
        sheet.getCell(row, col).vAlign(GC.Spread.Sheets.VerticalAlign[align]);
      }
    }
  }
  switch (align) {
    case 'center':
      cellStyle.cellMiddle = true;
      break;
    case 'top':
      cellStyle.cellTop = true;
      break;
    case 'bottom':
      cellStyle.cellBottom = true;
      break;
  }
  checked('#cellTop', cellStyle.cellTop);
  checked('#cellMiddle', cellStyle.cellMiddle);
  checked('#cellBottom', cellStyle.cellBottom);
  sheet.resumePaint();
}

/**
 * method get cell range.
 */
function getActualCellRange(cellRange, rowCount, columnCount) {
  const spreadNS = GC.Spread.Sheets;
  if (cellRange.row === -1 && cellRange.col === -1) {
    return new spreadNS.Range(0, 0, rowCount, columnCount);
  } if (cellRange.row === -1) {
    return new spreadNS.Range(0, cellRange.col, rowCount, cellRange.colCount);
  } if (cellRange.col === -1) {
    return new spreadNS.Range(cellRange.row, 0, cellRange.rowCount, columnCount);
  }

  return cellRange;
}

/**
 * method merge cell.
 */
function mergeCell() {
  const sheet = worksheet;
  sheet.suspendPaint();
  sheet.options.allowCellOverflow = true;
  let sel = sheet.getSelections();
  if (sel.length > 0) {
    sel = getActualCellRange(sel[sel.length - 1], sheet.getRowCount(), sheet.getColumnCount());
    sheet.addSpan(sel.row, sel.col, sel.rowCount, sel.colCount);
  }
  sheet.resumePaint();
}

/**
 * method unmerge cell.
 */
function unmergeCell() {
  const sheet = worksheet;
  sheet.suspendPaint();
  sheet.options.allowCellOverflow = true;
  let sel = sheet.getSelections();
  if (sel.length > 0) {
    sel = getActualCellRange(sel[sel.length - 1], sheet.getRowCount(), sheet.getColumnCount());
    for (let i = 0; i < sel.rowCount; i++) {
      for (let j = 0; j < sel.colCount; j++) {
        sheet.removeSpan(i + sel.row, j + sel.col);
      }
    }
  }
  sheet.resumePaint();
}

/**
 * method add border.
 */
function addBorder() {
  const sheet = worksheet;
  const sel = sheet.getSelections();
  sheet.suspendPaint();
  if (sel.length > 0) {
    const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
    const lineBorder = new GC.Spread.Sheets.LineBorder('black', GC.Spread.Sheets.LineStyle.thin);
    range.setBorder(lineBorder, { all: true });
  }
  sheet.resumePaint();
}

/**
 * method delete border.
 */
function delBorder() {
  const sheet = worksheet;
  const sel = sheet.getSelections();
  sheet.suspendPaint();
  if (sel.length > 0) {
    const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
    range.setBorder(null, { all: true });
  }
  sheet.resumePaint();
}

/**
 * method set cell formatter.
 * @param {String} e Will be set type.
 */
function setFormatter(e) {
  var value;
  if (typeof e === 'object') {
    value = e.target.value;
  } else {
    value = e;
  }
  const sheet = worksheet;
  const sel = sheet.getSelections();
  sheet.suspendPaint();
  if (sel.length > 0) {
    const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
    for (let row = range.row; row < (range.row + range.rowCount); row++) {
      for (let col = range.col; col < (range.col + range.colCount); col++) {
        if (value === 'normal') {
          sheet.getCell(row, col).formatter(undefined);
        } else if (value === '#,##0.00') { // 千分符
          if (cellStyle.cellMicrometerOperator) {
            value = 'normal';
            sheet.getCell(row, col).formatter(undefined);
          } else {
            sheet.getCell(row, col).formatter(value);
          }
        } else {
          sheet.getCell(row, col).formatter(value);
        }
      }
    }
    cellStyle.cellMicrometerOperator = !cellStyle.cellMicrometerOperator;
  }
  checked('#cellMicrometerOperator', cellStyle.cellMicrometerOperator);
  sheet.resumePaint();
  cellStyle.cellFormatter = value;
}

/**
 * method unlock.
 */
function unlock() {
  const sheet = worksheet;
  const sel = sheet.getSelections();
  sheet.suspendPaint();
  if (sel.length > 0) {
    sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount).locked(false);
  }
  sheet.resumePaint();
}

/**
 * method render toolkit.
 */
function renderNode() {
  return `<div style="width: 100%; height: 100%;">
    <button id="painter" style="${BUTTON_STYLE}">格式刷</button>
    <span style="${SPLIT_STYLE}">|</span>
    <button id="cellBold" style="${BUTTON_STYLE}">B</button>
    <button id="cellItalic" style="${BUTTON_STYLE}">I</button>
    <button id="cellUnderline" style="${BUTTON_STYLE}">U</button>
    <span style="${SPLIT_STYLE}">|</span>
    <button style="${BUTTON_STYLE}">字体：</button>
    <select id="cellFont">
    ${fontOptions.map(font => `<option value="${font.value}">${font.label}</option>`)}
    </select>
    <button style="${BUTTON_STYLE}">字体大小：</button>
    <select id="cellFontsize">
    ${fontsizeOptions.map(font => `<option value="${font.value}">${font.label}</option>`)}
    </select>
    <button style="${BUTTON_STYLE}">单元格格式：</button>
    <select id="cellFormatter">
    ${formatterOptions.map(font => `<option value="${font.value}">${font.label}</option>`)}
    </select>
    <span style="${SPLIT_STYLE}">|</span>
    <button style="${BUTTON_STYLE}">水平对齐：</button>
    <button id="cellLeft" style="${BUTTON_STYLE}">居左</button>
    <button id="cellCenter" style="${BUTTON_STYLE}">居中</button>
    <button id="cellRight" style="${BUTTON_STYLE}">居右</button>
    <span style="${SPLIT_STYLE}">|</span>
    <button style="${BUTTON_STYLE}">垂直对齐：</button>
    <button id="cellTop" style="${BUTTON_STYLE}">顶部</button>
    <button id="cellMiddle" style="${BUTTON_STYLE}">居中</button>
    <button id="cellBottom" style="${BUTTON_STYLE}">底部</button>
    <span style="${SPLIT_STYLE}">|</span>
    <button id="cellMerge" style="${BUTTON_STYLE}">合并单元格</button>
    <button id="cellUnMerge" style="${BUTTON_STYLE}">分解单元格</button>
    <span style="${SPLIT_STYLE}">|</span>
    <button id="cellBorder" style="${BUTTON_STYLE}">添加边框</button>
    <button id="cellUnBorder" style="${BUTTON_STYLE}">删除边框</button>
    <span style="${SPLIT_STYLE}">|</span>
    <button id="cellMicrometerOperator" style="${BUTTON_STYLE}">千分符(,)</button>
    <button id="cellUnLock" style="${BUTTON_STYLE}">解锁</button>
  </div>`;
}

/**
 * method toolkit for spreadjs.
 * @param {Object} dom The dom that toolkit will be rendered.
 */
export default function toolkit(dom) {
  $(dom).append(renderNode());
  syncSpread();
  bindEvnet();
  Object.assign(cellStyle, getCellStyle());
  $('#painter').on('click', painterCopy);
  $('#cellBold').on('click', boldCell);
  $('#cellItalic').on('click', italicCell);
  $('#cellUnderline').on('click', underlineCell);
  $('#cellFont').on('change', setFont);
  $('#cellFontsize').on('change', setFontsize);
  $('#cellFormatter').on('change', setFormatter);
  $('#cellLeft').on('click', hAlignCell.bind(null, 'left'));
  $('#cellCenter').on('click', hAlignCell.bind(null, 'center'));
  $('#cellRight').on('click', hAlignCell.bind(null, 'right'));
  $('#cellTop').on('click', vAlignCell.bind(null, 'top'));
  $('#cellMiddle').on('click', vAlignCell.bind(null, 'center'));
  $('#cellBottom').on('click', vAlignCell.bind(null, 'bottom'));
  $('#cellMerge').on('click', mergeCell);
  $('#cellUnMerge').on('click', unmergeCell);
  $('#cellBorder').on('click', addBorder);
  $('#cellUnBorder').on('click', delBorder);
  $('#cellMicrometerOperator').on('click', setFormatter.bind(null, '#,##0.00'));
  $('#cellUnLock').on('click', unlock);
}
