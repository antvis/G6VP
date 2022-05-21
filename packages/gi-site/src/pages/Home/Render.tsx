import * as fs from 'fs';
import path from 'path';
import prettier from 'prettier';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Home from './Home';

const render = () => {
  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  }
  let html = ReactDOMServer.renderToStaticMarkup(<Home />);
  let htmlWDoc = '<!DOCTYPE html>' + html;
  //@ts-ignore
  const newHtmlDoc = replaceAll(htmlWDoc, '&quot;', "'");
  console.log('a', newHtmlDoc);
  let prettyHtml = prettier.format(newHtmlDoc, { parser: 'html' });
  let outputFile = path.resolve(__dirname, '../index.html');

  fs.writeFileSync(outputFile, prettyHtml);
  console.log(`Wrote ${outputFile}`);
};

render();
