var ghpages = require('gh-pages');
const fs = require('fs');
const path = require('path');

const siteUrl = 'graphinsight.antv.vision';

fs.writeFile(path.resolve(__dirname, '../dist', 'CNAME'), siteUrl, err => {
  if (err) {
    throw err;
  }
  console.log('The CNAME was succesfully created!');
});

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
