import { GC, workbook } from './init';

var worksheet = null;
var clickCell = {};

/**
 * method update spread current status.
 */
function syncSpread() {
  worksheet = workbook.getActiveSheet();
  clickCell.row = worksheet.getActiveRowIndex();
  clickCell.col = worksheet.getActiveColumnIndex();
}

/**
 * method spread右键功能.
 */
export default function context() {
  // clear rightkey
  for (let i = workbook.contextMenu.menuData.length; i >= 0; i--) {
    const item = workbook.contextMenu.menuData[i];
    // delete 清除、过滤、排序、批注
    if (item && (item.name === 'gc.spread.clearContents' || item.name === 'gc.spread.filter'
      || item.name === 'gc.spread.sort' || item.name === 'gc.spread.insertComment'
      || item.name === 'gc.spread.editComment' || item.name === 'gc.spread.deleteComment'
      || item.name === 'gc.spread.toggleComment')) {
      workbook.contextMenu.menuData.splice(i, 1);
    }
  }
  const commandManager = workbook.commandManager();

  // 筛选
  const filter = {
    text: '筛选',
    name: 'filter',
    command: 'filter',
    workArea: 'viewport',
  };
  workbook.contextMenu.menuData.push(filter);
  const filterCommand = {
    canUndo: false,
    execute: (spread, options) => {
      syncSpread();
      worksheet.suspendPaint();
      const rowCount = worksheet.getRowCount();
      const selections = worksheet.getSelections();
      if (selections.length <= 0) {
        return;
      }
      worksheet.resumePaint();
      worksheet.rowFilter(new GC.Spread.Sheets.Filter.HideRowFilter(
        new GC.Spread.Sheets.Range(
          clickCell.row + 1, clickCell.col,
          rowCount - clickCell.row - 1, selections[0].colCount,
        ),
      ));
    },
  };
  commandManager.register('filter', filterCommand, null, false, false, false, false);

  // 插入行单元格下移
  const insertRow = {
    text: '插入行单元格下移',
    name: 'insertRow',
    command: 'insertRow',
    workArea: 'viewport',
  };
  workbook.contextMenu.menuData.push(insertRow);
  const insertRowCommand = {
    canUndo: false,
    execute: (spread, options) => {
      syncSpread();
      worksheet.suspendPaint();
      worksheet.addRows(worksheet.getRowCount(GC.Spread.Sheets.SheetArea.viewport), 1);
      const rowCount = worksheet.getRowCount();
      const selections = worksheet.getSelections();
      let selectionIndex = 0;
      const selectionCount = selections.length;
      for (; selectionIndex < selectionCount; selectionIndex++) {
        const selection = selections[selectionIndex];
        worksheet.moveTo(selection.row, selection.col, selection.row + 1, selection.col,
          rowCount - selection.row - 1, selection.colCount, GC.Spread.Sheets.CopyToOptions.all);
      }
      worksheet.resumePaint();
    },
  };
  commandManager.register('insertRow', insertRowCommand, null, false, false, false, false);

  // 插入列单元格右移
  const insertColumn = {
    text: '插入列单元格右移',
    name: 'insertColumn',
    command: 'insertColumn',
    workArea: 'viewport',
  };
  workbook.contextMenu.menuData.push(insertColumn);
  const insertColumnCommand = {
    canUndo: false,
    execute: (spread, options) => {
      syncSpread();
      worksheet.suspendPaint();
      worksheet.addColumns(worksheet.getColumnCount(GC.Spread.Sheets.SheetArea.viewport), 1);
      const colCount = worksheet.getColumnCount();
      const selections = worksheet.getSelections();
      let selectionIndex = 0;
      const selectionCount = selections.length;
      for (; selectionIndex < selectionCount; selectionIndex++) {
        const selection = selections[selectionIndex];
        worksheet.moveTo(selection.row, selection.col, selection.row, selection.col + 1, selection.rowCount,
          colCount - selection.col - 1, GC.Spread.Sheets.CopyToOptions.all);
      }
      worksheet.resumePaint();
    },
  };
  commandManager.register('insertColumn', insertColumnCommand, null, false, false, false, false);

  // 删除行单元格上移
  const removeRow = {
    text: '删除行单元格上移',
    name: 'removeRow',
    command: 'removeRow',
    workArea: 'viewport',
  };
  workbook.contextMenu.menuData.push(removeRow);
  const removeRowCommand = {
    canUndo: false,
    execute: (spread, options) => {
      syncSpread();
      worksheet.suspendPaint();
      // worksheet.deleteRows(worksheet.getRowCount(GC.Spread.Sheets.SheetArea.viewport), 1);
      const rowCount = worksheet.getRowCount();
      const selections = worksheet.getSelections();
      let selectionIndex = 0;
      const selectionCount = selections.length;
      for (; selectionIndex < selectionCount; selectionIndex++) {
        const selection = selections[selectionIndex];
        worksheet.moveTo(selection.row + 1, selection.col, selection.row, selection.col,
          rowCount - selection.row - 1, selection.colCount, GC.Spread.Sheets.CopyToOptions.all);
      }
      worksheet.resumePaint();
    },
  };
  commandManager.register('removeRow', removeRowCommand, null, false, false, false, false);

  // 删除列单元格左移
  const removeColumn = {
    text: '删除列单元格左移',
    name: 'removeColumn',
    command: 'removeColumn',
    workArea: 'viewport',
  };
  workbook.contextMenu.menuData.push(removeColumn);
  const removeColumnCommand = {
    canUndo: false,
    execute: (spread, options) => {
      syncSpread();
      worksheet.suspendPaint();
      // worksheet.deleteColumns(worksheet.getColumnCount(GC.Spread.Sheets.SheetArea.viewport), 1);
      const colCount = worksheet.getColumnCount();
      const selections = worksheet.getSelections();
      let selectionIndex = 0;
      const selectionCount = selections.length;
      for (; selectionIndex < selectionCount; selectionIndex++) {
        const selection = selections[selectionIndex];
        worksheet.moveTo(selection.row, selection.col + 1, selection.row, selection.col,
          selection.rowCount, colCount - selection.col - 1, GC.Spread.Sheets.CopyToOptions.all);
      }
      worksheet.resumePaint();
    },
  };
  commandManager.register('removeColumn', removeColumnCommand, null, false, false, false, false);

  // 增加冻结窗格功能
  const frozenAction = {
    text: '冻结单元格',
    name: 'frozenAction',
    command: 'frozenAction',
    workArea: 'viewport',
  };
  workbook.contextMenu.menuData.push(frozenAction);
  const frozenActionCommand = {
    canUndo: false,
    execute: (spread, options) => {
      syncSpread();
      worksheet.suspendPaint();

      worksheet.frozenRowCount(clickCell.row);
      worksheet.frozenColumnCount(clickCell.col);
      worksheet.options.frozenlineColor = 'red';

      worksheet.resumePaint();
    },
  };
  commandManager.register('frozenAction', frozenActionCommand, null, false, false, false, false);

  // 删除冻结窗格
  const removeFrozenAction = {
    text: '取消冻结单元格',
    name: 'removeFrozenAction',
    command: 'removeFrozenAction',
    workArea: 'viewport',
  };
  workbook.contextMenu.menuData.push(removeFrozenAction);
  const removeFrozenActionCommand = {
    canUndo: false,
    execute: (spread, options) => {
      syncSpread();
      worksheet.suspendPaint();

      worksheet.frozenRowCount(0);
      worksheet.frozenColumnCount(0);

      worksheet.resumePaint();
    },
  };
  commandManager.register('removeFrozenAction', removeFrozenActionCommand, null, false, false, false, false);
}


