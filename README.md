<h1 align="center" style="margin: 30px 0 35px;">Ele SpreadJS</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/@ele-cloud/spreadjs"><img alt="npm" src="https://img.shields.io/npm/v/@ele-cloud/spreadjs"></a>
</p>

🦑 **为大象慧云spreadjs打造功能性的封装，让前端只需专注业务开发，无需了解spreadjs繁琐的配置。**

# 安装

```bash
npm install @ele-cloud/spreadjs
```

# 快速应用

### 注入授权码

```javascript
import { injectLicenseKey } from '@ele-cloud/spreadjs';
injectLicenseKey('授权码xxx');
```

### 初始化

```javascript
import initSpread from '@ele-cloud/spreadjs';

const options = {
  // 右键菜单
  context: true,
  // 批注
  comment: true,
  // 工具箱
  toolkit: toolkitdom,
  // 重新计算公式
  recalc: true
}
const workbook = initSpread(exceldom, json, options);
```

### 导入导出excel

```javascript
import { excel } from '@ele-cloud/spreadjs';

/**
 * method 导入文件.
 * @param {String} type 需要的文件类型.
 * @param {Object} options 配置.
 * @return {String} return Promise.
 */
excel.importFunc('xlsx', { tagId: true, pako: true }).then(res => {
  console.log(res); // {json: ..., filename: ...}
}).catch(e => {
  console.error(e);
})

/**
 * method 导出文件.
 * @param {Object} data Spread json.
 * @param {Object} options 配置.
 * @return {String} return Promise { resolve file name }.
 */
excel.exportFunc(json, { filename: '自定义文件名称.xlsx', pako: true }).then((filename) => {})
```

### SpreadJS相关

```javascript
import { GC, Excel } from '@ele-cloud/spreadjs';
```

