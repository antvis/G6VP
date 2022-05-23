var fsExtra = require('fs-extra');
const path = require('path');

fsExtra.copy(
  path.resolve(__dirname, '../dist/index.html'),
  path.resolve(__dirname, '../../gi-site/dist/home.html'),
  { overwrite: true },
  function (err) {
    if (err) return console.error(err);
    console.log('copy home.html success!');
  },
);
fsExtra.copy(
  path.resolve(__dirname, '../dist/'),
  path.resolve(__dirname, '../../gi-site/dist/'),
  { overwrite: false },
  function (err) {
    if (err) return console.error(err);
    console.log('copy umi.js and umi.css success!');
  },
);