//
// /**
//  * method get cell style.
//  * @param {Object} GC spread GC.
//  * @return {Object} return the style obj we want.
//  */
// export function getCellStyle() {
//   const cellStyle = {};
//   const sheet = this.worksheet;
//   const sel = sheet.getSelections();
//   if (sel.length > 0) {
//     const style = sheet.getStyle(sel[0].row, sel[0].col) || new GC.Spread.Sheets.Style();
//     if (!style) {
//       return;
//     }
//
//     // 粗体
//     cellStyle.cellBold = !!((style.font && style.font.indexOf('bold') > -1));
//
//     // 倾斜
//     cellStyle.cellItalic = !!((style.font && style.font.indexOf('italic') > -1));
//
//     // 下划线
//     cellStyle.cellUnderline = style.textDecoration === GC.Spread.Sheets.TextDecorationType.underline;
//
//     // 对齐方式
//     cellStyle.cellLeft = style.hAlign === GC.Spread.Sheets.HorizontalAlign.left;
//     cellStyle.cellCenter = style.hAlign === GC.Spread.Sheets.HorizontalAlign.center;
//     cellStyle.cellRight = style.hAlign === GC.Spread.Sheets.HorizontalAlign.right;
//
//     // 单元格格式
//     cellStyle.cellFormatter = !style.formatter ? 'normal' : style.formatter;
//
//     // 字体
//     if (style.font) {
//       const fontArray = style.font.split(' ');
//       for (const [index, elem] of fontArray.entries()) {
//         if (elem.indexOf('px') > -1) {
//           cellStyle.cellFont = fontArray[index + 1];
//           break;
//         } else {
//           cellStyle.cellFont = '';
//         }
//       }
//     } else {
//       this.cellFont = '';
//     }
//
//     // 字体大小
//     if (style.font) {
//       const fontArray = style.font.split(' ');
//       for (const [index, elem] of fontArray.entries()) {
//         if (elem.indexOf('px') > -1) {
//           cellStyle.cellFontsize = elem.match(/(\S*)px/)[0];
//           break;
//         } else {
//           cellStyle.cellFontsize = '';
//         }
//       }
//     } else {
//       cellStyle.cellFontsize = '';
//     }
//
//     return cellStyle;
//   }
// }

