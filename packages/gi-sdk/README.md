## GISDK 组件

> WIP

## Studio 组件

通过接口，获得应用渲染的配置参数，从而让用户可以这么实现

```jsx
export default () => {
  return <window.GISDK.Studio id="xxxxx" service={getProject} />;
};
```

组件属性说明

- id：studio 的 唯一 id，可以通过接口获得全部的配置参数

- service： 第三方托管平台提供的接口，类型：`POST`

```js
// 入参
const request = {
  id: 'app-xxx',
};
// 出参
const response = {
  workbook: {
    id: 'd3a818ea-f833-4229-85ea-a6670dae4a18',
    name: 'GI',
    activeAssetsKeys: {},
    projectConfig: {
      nodes: [],
      edges: [],
      components: [],
    },
    themes: [],
  },
  dataset: {
    id: 'ds_f16fce61-aa3e-420d-a6cc-6b409f9aa37e',
    engineContext: {
      engineId: 'R+',
      schemaData: {},
    },
    data: {},
  },
  deps: {
    react: '17.x',
    'react-dom': '17.x',
    localforage: '1.10.0',
    antd: '4.24.8',
    '@antv/gi-theme-antd': '0.4.2',
    '@antv/g6': '4.8.14',
    '@antv/graphin': '2.7.16',
    '@antv/gi-sdk': '2.3.5',
  },
  GI_ASSETS_PACKAGES: {
    GI_ASSETS_BASIC: {
      name: '@antv/gi-assets-basic',
      version: '2.3.6',
      url: 'https://gw.alipayobjects.com/os/lib/antv/gi-assets-basic/2.3.6/dist/index.min.js',
      global: 'GI_ASSETS_BASIC',
    },
  },
};
```
