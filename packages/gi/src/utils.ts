import { filterByRules } from '@alipay/gi-common-components/lib/GroupContainer/utils';
import { GraphinData, IUserEdge } from '@antv/graphin';
import processEdges from './process/processEdges';
import { GIAssets, GIConfig } from './typing';
/** TODO */
export { default as getMockServiceConfig } from './process/getMockServiceConfig';
export { default as getServicesByConfig } from './process/getServicesByConfig';
export { default as processEdges } from './process/processEdges';
export { generatorSchemaByGraphData, generatorStyleConfigBySchema } from './process/schema';

export const isPosition = nodes => {
  //若收到一个空数组，Array.prototype.every() 方法在一切情况下都会返回 true
  if (nodes.length === 0) {
    return false;
  }

  return nodes.every(node => !window.isNaN(node.x) && !window.isNaN(node.y));
};
export const isStyles = nodes => {
  if (nodes.length === 0) {
    return false;
  }
  return nodes.every(node => node.style);
};

export const getPositionStyles = (placement, offset: number[]) => {
  const styles: { [key: string]: string } = {
    position: 'absolute',
    top: 'unset',
    left: 'unset',
    right: 'unset',
    bottom: 'unset',
  };
  const [offsetX, offsetY] = offset;
  if (placement === 'RT') {
    styles.right = `${offsetX}px`;
    styles.top = `${offsetY}px`;
  }
  if (placement === 'LT') {
    styles.left = `${offsetX}px`;
    styles.top = `${offsetY}px`;
  }
  if (placement === 'LB') {
    styles.left = `${offsetX}px`;
    styles.bottom = `${offsetY}px`;
  }
  if (placement === 'RB') {
    styles.right = `${offsetX}px`;
    styles.bottom = `${offsetY}px`;
  }
  return styles;
};

/** 数据去重 */
export const uniqueElementsBy = (arr: any[], fn: (arg0: any, arg1: any) => any) =>
  arr.reduce((acc, v) => {
    if (!acc.some((x: any) => fn(v, x))) acc.push(v);
    return acc;
  }, []);

/**
 *
 * @param data 画布中的图数据
 * @param responseData 扩展出来的图数据
 * @returns
 */
export const handleExpand = (data, responseData) => {
  const { nodes, edges } = responseData;
  return {
    nodes: uniqueElementsBy([...data.nodes, ...nodes], (a, b) => {
      return a.id === b.id;
    }),
    edges: uniqueElementsBy([...data.edges, ...edges], (a, b) => {
      return a.source === b.source && a.target === b.target;
    }),
  };
};

/**
 *
 * @param data 画布中的图数据
 * @param responseData 需要收起的图数据
 * @returns
 */
export const handleCollaspe = (data, responseData) => {
  const nodeIds = responseData.nodes.map(c => c.id);
  const edgeIds = responseData.edges.map(c => `${c.source}-${c.target}`);
  const nodes = data.nodes.filter(c => {
    return nodeIds.indexOf(c.id) === -1;
  });
  const edges = data.edges.filter(c => {
    const id = `${c.source}-${c.target}`;
    return edgeIds.indexOf(id) === -1;
  });
  console.log(nodes, edges);

  return {
    nodes,
    edges,
  };
};

/**
 *
 * @param services 从上下文得到的 services
 * @param serviceId 组件绑定的 serviceId
 * @returns
 */
export const getService = (services: any[], serviceId?: string) => {
  if (!serviceId) {
    console.warn('not found serviceId', serviceId);
    return null;
  }
  const { service } = services.find(s => s.id === serviceId);
  if (!service) {
    console.warn('Component need a service', serviceId);
    return null;
  }
  return service;
};

/**
 *
 * @param elementType 元素类型：node or edge
 * @param data 数据
 * @param config GISDK配置
 * @param ElementAssets 元素资产
 * @param reset 是否重置transform
 * @returns nodes or edges
 */
export const transDataByConfig = (
  elementType: 'nodes' | 'edges',
  data: GraphinData,
  config: GIConfig,
  ElementAssets: GIAssets['elements'],
  reset?: boolean,
) => {
  console.time(`cost ${elementType} trans`);
  const elementConfig = config[elementType];

  const defaultConfig =
    elementType === 'nodes'
      ? {
          id: 'SimpleNode',
          props: {},
          name: '官方节点',
          order: -1,
          expressions: [],
          logic: true,
          groupName: `GLOBAL TYPE`,
        }
      : {
          id: 'SimpleEdge',
          props: {},
          name: '官方边',
          order: -1,
          expressions: [],
          logic: true,
          groupName: `GLOBAL TYPE`,
        };

  if (!elementConfig) {
    return {};
  }

  let elementData = data[elementType];

  if (elementType === 'edges') {
    // 先整体做个多边处理
    elementData = processEdges(elementData as IUserEdge[], {
      poly: 30,
      loop: 10,
    });
  }

  const [basicConfig, ...otherConfigs] = elementConfig;

  const filterElements = otherConfigs
    .map(item => {
      //@ts-ignore
      const { id, expressions, logic } = item;
      const Element = ElementAssets[id];
      const filterData = filterByRules(elementData, { logic, expressions });
      return Element.registerTransform(filterData, item, reset);
    })
    .reduce((acc, curr) => {
      return [...curr, ...acc];
    }, []);

  const uniqueElements = uniqueElementsBy(filterElements, (a, b) => {
    return a.id === b.id;
  });
  const uniqueIds = uniqueElements.map(n => n.id);
  //@ts-ignore
  const restElements = elementData.filter(n => {
    return uniqueIds.indexOf(n.id) === -1;
  });

  //@ts-ignore
  const restData = ElementAssets[basicConfig.id].registerTransform(restElements, basicConfig, reset);

  const nodes = [...uniqueElements, ...restData];
  console.timeEnd(`cost ${elementType} trans`);
  console.log(elementType, nodes);
  return nodes;
};

/**
 *
 * 时间戳转时间
 *
 */

export const time = time => {
  if (!time) {
    return 'Invalid Date';
  }
  const date = new Date(new Date(time).valueOf() + 8 * 3600 * 1000);

  return date.toJSON().substr(0, 16).replace('T', ' ').replace(/-/g, '.');
};