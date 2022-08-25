import { GraphinData } from '@antv/graphin';
import { GIService } from '../typing';
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

export const getPositionStyles = (placement = 'LT', offset: number[] = [24, 64]) => {
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

/**
 *
 * @param data 画布中的图数据
 * @param responseData 扩展出来的图数据
 * @returns
 */
export const handleExpand = (data, responseData) => {
  const { nodes = [], edges = [] } = responseData || {};
  return {
    nodes: uniqueElementsBy([...data.nodes, ...nodes], (a, b) => {
      return a.id === b.id;
    }),
    edges: uniqueElementsBy([...data.edges, ...edges], (a, b) => {
      if (a.id && b.id) {
        return a.id === b.id;
      }
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
export const getService = (services: any[], serviceId?: string): GIService['service'] | null => {
  if (!serviceId) {
    console.warn('not found serviceId', serviceId);
    return null;
  }
  const { service } = services.find(s => s.id === serviceId) || {};
  if (!service) {
    console.warn('Component need a service', serviceId);
    return null;
  }
  return service;
};

/**
 *
 * @param source 原数据 格式 { type:"object",properties:{}}
 * @returns
 */
export const getDefaultValues = s => {
  const ROOT = 'props';
  const result = {};
  const walk = (schema, obj, k) => {
    const { type, properties } = schema;
    if (type === 'void') {
      Object.keys(properties).forEach(key => {
        walk(properties[key], obj, key);
      });
      return;
    }
    if (type === 'object') {
      obj[k] = {};
      const val = obj[k];
      Object.keys(properties).forEach(key => {
        walk(properties[key], val, key);
      });
      return;
    }
    obj[k] = schema.default;
  };
  walk(s, result, ROOT);
  return result[ROOT];
};

const walkProperties = data => {
  const result: string[] = [];
  const walk = obj => {
    Object.keys(obj).forEach((key: string) => {
      const value = obj[key];
      const isObject = Object.prototype.toString.call(value) === '[object Object]';
      if (isObject) {
        walk(value);
      } else {
        result.push(key);
      }
    });
  };
  walk(data);
  return [...new Set(result)];
};
export const getKeysByData = (data: GraphinData, category: 'node' | 'edge'): string[] => {
  try {
    if (category === 'node') {
      const node = data.nodes[0] || {};
      const result = walkProperties(node);

      return result;
    }
    if (category === 'edge') {
      const edge = data.edges[0] || {};
      const result = walkProperties(edge);

      return result;
    }
  } catch (error) {}
  return [];
};

/**
 * 合并对象根据自定义规则
 * @param condition 判断条件
 * @returns
 * @example 

const a = { name: 'USA', serviceId: 'AKG/USA'};
const b = {  name: 'China', serviceId: 'GI/China'};

const res = mergeObjectByRule((acc, curr) =>   curr.includes('AKG'),a,b);
// res:{ name:"China",serviceId: 'AKG/USA' }

 */
export const mergeObjectByRule = (condition: Function, ...objArray): Object => {
  // 为了默认合并对象的习惯，后者覆盖前者，所以需要将数组revert
  const objects = [...objArray].reverse();
  return objects.reduce((acc, obj, index) => {
    Object.keys(obj).forEach(k => {
      if (!acc.hasOwnProperty(k)) {
        //key值不存在的条件，合并进去
        acc[k] = obj[k];
      } else if (condition(acc[k], obj[k])) {
        //只有符合自定义判断条件才合并
        acc[k] = obj[k];
      }
    });
    return acc;
  }, {});
};
