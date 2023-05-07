import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import assets from './deps.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
assets.forEach(item => {
  const { url, name } = item;

  fetch(url)
    .then(res => {
      return res.text();
    })
    .then(res => {
      fs.writeFile(path.resolve(__dirname, '../public/libs/', `${name}.min.js`), res, error => {
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
      fs.writeFile(path.resolve(__dirname, '../public/libs/', `${name}.css`), res, error => {
        if (error) {
          console.log(`%c Error! CSS : ${name} :${error} `, `color:red`);
        } else {
          console.log(`%c Success! CSS : ${name} `, `color:green`);
        }
      });
    });
});

/** 生成 font 字体 */
fetch('https://at.alicdn.com/t/a/font_3381398_hecr296g6n8.js')
  .then(res => res.text())
  .then(res => {
    fs.writeFile(path.resolve(__dirname, '../public/libs/', `font.js`), res, error => {
      if (error) {
        console.log(`%c Error! Font  :${error} `, `color:red`);
      } else {
        console.log(`%c Success! Font `, `color:green`);
      }
    });
  });
