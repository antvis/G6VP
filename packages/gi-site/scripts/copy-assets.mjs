import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import allDeps from './deps.json' assert { type: 'json' };

import fsExtra from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const packages = [
  /** sdk */
  {
    name: '@antv/gi-sdk',
  },
  /** assets */
  {
    name: '@antv/gi-assets-basic',
  },
  {
    name: '@antv/gi-assets-advance',
  },
  {
    name: '@antv/gi-assets-scene',
  },
  {
    name: '@antv/gi-assets-algorithm',
  },
  /** engine */
  {
    name: '@antv/gi-assets-tugraph',
  },
  {
    name: '@antv/gi-assets-tugraph-analytics',
  },
  {
    name: '@antv/gi-assets-graphscope',
  },
  {
    name: '@antv/gi-assets-galaxybase',
  },
  {
    name: '@antv/gi-assets-neo4j',
  },
  {
    name: '@antv/gi-assets-hugegraph',
  },
  {
    name: '@antv/gi-assets-janusgraph',
  },
];

const assets = packages.map(item => {
  return {
    name: item.name.split('/')[1],
  };
});

const deps = allDeps.filter(item => {
  return packages.indexOf(item.name) === -1;
});

console.log('assets', assets, deps);

assets.forEach(item => {
  const { name } = item;
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

deps.forEach(item => {
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
