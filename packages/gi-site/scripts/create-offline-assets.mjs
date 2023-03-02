import fs from 'fs';
import fetch from 'node-fetch';

import assets from './assets_package.json' assert { type: 'json' };

assets.forEach(item => {
  const { url, name } = item;

  fetch(url)
    .then(res => {
      return res.text();
    })
    .then(res => {
      fs.writeFile(`../public/${name}.min.js`, res, error => {
        if (error) {
          console.log(`%c Error! JS : ${name} :${error} `, `color:red`);
        } else {
          console.log(`%c Success! JS : ${name}  `, `color:green`);
        }
      });
    });

  fetch(url.replace('min.js', 'css'))
    .then(res => {
      return res.text();
    })
    .then(res => {
      fs.writeFile(`../public/${name}.css`, res, error => {
        if (error) {
          console.log(`%c Error! CSS : ${name} :${error} `, `color:red`);
        } else {
          console.log(`%c Success! CSS : ${name} `, `color:green`);
        }
      });
    });
});
