// @ts-nocheck

import { Service } from 'egg';
import fs from 'fs';
import { readHugeGraphConfig } from '../util';

class HugeGraphService extends Service {
  /**
   * 获取该 uri 服务下的图列表
   */
  async listGraphs(params) {
    // TODO: username password 暂时没用到？
    const { uri, httpServerURL, username, password } = params;
    let result;
    try {
      const cachedConfig = readHugeGraphConfig();
      if (!uri) uri = cachedConfig.uri;
      result = await this.ctx.curl(`${uri}/graphs`, {
        method: 'GET',
        data: {},
        dataType: 'json',
      });

      if (result.status !== 200 || !result.data?.graphs) {
        return {
          success: false,
          code: result.status,
          message: result.message,
        };
      }

      const subGraphSchemas = {};
      let success = false;
      const promises = result.data.graphs.map(async graphId => {
        const res = await this.getGraphSchema({ uri, graphId });
        if (res.code === 200) {
          subGraphSchemas[graphId] = res.data;
        }
        success = success || res.code === 200;
        result = res;
        return res;
      });

      await Promise.all(promises);

      const config = {
        uri,
        graphId: result.data.graphs[0],
        username,
        password,
        httpServerURL,
      };
      fs.writeFileSync(`${__dirname}/HUGEGRAPH_CONFIG.json`, JSON.stringify(config, null, 2), 'utf-8');

      return {
        success: true,
        code: 200,
        message: '图列表查询成功',
        data: subGraphSchemas,
      };
    } catch (error) {
      return {
        success: false,
        code: 200,
        message: error,
      };
    }

    return result;
  }

  /**
   * 查询 HugeGraph 数据库中指定 graph 的 Schema
   */
  async getGraphSchema(params) {
    const { graphId, uri } = params;
    let result;
    let schema;
    try {
      const cachedConfig = readHugeGraphConfig();
      if (!uri) uri = cachedConfig.uri;
      result = await this.ctx.curl(`${uri}/graphs/${graphId}/schema`, {
        method: 'GET',
        data: {},
        dataType: 'json',
      });
      schema = this.formatSchema(result.data);
    } catch (error) {
      return {
        success: false,
        code: 200,
        message: error,
      };
    }
    if (result.status !== 200) {
      return {
        success: false,
        code: result.status,
        message: result.data?.message,
      };
    }
    return {
      success: true,
      code: 200,
      message: 'Schema 查询成功',
      data: schema,
    };
  }

  /**
   * 使用 gremlin 查询指定 graph 的数据
   */
  async queryByGremlin(params) {
    let { gremlin, uri } = params;
    let result;
    try {
      const cachedConfig = readHugeGraphConfig();
      if (!uri) uri = cachedConfig.uri;
      result = await this.ctx.curl(`${uri}/gremlin?gremlin=${gremlin}`, {
        method: 'GET',
        data: {},
        dataType: 'json',
      });

      if (result.status !== 200 || !result.data?.result?.data) {
        return {
          success: false,
          code: result.status,
          message: result.data.message,
        };
      }

      const formatData = this.formatGraphData(result.data.result.data);
      return {
        success: true,
        code: 200,
        message: 'Gremlin 查询成功',
        data: formatData,
      };
    } catch (error) {
      return {
        success: false,
        code: 200,
        message: error,
      };
    }
  }

  /**
   * 邻居查询
   * @param params
   */
  async queryNeighbors(params) {
    let { sourceInfos, sep, uri, graphId } = params;
    let success = false;
    let result;
    let resultData = { nodes: [], edges: [] };
    try {
      const cachedConfig = readHugeGraphConfig();
      if (!uri) uri = cachedConfig.uri;
      if (!graphId) graphId = cachedConfig.graphId;
      const promises = sourceInfos.map(async source => {
        // TODO: 下面语句查不出结果
        const res = await this.ctx.curl(
          `${uri}/graphs/${graphId}/traversers/kneighbor?source="${source.id}"&max_depth=${sep}`,
          // `${uri}/graphs/${graphId}/traversers/kneighbor`,
          {
            method: 'GET',
            data: {
              // source: source.id,
              // step: {
              //   direction: 'BOTH',
              //   labels: ['Serve'],
              //   properties: {},
              //   max_degree: 10000,
              //   skip_degree: 100000,
              // },
              // max_depth: sep,
              // with_vertex: true,
            },
            dataType: 'json',
          },
        );
        console.log('subres', res);
        if (res.status === 200) {
          const formatSubData = this.formatGraphData(res.data);
          resultData = this.concatGraph(resultData, formatSubData);
          console.log('concat', resultData, formatSubData);
        }
        success = success || res.status === 200;
        result = res;
        return res;
      });

      await Promise.all(promises);

      if (!success) {
        return {
          success: false,
          code: result.status,
          message: result.data.message,
        };
      }

      console.log('neighborsucess', resultData);
      return {
        success: true,
        code: 200,
        message: '扩散查询成功',
        data: resultData,
      };
    } catch (error) {
      return {
        success: false,
        code: 200,
        message: error,
      };
    }
  }

