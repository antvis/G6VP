{
  "name": "{{{ name }}}",
  "version": "0.0.1",
  "description": "{{{ description }}}",
  "types": "dist/types.d.ts",
  "scripts": {
    "start": "umi dev",
    "docs": "umi dev --dumi"
  },
  "keywords": ["GraphInsight", "gi-asstes"],
  "authors": [{{#author}}
    "{{{ author }}}"
  {{/author}}],
  "license": "MIT",
  "files": [
    "dist"
  ],
  "publishConfig": {
    "access": "public"
  },
  "dependencies": {
     "d3-scale": "^4.0.2",
     "react": "^17.x",
     "react-dom": "^17.x",
     "umi": "^3.5.23"
   },
   "devDependencies": {
     "@umijs/preset-dumi": "^1.1.40"
   }
}
