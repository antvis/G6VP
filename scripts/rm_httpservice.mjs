import fs from 'fs';
import path from 'path';

fs.cpSync(
  path.resolve('./packages/gi-httpservice-xxx/gi-httpservice.tgz'),
  path.resolve(`./release/gi-httpservice.tgz`),
  {
    recursive: true,
  },
);

fs.rmSync(path.resolve('./packages/gi-httpservice-xxx'), { recursive: true, force: true });
