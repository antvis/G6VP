import SystemJS from 'systemjs'

// 配置 GI 资产前置依赖的库的资源路径
SystemJS.config({
  baseURL: 'https://unpkg.com',
  _nodeRequire: false,
  map: {
    react: 'https://unpkg.com/react@17/umd/react.production.min.js',
    'react-dom': 'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
    '@antv/g6': 'https://gw.alipayobjects.com/os/lib/antv/g6/4.3.7/dist/g6.min.js',
    '@antv/graphin': 'https://gw.alipayobjects.com/os/lib/antv/graphin/2.4.0/dist/graphin.min.js',
    '@antv/graphin-component': 'https://gw.alipayobjects.com/os/lib/antv/graphin-components/2.4.0/dist/graphin-components.min.js',
    Graphin: 'https://gw.alipayobjects.com/os/lib/antv/graphin/2.4.0/dist/graphin.min.js',
    GraphinComponents: 'https://gw.alipayobjects.com/os/lib/antv/graphin-components/2.4.0/dist/graphin-components.min.js',
    ReactDOM: 'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
    React: 'https://unpkg.com/react@17/umd/react.production.min.js',
    G6: 'https://gw.alipayobjects.com/os/lib/antv/g6/4.3.7/dist/g6.min.js',
  }
});
  
export interface LoadModules {
  name: string;
  url: string;
  version?: string;
}

/**
 * 动态加载组件，支持同时加载多个
 * @param targets { LoadModules[] } 要加载的组件列表
 */
export const dynamicLoadModules = async (targets: LoadModules[]) => {
  const promises = targets.map(target => SystemJS.import(target.url))
  
  return Promise.all(promises).then(values => {
    const componentMapping = values.map((value, index) => {
      return {
        name: targets[index].name,
        components: value
      }
    })
    return componentMapping
  })
}