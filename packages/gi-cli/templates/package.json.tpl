{
  "name": "{{{ name }}}",
  "version": "0.1.0",
  "description": "{{{ description }}}",
  "types": "dist/types.d.ts",
  "scripts": {
    "build": "father build && npm run build:umd",
    "build:umd": "webpack  --mode production  -c ./webpack.config.js",
    "start": "umi dev",
    "serve": "http-server dist -p 9527"
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
  "dependencies": {
    "@antv/g6": "4.x",
    "@antv/gi-assets-basic": "latest",
    "@antv/gi-sdk": "latest",
    "@antv/gi-theme-antd": "latest",
    "@antv/graphin": "^2.7.15",
    "antd": "4.x",
    "lodash": "^4.17.21",
    "react": "17.x",
    "react-dom": "17.x"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "father": "^2.30.6",
    "typescript": "^4.1.2",
    "umi": "3.x",
    "webpack": "^5.75.0",
    "webpack-cli": "^5.0.1",
    "ts-loader": "^9.4.2",
    "http-server": "^14.1.1",
    "mini-css-extract-plugin": "^2.7.2"
  }
}
