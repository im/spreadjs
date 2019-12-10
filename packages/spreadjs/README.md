<p>
<h1 align="center">ele spreadjs</h1>
</p>

**为大象慧云spreadjs打造功能性的封装，让前端只需专注业务开发，无需了解spreadjs繁琐的配置。**

# 安装

```bash
npm install ele-spreadjs
```

# 快速应用

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
