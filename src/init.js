import GC from '@grapecity/spread-sheets';
import Excel from '@grapecity/spread-excelio';
import LicenseKey from './license';
import context from './context';
import comment from './comment';
import toolkit from './toolkit';

let workbook = null;

/**
 * method recalculation excel formula.
 */
function recalcAll() {
  setTimeout(() => workbook.getActiveSheet().recalcAll());
}

/**
 * method initialize the excel.
 * @param {Object} dom The dom that excel will be rendered.
 * @param {JSON} json Spread json.
 * @param {JSON} options Apply feature.
 * @return {Object} return Spread workbook object.
 */
function initSpread(dom, json, options = {}) {
  const spreadNS = GC.Spread.Sheets;
  spreadNS.LicenseKey = LicenseKey;
  Excel.LicenseKey = LicenseKey;
  GC.Spread.Common.CultureManager.culture('zh-cn');
  workbook = new spreadNS.Workbook(dom);
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

export { GC, workbook };

export default initSpread;
