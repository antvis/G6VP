var ghpages = require('gh-pages');
const fs = require('fs');
var fsExtra = require('fs-extra');
const path = require('path');

const siteUrl = 'graphinsight.antv.vision';
/** 修改CNAME  */
fs.writeFile(path.resolve(__dirname, '../dist', 'CNAME'), siteUrl, err => {
  if (err) {
    throw err;
  }
  console.log('The CNAME was succesfully created!');
});
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

/** 发布 */
ghpages.publish(
  './dist',
  {
    remote: 'upstream',
    branch: 'gh-pages',
    repo: 'https://github.com/antvis/gi-export.git',
    message: 'Auto-generated commit',
  },
  error => {
    console.log('success', error);
  },
);
