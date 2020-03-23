<h1 align="center" style="margin: 30px 0 35px;">Ele SpreadJS</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/ele-spreadjs"><img alt="npm" src="https://img.shields.io/npm/v/ele-spreadjs"></a>
</p>

🦑 **为大象慧云spreadjs打造功能性的封装，让前端只需专注业务开发，无需了解spreadjs繁琐的配置。**

# 安装

```bash
npm install ele-spreadjs
```

# 快速应用

### 初始化

```javascript
import initSpread from 'ele-spreadjs';

const options = {
  // 右键菜单
  context: true,
  // 批注
  comment: true,
  // 工具箱
  toolkit: toolkitdom,
}
const workbook = initSpread(exceldom, json, options);
```

### 导入导出excel

```javascript
import { excel } from 'ele-spreadjs';

/**
 * method 导入文件.
 * @param {String} type 需要的文件类型.
 * @param {Object} options 选项.
 * @return {String} return Promise { resolve spread json }.
 */
excel.importFunc('xlsx', { pako: true }).then(res => {
  console.log(res); // spread json
}).catch(e => {
  console.error(e);
})

/**
 * method 导出文件.
 * @param {Object} data Spread josn.
 * @param {Object} options 选项.
 * @return {String} return Promise { resolve file name }.
 */
excel.exportFunc(json, { pako: true }).then((filename) => {})
```

### SpreadJS相关

```javascript
import { GC, Excel } from 'ele-spreadjs';
```

