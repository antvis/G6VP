import * as React from 'react';
import { data, edgesCfg as defaultEdgesCfg, nodesCfg as defaultNodesCfg, schemaData } from '../docs/demos/const';
import GISDK from './GISDK';
import MetaConfig from './components/MetaConfig';
import { getComponentsByAssets } from './process/getComponentsByAssets';
import type { GIComponentAssets, GIService } from './typing';
interface GISDK_TESTProps {
  assets: [];
  activeAssetsInfo: [];
  services?: [];
}

const defaultServices: GIService[] = [
  {
    name: '初始化查询',
    method: 'GET',
    id: 'GI/GI_SERVICE_INTIAL_GRAPH',
    service: async () => {
      return new Promise(resolve => {
        resolve(data);
      });
    },
  },
  {
    name: '查询图模型',
    method: 'GET',
    id: 'GI/GI_SERVICE_SCHEMA',
    service: async () => {
      return new Promise(resolve => {
        resolve(schemaData);
      });
    },
  },
];

const appendAssets = assets => {
  return {
    ...assets,
    components: {
      ...assets.components,
      MetaConfig,
    },
  };
};
const calcProps = props => {
  const {
    activeAssets: activeAssetsInfo,

    nodes = defaultNodesCfg,
    edges = defaultEdgesCfg,
  } = props;
  const services = [...(props.services || []), ...defaultServices];
  const activeAssetsKey = activeAssetsInfo.map(item => item.id);
  const assets = appendAssets(props.assets);
  /** 得到资产的运行时配置 */
  const CMPS_CONFIG = getComponentsByAssets(
    assets.components as GIComponentAssets,
    { nodes: [], edges: [] },
    services,
    //@ts-ignore
    {},
    { nodes: [], edges: [] },
    'GI',
  );

  /** 根据清单，拆分不同类型的资产 */
  const KEYS_LAYOUT: string[] = [];
  const KEYS_ELEMENTS: string[] = [];
  const KEYS_COMPONENTS: string[] = [];

  const KEYS_GICC_LAYOUT: string[] = []; //布局容器
  const KEYS_GICC_MENU: string[] = []; //右键菜单容器
  const KEYS_GICC: string[] = []; //内容容器

  const KEYS_GIAC_CONTENT: string[] = []; //内容原子资产
  const KEYS_GIAC_MENU: string[] = []; //菜单原子资产
  const KEYS_GIAC: string[] = []; //原子资产

  activeAssetsInfo.forEach(item => {
    const { type, id } = item;
    if (type === 'NODE' || type === 'EDGE') {
      KEYS_ELEMENTS.push(id);
      return;
    }
    if (type === 'LAYOUT') {
      KEYS_LAYOUT.push(id);
      return;
    }
    /** 剩下的都是分析组件 */
    KEYS_COMPONENTS.push(id);

    if (type === 'GICC_LAYOUT') {
      KEYS_GICC_LAYOUT.push(id);
    }
    if (type === 'GICC_MENU') {
      KEYS_GICC_MENU.push(id);
    }
    if (type === 'GICC') {
      KEYS_GICC.push(id);
    }
    if (type === 'GIAC') {
      KEYS_GIAC.push(id);
    }
    if (type === 'GIAC_MENU') {
      KEYS_GIAC_MENU.push(id);
    }
    if (type === 'GIAC_CONTENT') {
      KEYS_GIAC_CONTENT.push(id);
    }
  });

  const activeAssetsKeys = {
    /** 追加默认必须存在的资产，防止用户漏选而导致运行报错 */
    components: [
      ...new Set([
        ...KEYS_COMPONENTS,
        'MetaConfig',
        'Initializer',
        'CanvasSetting',
        'SegmentedLayout',
        'Toolbar',
        'ContextMenu',
      ]),
    ],

    layouts: [...new Set([...KEYS_LAYOUT, 'Force'])],
    elements: [...new Set([...KEYS_ELEMENTS, 'SimpleNode', 'SimpleEdge'])],
  };

  let GICC_LAYOUT; // 容器资产的配置详情
  const components: any[] = [];
  CMPS_CONFIG.forEach(c => {
    if (!c) return;
    const item = {
      id: c.id,
      mame: c.name,
      info: c.info,
      props: c.props,
    };
    if (item && activeAssetsKeys.components.indexOf(item.id) !== -1) {
      components.push(item);
      const { type } = item.info;
      if (type === 'GICC_LAYOUT') GICC_LAYOUT = item;
    }
  });

  try {
    // 手动集成「布局容器」「画布容器」的原子资产
    GICC_LAYOUT.props.containers[0].GI_CONTAINER = KEYS_GIAC_CONTENT;
    components.forEach(item => {
      if (item.id === 'ContextMenu') {
        item.props.GI_CONTAINER = KEYS_GIAC_MENU;
      }
      if (item.id === 'Toolbar') {
        item.props.GI_CONTAINER = KEYS_GIAC;
      }
      if (item.id === 'MetaConfig') {
        item.props = { activeIds: activeAssetsKey };
      }
    });
  } catch (error) {
    console.log(error);
  }

  return {
    config: {
      components,
      layout: {
        // id: activeAssetsKeys.layouts[0],
        id: 'Force2',
        props: {
          type: 'force',
          presetLayout: {},
        },
      },
      nodes: nodes,
      edges: edges,
      pageLayout: GICC_LAYOUT,
    },
    assets,
    services,
  };
};
const GISDK_TEST: React.FunctionComponent<GISDK_TESTProps> = props => {
  const { config, assets, services } = calcProps(props);

  return (
    <div>
      <GISDK config={config} assets={assets} services={services}></GISDK>
    </div>
  );
};

export default GISDK_TEST;
