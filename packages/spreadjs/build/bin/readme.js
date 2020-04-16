var path = require('path');
var fs = require('fs');

var readmeContent = fs.readFileSync(path.resolve(process.cwd(), 'README.md')).toString();
fs.writeFileSync(path.resolve(process.cwd(), 'packages/spreadjs/README.md'), readmeContent);
