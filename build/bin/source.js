const path = require('path');
const fs = require('fs');
const sp = require('shell-spawn');
const copydir = require('copy-dir');

const packageFilePaths = [
  path.resolve(__dirname, '../../packages/spreadjs/legacy'),
  path.resolve(__dirname, '../../packages/spreadjs/src'),
  path.resolve(__dirname, '../../packages/spreadjs/style'),
  path.resolve(__dirname, '../../packages/spreadjs/context'),
  path.resolve(__dirname, '../../packages/spreadjs/toolkit'),
]

const dirNames = ['legacy', 'src', 'style', 'context', 'toolkit'];

// clean
sp('rm -rf ' + packageFilePaths.join(' ')).then(() => {
  // move
  dirNames.forEach((dir, index) => {
    copydir(path.resolve(process.cwd(), dir), packageFilePaths[index], {cover: true})
  })
}).catch(e => {
  console.log(e)
})

// readme
const readmeContent = fs.readFileSync(path.resolve(process.cwd(), 'README.md')).toString();
fs.writeFileSync(path.resolve(process.cwd(), 'packages/spreadjs/README.md'), readmeContent);

