var ghpages = require('gh-pages');
const fs = require('fs');
const path = require('path');

const siteUrl = 'graphinsight.antv.vision';
/** 修改CNAME  */
fs.writeFile(path.resolve(__dirname, '../dist', 'CNAME'), siteUrl, err => {
  if (err) {
    throw err;
  }
  console.log('The CNAME was succesfully created!');
});
/** 发布 */
ghpages.publish(
  './dist',
  {
    remote: 'upstream',
    branch: 'gh-pages',
    repo: 'https://github.com/antvis/GraphInsight.git',
    message: 'Auto-generated commit',
  },
  error => {
    console.log('success', error);
  },
);
