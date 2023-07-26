import fs from 'fs';
import fsExtra from 'fs-extra';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import deps from './deps.json' assert { type: 'json' };
import deps_assets from './deps_assets.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const deps_asset_keys = [...deps_assets.map(item => item.name), '@antv/gi-sdk'];
const deps_env_keys = deps.filter(item => {
  return deps_asset_keys.indexOf(item.name) === -1;
});

deps_asset_keys.forEach(item => {
  const name = item.split('/')[1];
  fsExtra.copy(
    path.resolve(__dirname, `../../${name}/dist/index.min.js`),
    path.resolve(__dirname, `../public/libs/@antv/${name}.min.js`),
    { overwrite: true },
    function (err) {
      if (err) return console.error(err);
      console.log(`%c Copy JS Success! ${name}  `, `color:green`);
    },
  );

  fsExtra.copy(
    path.resolve(__dirname, `../../${name}/dist/index.css`),
    path.resolve(__dirname, `../public/libs/@antv/${name}.css`),
    { overwrite: true },
    function (err) {
      if (err) return console.error(err);
      console.log(`%c Copy JS Success! ${name}  `, `color:green`);
    },
  );
});

deps_env_keys.forEach(item => {
  const { url, name } = item;
  fetch(url)
    .then(res => {
      return res.text();
    })
    .then(res => {
      fs.writeFile(path.resolve(__dirname, '../public/libs/', `${name}.min.js`), res, error => {
        if (error) {
          console.log(`%c Fetch Error! JS : ${name} :${error} `, `color:red`);
        } else {
          console.log(`%c Fetch Success! JS : ${name}  `, `color:green`);
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
          console.log(`%c Fetch Error! CSS : ${name} :${error} `, `color:red`);
        } else {
          console.log(`%c Fetch Success! CSS : ${name} `, `color:green`);
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
