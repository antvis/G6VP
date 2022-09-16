const path = require('path');
const { INIT_CWD } = process.env;
const PKG_PATH = path.join(INIT_CWD, './package.json');
const PKG_BAK_PATH = path.join(INIT_CWD, './package.bak.json');
const pkg = require(PKG_PATH);

const fs = require('fs');
fs.writeFileSync(PKG_BAK_PATH, JSON.stringify(pkg, null, 2));

const { dependencies } = pkg;
Object.keys(dependencies).forEach(key => {
  if (dependencies[key] === 'workspace:*') {
    dependencies[key] = '*';
  }
});

fs.writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2));
