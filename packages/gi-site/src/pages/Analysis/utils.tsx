export const isObjectEmpty = obj => {
  return Object.keys(obj).length === 0;
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
  const nodeSchemas = [];
  const edgeSchemas = [];

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
  console.log('schema', nodeSchemas, edgeSchemas);
  return {
    nodes: nodeSchemas,
    edges: edgeSchemas,
  };
};
