{
  "name": "{{{ name }}}",
  "version": "0.1.0",
  "description": "{{{ description }}}",
  "types": "dist/types.d.ts",
  "scripts": {
    "build": "father build && npm run build:umd",
    "build:umd": "webpack  --mode production  -c ./webpack.config.js",
    "build:umd": "jest && webpack -c ./webpack.config.js --mode=development",
    "build:umd:watch": "jest && webpack -c ./webpack.config.js --mode=development --watch",
    "start": "umi dev",
    "serve": "http-server dist -p 9527",
    "test": "jest"
  },
  "keywords": ["G6VP", "gi-asstes"],
  "authors": [{{#author}}
    "{{{ author }}}"
  {{/author}}],
  "license": "MIT",
  "files": [
    "dist"
  ],
  "pnpm": {
    "overrides": {
      "@antv/gi-sdk": "latest"
    }
  },
  "overrides": {
    "@antv/gi-sdk": "latest"
  },
  "dependencies": {
    "@antv/g6": "4.x",
    "@antv/gi-assets-basic": "latest",
    "@antv/gi-sdk": "latest",
    "@antv/gi-theme-antd": "latest",
    "@antv/graphin": "^2.7.15",
    "antd": "4.x",
    "lodash": "^4.17.21",
    "react-dom": "17.x",
    "react": "17.x"
  },
  "devDependencies": {
    "@types/jest": "^28.x",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "father": "^2.30.6",
    "http-server": "^14.1.1",
    "identity-obj-proxy": "^3.0.0",
    "jest": "^28.x",
    "jest-environment-jsdom": "^28.x",
    "mini-css-extract-plugin": "^2.7.2",
    "ts-jest": "^28.0.8",
    "ts-loader": "^9.4.2",
    "typescript": "^4.1.2",
    "umi": "3.x",
    "webpack": "^5.75.0",
    "webpack-cli": "^5.0.1"
  }
}
