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

interface IGraphData {
  nodes: any[];
  edges: any[];
}

interface INodeSchema {
  nodeType: string;
  properties: Object;
}

interface IEdgeSchema {
  edgeType: string;
  sourceNodeType: string;
  targetNodeType: string;
  properties: Object;
}
interface IGraphSchema {
  nodes: INodeSchema[];
  edges: IEdgeSchema[];
}

/**
 * 通过 graphData 生成 Schema
 * @param graphData 图数据
 */
 export const generatorSchemaByGraphData = (graphData: IGraphData): IGraphSchema => {
  const { nodes, edges } = graphData;
  const nodeSchemas: INodeSchema[] = [];
  const edgeSchemas: IEdgeSchema[] = [];

  nodes.forEach(node => {
    const { nodeType = 'UNKNOW', data } = node;
    const nodeSchema = {
      nodeType: nodeType,
      properties: {},
    };

    for (const key in data) {
      if (typeof data[key] === 'object') {
        // 说明包括的是一个对象，需要再把里面的属性值解构出来
        for (const subKey in data[key]) {
          // 只处理这一层的非 object 的字段，其他的不再作为 schema 的属性
          if (typeof data[key][subKey] !== 'object') {
            nodeSchema.properties[subKey] = typeof data[key][subKey];
          }
        }
      } else {
        nodeSchema.properties[key] = typeof data[key];
      }
    }

    const hasCurrent = nodeSchemas.find(schema => schema.nodeType === nodeType);
    if (!hasCurrent) {
      nodeSchemas.push(nodeSchema);
    }
  });

  edges.forEach(edge => {
    const { edgeType = 'UNKNOW', source, target, data } = edge;
    const edgeSchema = {
      edgeType: edgeType,
      sourceNodeType: '',
      targetNodeType: '',
      properties: {},
    };

    // 获取当前 source 对应的 nodeType
    const currentSource = nodes.find(node => node.id === source);
    const currentTarget = nodes.find(node => node.id === target);
    edgeSchema.sourceNodeType = currentSource.nodeType;
    edgeSchema.targetNodeType = currentTarget.nodeType;

    for (const key in data) {
      if (typeof data[key] === 'object') {
        // 说明包括的是一个对象，需要再把里面的属性值解构出来
        for (const subKey in data[key]) {
          // 只处理这一层的非 object 的字段，其他的不再作为 schema 的属性
          if (typeof data[key][subKey] !== 'object') {
            edgeSchema.properties[subKey] = typeof data[key][subKey];
          }
        }
      } else {
        edgeSchema.properties[key] = typeof data[key];
      }
    }

    const hasCurrent = edgeSchemas.find(schema => schema.edgeType === edgeType);
    if (!hasCurrent) {
      edgeSchemas.push(edgeSchema);
    }
  });
  return {
    nodes: nodeSchemas,
    edges: edgeSchemas,
  };
};
