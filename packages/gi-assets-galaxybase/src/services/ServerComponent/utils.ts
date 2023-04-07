import { INodeSchema, IEdgeSchema } from '@antv/gi-sdk';
const DEFAULT_CONNECT_INFO = {
  username: '',
  password: '',
  serverUrl: '',
};
export const getConnectInfo = () => {
  try {
    const Galaxybase_CONNECT_INFO_STRING = localStorage.getItem('Galaxybase_CONNECT_INFO') || '{}';
    const {
      username = DEFAULT_CONNECT_INFO.username,
      password = DEFAULT_CONNECT_INFO.password,
      serverUrl = DEFAULT_CONNECT_INFO.serverUrl,
    } = JSON.parse(Galaxybase_CONNECT_INFO_STRING);
    return {
      username,
      password,
      serverUrl,
    };
  } catch (error) {
    return DEFAULT_CONNECT_INFO;
  }
};

export const setConnectInfo = (params: typeof DEFAULT_CONNECT_INFO) => {
  localStorage.setItem('Galaxybase_CONNECT_INFO', JSON.stringify(params));
};

export const formatterSchemaData = (schemaData) => {
  let nodes: INodeSchema[] = [],
    edges: IEdgeSchema[] = [];
  Object.keys(schemaData.vertexes).forEach(vertex => {
    let vertexData = schemaData.vertexes[vertex],
      properties = {};
    vertexData.property.forEach(pro => {
      properties[pro.name] = pro.type;
    });
    nodes.push({
      nodeType: vertexData.type,
      nodeTypeKeyFromProperties: '$_type',
      properties,
    });
  });
  Object.keys(schemaData.edges).forEach(edge => {
    let edgeData = schemaData.edges[edge],
      properties = {};
    edgeData.fromAndToTypes.forEach(type => {
      edgeData.property.forEach(pro => {
        properties[pro.name] = pro.type;
      });
      edges.push({
        edgeType: edgeData.type,
        edgeTypeKeyFromProperties: '$_type',
        sourceNodeType: type.fromType,
        targetNodeType: type.toType,
        properties,
      });
    });
  });
  return {
    nodes, edges
  }
};

export const formatterCypherResult = (results: any[]) => {
  let nodes = [],
    edges = [];
  results[0].data.forEach(graph => {
    nodes = nodes.concat(
      graph.graph.nodes.map(item => {
        return {
          id: item.id + '',
          nodeType: item.labels[0],
          data: {
            id: item.id + '',
            $_type: item.labels[0],
            ...item.properties,
          },
          nodeTypeKeyFromProperties: '$_type',
        };
      }),
    );
    edges = edges.concat(
      graph.graph.relationships.map(item => {
        return {
          id: item.id,
          source: item.startNode,
          target: item.endNode,
          edgeType: item.type,
          data: {
            $_type: item.type,
            ...item.properties,
          },
          edgeTypeKeyFromProperties: '$_type',
        };
      }),
    );
  });
  let resultEdges: any[] = [];
  edges.forEach((item: any) => {
    if (!resultEdges.some((e: any) => e.id == item.id)) resultEdges.push(item);
  });
  return {
    nodes,
    edges: resultEdges,
  };
};
