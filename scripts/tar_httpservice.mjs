import fs from 'fs';
import path from 'path';

fs.cpSync(path.resolve('./packages/gi-httpservice/app'), path.resolve('./packages/gi-httpservice-xxx/app'), {
  recursive: true,
});
fs.cpSync(path.resolve('./packages/gi-httpservice/config'), path.resolve('./packages/gi-httpservice-xxx/config'), {
  recursive: true,
});
fs.cpSync(
  path.resolve('./packages/gi-httpservice/tsconfig.json'),
  path.resolve('./packages/gi-httpservice-xxx/tsconfig.json'),
  {
    recursive: true,
  },
);

fs.cpSync(
  path.resolve('./packages/gi-httpservice/package.json'),
  path.resolve('./packages/gi-httpservice-xxx/package.json'),
  {
    recursive: true,
  },
);
