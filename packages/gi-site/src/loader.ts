import SystemJS from 'systemjs';

const script = document.createElement('script');
script.type = 'systemjs-importmap';
script.text = `{
  "imports": {
    "react": "https://unpkg.com/react@17.0.2/umd/react.production.min.js",
    "react-dom": "https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js",
    "@antv/g6": "https://gw.alipayobjects.com/os/lib/antv/g6/4.5.0/dist/g6.min.js",
    "@antv/graphin": "https://gw.alipayobjects.com/os/lib/antv/graphin/2.4.9/dist/graphin.min.js",
    "@antv/s2": "https://gw.alipayobjects.com/os/lib/antv/s2/1.4.0-alpha.2/dist/index.min.js",
    "@antv/s2-react": "https://gw.alipayobjects.com/os/lib/antv/s2-react/1.4.0-alpha.2/dist/index.min.js",
    "@antv/g2plot": "https://gw.alipayobjects.com/os/lib/antv/g2plot/2.4.2/dist/g2plot.min.js",
    "@antv/g2": "https://gw.alipayobjects.com/os/lib/antv/g2/4.1.35/dist/g2.min.js",
    "@ant-design/charts": "https://gw.alipayobjects.com/os/lib/ant-design/charts/1.2.13/dist/charts.min.js",
    "@ant-design/icons": "https://gw.alipayobjects.com/os/lib/ant-design/icons/4.6.4/dist/index.umd.min.js"
  }
}`;
document.head.appendChild(script);

export interface LoadModules {
  name: string;
  url: string;
  version?: string;
  type: number;
}

/**
 * 动态加载组件，支持同时加载多个
 * @param targets { LoadModules[] } 要加载的组件列表
 */
export const dynamicLoadModules = async (targets: LoadModules[]) => {
  const promises = targets.map(target => target.url && SystemJS.import(target.url));

  return Promise.all(promises)
    .then(values => {
      const componentMapping = values.map((value, index) => {
        return {
          name: targets[index].name,
          components: value,
          type: targets[index].type,
        };
      });
      return componentMapping;
    })
    .then(res => {
      console.log('res', res);
      return res;
    });
};
