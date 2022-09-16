const path = require('path');
const fs = require('fs');
const { INIT_CWD } = process.env;
const PKG_PATH = path.join(INIT_CWD, './package.json');
const PKG_BAK_PATH = path.join(INIT_CWD, './package.bak.json');
const pkg = require(PKG_BAK_PATH);

try {
  fs.writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2));
  fs.unlinkSync(PKG_BAK_PATH);
} catch (error) {
  console.log('error', error);
}
