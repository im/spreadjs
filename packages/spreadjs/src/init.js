import GC from '@grapecity/spread-sheets';
import Excel from '@grapecity/spread-excelio';
import ZH from '@grapecity/spread-sheets-resources-zh';
import '@grapecity/spread-sheets/styles/gc.spread.sheets.css'
import LicenseKey from './license';
import context from './context';
import comment from './comment';
import toolkit from './toolkit';
import excel from './excel';

let workbook = null;
GC.Spread.Sheets.LicenseKey = LicenseKey;
Excel.LicenseKey = LicenseKey;

/**
 * method recalculation excel formula.
 */
function recalcAll() {
  setTimeout(() => {
    workbook.getActiveSheet().recalcAll();
  });
}

/**
 * method initialize the excel.
 * @param {Object} dom The dom that excel will be rendered.
 * @param {JSON} json Spread json.
 * @param {JSON} options Apply feature.
 * @return {Object} return Spread workbook object.
 */
function initSpread(dom, json, options = {}) {
  GC.Spread.Common.CultureManager.culture('zh-cn');
  workbook = new GC.Spread.Sheets.Workbook(dom);
  json.activeSheetIndex = 0;
  workbook.fromJSON(json, { doNotRecalculateAfterLoad: true });

  // 滚动条是否对齐视图中表单的最后一行或一列
  workbook.options.scrollbarMaxAlign = true;

  // 重新计算公式
  // workbook.options.calcOnDemand = true;

  recalcAll(workbook);

  // feature
  if (options.context) {
    context();
  }

  if (options.comment) {
    comment();
  }

  if (options.toolkit) {
    toolkit(options.toolkit);
  }


  return workbook;
}

export { GC, Excel, LicenseKey, excel, workbook };

export default initSpread;
