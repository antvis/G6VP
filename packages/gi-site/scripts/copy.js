var fsExtra = require('fs-extra');
const path = require('path');
/** 从gi-portal中拷贝产物*/

fsExtra.copy(
  path.resolve(__dirname, '../../gi-portal/dist/index.html'),
  path.resolve(__dirname, '../dist/home.html'),
  { overwrite: true },
  function (err) {
    if (err) return console.error(err);
    console.log('copy home.html success!');
  },
);
fsExtra.copy(
  path.resolve(__dirname, '../../gi-portal/dist/'),
  path.resolve(__dirname, '../dist/'),
  { overwrite: false },
  function (err) {
    if (err) return console.error(err);
    console.log('copy home.js success!');
  },
);
