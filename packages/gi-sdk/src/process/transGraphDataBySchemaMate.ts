import { useContext } from '../context';
import { GraphSchemaData, IGraphData } from '../index';

// 转换 单个点边
export const transByFieldMapping= (data: Record<string, any>, fieldMapping) => {
  const transformedData = {} as Record<string, any>;
  for (const key in data) {
    const mapping = fieldMapping[key];
    if (mapping) {
      transformedData[mapping.name] = data[key];
    } else {
      transformedData[key] = data[key];
    }
  }
  return transformedData;
}
// 转换 edges or nodes
export const transDataByFieldMapping  = (data: IGraphData['edges'] | IGraphData['nodes'], fieldMapping) => {
  if (Object.keys(fieldMapping).length === 0) return data;

  return data.map(datum => {
    const { data, ...others } = datum;
    return { data: transByFieldMapping(data, fieldMapping), ...others };
  });
};

// 转换 schema 
export const transSchemaByMeta = (schemaData: GraphSchemaData) => {
  const {edges = [], nodes = [] } = schemaData;
  const { nodeFieldMapping, edgeFieldMapping } = schemaData.meta || {};

  const transform = (item, mapping: Record<string, any> = {}) => {
    const { properties = {}, ...rest } = item;
    return {
      ...rest,
      properties: Object.entries(mapping).reduce(
        (result, [key, value]) => {
          if (properties.hasOwnProperty(key)) {
            result[value.name] = properties[key];
            delete result[key];
          }
          return result;
        },
        { ...properties },
      ),
    };
  };

  const edgesSchema = edges.map(edge => transform(edge, edgeFieldMapping));
  const nodesSchema = nodes.map(node => transform(node, nodeFieldMapping));

  return {
    edges: edgesSchema,
    nodes: nodesSchema,
  };
};

// 转换 graphData
export const transDataBySchemaMeta = (data: IGraphData, schemaData: GraphSchemaData) => {
  const { nodeFieldMapping = {}, edgeFieldMapping = {} } = schemaData.meta || {};
  const { nodes, edges, ...rest } = data;
  return {
    data: {
      nodes: transDataByFieldMapping(data.nodes, nodeFieldMapping),
      edges: transDataByFieldMapping(data.edges, edgeFieldMapping),
    },
    schemaData: transSchemaByMeta(schemaData),
    ...rest,
  };
};

export const useGraphDataBySchemaMeta = () => {
  const { schemaData, data } = useContext();
  return transDataBySchemaMeta(data, schemaData);
};

