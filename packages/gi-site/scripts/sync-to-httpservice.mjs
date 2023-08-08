import path from 'path';
import { fileURLToPath } from 'url';

import fsExtra from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

/** copy site dist to gi-httpserver */
fsExtra.copy(
  path.resolve(__dirname, `../dist`),
  path.resolve(__dirname, `../../gi-httpservice/app/public`),
  { overwrite: true },
  function (err) {
    if (err) return console.error(err);
    console.log(`%c Sync JS Success! `, `color:green`);
  },
);
fsExtra.copy(
  path.resolve(__dirname, `../dist/index.html`),
  path.resolve(__dirname, `../../gi-httpservice/app/view/index.html`),
  { overwrite: true },
  function (err) {
    if (err) return console.error(err);
    console.log(`%c Sync HTML Success!  `, `color:green`);
  },
);
