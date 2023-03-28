import { Service } from 'egg';
import fs from 'fs';
import { isString } from 'util';
import { readHugeGraphConfig } from '../util';

class HugeGraphService extends Service {
  /**
   * 获取该 uri 服务下的图列表
   */
  async listGraphs(params) {
    // TODO: username password 暂时没用到？
    let { uri, httpServerURL, username, password } = params;
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
        if (res.success) {
          subGraphSchemas[graphId] = res.data;
          success = true;
        }
        result = res;
        return res;
      });

      await Promise.all(promises);

      if (!success) {
        return {
          success: false,
          code: 200,
          message: '图列表查询失败',
        };
      }

      const config = {
        uri,
        graphId: result.data.graphs?.[0],
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
  }

  /**
   * 查询 HugeGraph 数据库中指定 graph 的 Schema
   */
  async getGraphSchema(params) {
    let { graphId, uri } = params;
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
    let { gremlin, uri, graphId } = params;
    let result;
    try {
      const cachedConfig = readHugeGraphConfig();
      if (!uri) uri = cachedConfig.uri;
      if (!graphId) graphId = cachedConfig.graphId;
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

      const formatData = await this.formatGraphData(result.data.result.data, uri, graphId);
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
  async queryNeighbors(params, propsResultData: any = undefined) {
    let { ids, sep, uri, graphId } = params;
    let success = false;
    let result;
    let resultData = propsResultData || { nodes: [], edges: [] };
    try {
      const cachedConfig = readHugeGraphConfig();
      if (!uri) uri = cachedConfig.uri;
      if (!graphId) graphId = cachedConfig.graphId;
      const otherEnds = new Set();
      const nodePromises = ids.map(async id => {
        const res = await this.queryByGremlin({
          gremlin: `${graphId}.traversal().V("${id}").bothE().bothV()`,
          uri,
          graphId,
        });
        if (res.success) {
          success = true;
          result = res;
          res.data?.nodes.forEach(node => {
            otherEnds.add(node.id);
          });
          resultData = this.concatGraph(resultData, res.data);
        }
        return res;
      });
      const edgePromises = ids.map(async id => {
        const res = await this.queryByGremlin({
          gremlin: `${graphId}.traversal().V("${id}").bothE()`,
          uri,
          graphId,
        });
        if (res.success) {
          success = true;
          result = res;
          resultData = this.concatGraph(resultData, res.data);
        }
        return res;
      });

      await Promise.all(nodePromises.concat(edgePromises));

      if (!success) {
        return {
          success: false,
          code: result.status,
          message: result.data.message,
        };
      }

      if (sep > 1) {
        ids.forEach(id => otherEnds.delete(id));
        await this.queryNeighbors(
          {
            ...params,
            ids: Array.from(otherEnds),
            sep: sep - 1,
          },
          resultData,
        );
      }

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
    let { ids, graphId, uri, itemType = 'node' } = params;
    const command = itemType === 'node' ? 'V' : 'E';
    const gremlin = `${graphId}.traversal().${command}("${ids.join('","')}").valueMap()`;
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
      const itemProperties = {};
      result.data.result.data?.forEach((item, i) => {
        const properties = {};
        Object.keys(item).forEach(propertyName => {
          properties[propertyName] = item[propertyName];
        });
        itemProperties[ids[i]] = properties;
      });
      return {
        success: true,
        code: 200,
        message: 'Gremlin 查询成功',
        data: itemProperties,
      };
    } catch (error) {
      return {
        success: false,
        code: 200,
        message: error,
      };
    }
  }

  async queryOneElementProperties(params) {
    const { id, itemType } = params;
    const result = await this.queryElementProperties({
      ...params,
      ids: [id],
      itemType,
    });
    if (!result.success) return result;
    return {
      ...result,
      data: result.data?.[id],
    };
  }

  async queryNodes(params) {
    let { ids, uri, graphId } = params;
    try {
      const cachedConfig = readHugeGraphConfig();
      if (!uri) uri = cachedConfig.uri;
      if (!graphId) graphId = cachedConfig.graphId;
      const nodes: any = [];
      let success = false;
      const promises = ids.map(async id => {
        const res = await this.ctx.curl(`${uri}/graphs/${graphId}/graph/vertices/"${id}"`, {
          method: 'GET',
          data: {},
          dataType: 'json',
        });
        if (res.status === 200) {
          success = true;
          nodes.push(this.formatNode(res.data));
        }
        return res;
      });
      await Promise.all(promises);
      if (!success) {
        return {
          success: false,
          code: 200,
          message: '获取节点失败',
        };
      }
      return {
        success: true,
        code: 200,
        data: nodes,
      };
    } catch (error) {
      return {
        success: false,
        code: 200,
        message: error,
      };
    }
  }
  async queryEdges(params) {
    let { ids, uri, graphId } = params;
    try {
      const cachedConfig = readHugeGraphConfig();
      if (!uri) uri = cachedConfig.uri;
      if (!graphId) graphId = cachedConfig.graphId;
      const edges: any = [];
      let success = false;
      const promises = ids.map(async id => {
        const res = await this.ctx.curl(`${uri}/graphs/${graphId}/graph/edges/"${id}"`, {
          method: 'GET',
          data: {},
          dataType: 'json',
        });
        if (res.status === 200) {
          success = true;
          edges.push(this.formatEdge(res.data));
        }
        return res;
      });
      await Promise.all(promises);
      if (!success) {
        return {
          success: false,
          code: 200,
          message: '获取边失败',
        };
      }
      return {
        success: true,
        code: 200,
        data: edges,
      };
    } catch (error) {
      return {
        success: false,
        code: 200,
        message: error,
      };
    }
  }

  formatNode(node) {
    return {
      ...node,
      id: String(node.id),
      nodeType: node.label,
      nodeTypeKeyFromProperties: 'nodeType',
      data: {
        ...node.properties,
        nodeType: node.label,
      },
    };
  }
  formatEdge(edge) {
    return {
      ...edge,
      id: String(edge.id),
      edgeType: edge.label,
      edgeTypeKeyFromProperties: 'edgeType',
      source: String(edge.source || edge.inV),
      target: String(edge.target || edge.outV),
      data: {
        ...edge.properties,
        edgeType: edge.label,
      },
    };
  }

  /**
   * 将 HugeGraph 查询 Schema 结果转成图 Schema 结构
   * @param data
   */
  formatSchema(data) {
    const { propertykeys, vertexlabels, edgelabels } = data;
    const nodes: any = [];
    const edges: any = [];
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
        properties: {
          nodeType: vertex.name,
          ...properties,
        },
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
        properties: {
          edgeType: edge.name,
          ...properties,
        },
        edgeTypeKeyFromProperties: 'edgeType',
      });
    });
    return { nodes, edges };
  }

  /**
   * 将 HugeGraph 查询的图数据结果转成图结构
   * @param items 可能是节点与边混合的数组，可能是 { vertices: [], edges: [] }
   */
  async formatGraphData(items, uri, graphId) {
    let nodes: any = [];
    let edges: any = [];
    const { vertices, edges: propEdges } = items;
    if (vertices || propEdges) {
      let queryNodes: any = [];
      const queryPropertyIds = vertices?.filter(vertex => isString(vertex));
      if (queryPropertyIds?.length) {
        const queryNodesResult = await this.queryNodes({
          ids: queryPropertyIds,
          uri,
          graphId,
        });
        if (queryNodesResult.success) queryNodes = queryNodesResult.data;
      }

      nodes = vertices
        ?.map(vertex => {
          let node = vertex;
          if (isString(vertex)) return queryNodes.find((n: any) => n.id === vertex);
          return this.formatNode(node);
        })
        .filter(Boolean);

      let queryEdges: any = [];
      const queryPropertyEdgeIds = propEdges?.filter(edge => isString(edge));
      if (queryPropertyEdgeIds?.length) {
        const queryEdgesResult = await this.queryEdges({
          ids: queryPropertyIds,
          uri,
          graphId,
        });
        if (queryEdgesResult.success) queryEdges = queryEdgesResult.data;
      }

      edges =
        propEdges
          ?.map(e => {
            let edge = e;
            if (isString(edge)) return queryEdges.find((e: any) => e.id === edge);
            return this.formatEdge(edge);
          })
          .filter(Boolean) || [];
    } else {
      items.forEach(item => {
        if (item.type === 'edge') {
          edges.push(this.formatEdge(item));
        } else if (item.type === 'vertex') {
          nodes.push(this.formatNode(item));
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
