{
  "name": "{{{ name }}}",
  "version": "0.1.0",
  "description": "{{{ description }}}",
  "types": "dist/types.d.ts",
  "scripts": {
    "build": "father build && npm run build:umd",
    "build:umd": "webpack  --mode production  -c ./webpack.config.js",
    "start": "umi dev"
  },
  "keywords": ["GraphInsight", "gi-asstes"],
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
  "publishConfig": {
    "access": "public"
  },
  "dependencies": {
    "@antv/g6": "4.x",
    "@antv/gi-assets-basic": "latest",
    "@antv/gi-sdk": "latest",
    "@antv/gi-theme-antd": "latest",
    "@antv/graphin": "2.x",
    "antd": "4.x",
    "react": "17.x",
    "react-dom": "17.x"
   },
   "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "father": "^2.30.6",
    "typescript": "^4.1.2",
    "umi": "3.x"
   }
}