  /**
   * 元素详情查询
   * @param params
   */
  async queryElementProperties(params) {
    const { ids, graphId, uri } = params;
    const gremlin = `${graphId}.traversal().V("${ids.join('","')}").valueMap()`;
    let result;
    try {
      const cachedConfig = readHugeGraphConfig();
      if (!uri) uri = cachedConfig.uri;
      result = await this.ctx.curl(`${uri}/gremlin?gremlin=${gremlin}`, {
        method: 'GET',
        data: {},
        dataType: 'json',
      });

      if (result.status !== 200) {
        return {
          success: false,
          code: result.status,
          message: result.data.message,
        };
      }
      const properties = {};
      result.data.result.data?.forEach(item => {
        Object.keys(item).forEach(propertyName => {
          properties[propertyName] = item[propertyName];
        });
      });
      return {
        success: true,
        code: 200,
        message: 'Gremlin 查询成功',
        data: properties,
      };
    } catch (error) {
      return {
        success: false,
        code: 200,
        message: error,
      };
    }

    return result;
  }
  /**
   * 将 HugeGraph 查询 Schema 结果转成图 Schema 结构
   * @param data
   */
  formatSchema(data) {
    const { propertykeys, vertexlabels, edgelabels } = data;
    const nodes = [];
    const edges = [];
    const propertyMap = {};
    propertykeys.forEach(property => {
      propertyMap[property.name] = property.data_type === 'TEXT' ? 'string' : property.data_type;
    });
    vertexlabels.forEach(vertex => {
      const properties = {};
      vertex.properties.forEach(key => {
        properties[key] = propertyMap[key];
      });
      nodes.push({
        id: vertex.id,
        nodeType: vertex.name,
        label: vertex.name,
        properties,
        nodeTypeKeyFromProperties: 'nodeType',
      });
    });
    edgelabels.forEach(edge => {
      const properties = {};
      edge.properties.forEach(key => {
        properties[key] = propertyMap[key];
      });
      edges.push({
        edgeType: edge.name,
        sourceNodeType: edge.source_label,
        targetNodeType: edge.target_label,
        label: edge.name,
        properties,
        edgeTypeKeyFromProperties: 'edgeType',
      });
    });
    return { nodes, edges };
  }

  /**
   * 将 HugeGraph 查询的图数据结果转成图结构
   * @param items 可能是节点与边混合的数组，可能是 { vertices: [], edges: [] }
   */
  formatGraphData(items) {
    let nodes = [];
    let edges = [];
    const { vertices, edges: propEdges } = items;
    if (vertices || propEdges) {
      nodes = vertices?.map(vertex => {
        return {
          id: vertex.id,
          nodeType: vertex.label,
          nodeTypeKeyFromProperties: 'nodeType',
          data: {
            ...vertex.properties,
            nodeType: vertex.label,
          },
        };
      });
      edges =
        propEdges?.map(edge => {
          return {
            id: edge.id,
            edgeType: edge.label,
            edgeTypeKeyFromProperties: 'edgeType',
            source: item.source,
            target: item.target,
            data: {
              ...edge.properties,
              edgeType: edge.label,
            },
          };
        }) || [];
    } else {
      items.forEach(item => {
        if (item.type === 'edge') {
          edges.push({
            id: item.id,
            edgeType: item.label,
            edgeTypeKeyFromProperties: 'edgeType',
            source: item.source,
            target: item.target,
            data: {
              ...item.properties,
              edgeType: item.label,
            },
          });
        } else if (item.type === 'vertex') {
          nodes.push({
            id: item.id,
            nodeType: item.label,
            nodeTypeKeyFromProperties: 'nodeType',
            data: {
              ...item.properties,
              nodeType: item.label,
            },
          });
        }
      });
    }
    return { nodes, edges };
  }

  /**
   * 拼接两个图数据
   * @param graphA
   * @param graphB
   */
  concatGraph(graphA, graphB) {
    const nodes = graphA.nodes;
    const edges = graphA.edges;
    const nodeMap = {};
    const edgeMap = {};
    nodes.forEach(node => (nodeMap[node.id] = node));
    edges.forEach(edge => (edgeMap[edge.id] = edge));
    graphB.nodes?.forEach(node => {
      if (!nodeMap[node.id]) {
        nodeMap[node.id] = node;
        nodes.push(node);
      }
    });
    graphB.edges?.forEach(edge => {
      if (!edgeMap[edge.id]) {
        edgeMap[edge.id] = edge;
        edges.push(edge);
      }
    });
    return { nodes, edges };
  }
}

export default HugeGraphService;
