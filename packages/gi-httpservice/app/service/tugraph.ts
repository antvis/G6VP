import { Service } from 'egg';
import { getNodeIds, getNodeIdsByEids } from '../tugraph.utils';
import { readTuGraphConfig } from '../util';
import { ILanguageQueryParams, INeighborsParams } from './serviceInterface';
const fs = require('fs');

class TuGraphService extends Service {
  async connect(username, password, serverUrl) {
    const config = {
      engineServerURL: serverUrl,
    };
    fs.writeFileSync(`${__dirname}/TUGRAPH_CONFIG.json`, JSON.stringify(config, null, 2), 'utf-8');

    const result = await this.ctx.curl(`${serverUrl}/login`, {
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
      data: {
        user: username,
        password,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    if (result.status !== 200) {
      return {
        success: false,
        code: result.status,
        data: result.data,
      };
    }

    return {
      data: result.data,
      code: 200,
      success: true,
    };
  }

  /**
   * 通过 Cypher 语句查询子图数据
   * @param cypher Cypher 查询语句
   * @param graphName 图名称
   * @param authorization 认证信息
   */
  async querySubGraphByCypher(cypher: string, graphName: string, authorization: string) {
    const { engineServerURL } = readTuGraphConfig();

    const result = await this.ctx.curl(`${engineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: cypher,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    if (result.status !== 200) {
      return result.data;
    }

    // 如果返回有Eid,就使用Eid组装nodeIds
    const nodeIds = [...new Set([...getNodeIdsByEids(result).nodeIds, ...getNodeIds(result)])];

    // 拿到节点 ID 后，查询子图

    if (nodeIds.length === 0) {
      return {
        nodes: [],
        edges: [],
      };
    }

    const subGraphResult = await this.ctx
      .curl(`${engineServerURL}/cypher`, {
        headers: {
          'content-type': 'application/json',
          Authorization: authorization,
        },
        method: 'POST',
        data: {
          // vertex_ids: nodeIds,
          graph: graphName,
          script: `call db.subgraph([${nodeIds}])`,
        },
        timeout: [30000, 50000],
        dataType: 'json',
      })
      .then(res => {
        const graphData = JSON.parse(res.data.result[0]);

        graphData.nodes.forEach(item => {
          item.vid = item.identity;
        });

        graphData.relationships.forEach(item => {
          item.source = item.src;
          item.destination = item.dst;
          item.uid = `${item.src}_${item.dst}_${item.label_id}_${item.temporal_id}_${item.identity}`;
        });
        return {
          status: res.status,
          data: graphData,
        };
      });

    if (subGraphResult.status !== 200) {
      return subGraphResult.data;
    }

    // if (getNodeIdsByEids(result).edgeIds.length) {
    //   let relationships: any[] = [];
    //   getNodeIdsByEids(result).edgeIds.find(eid => {
    //     let target = subGraphResult.data.relationships.find(item => item.uid === eid);
    //     target && relationships.push(target);
    //   });
    //   subGraphResult.data.relationships = relationships;
    // }
    // const GRAPH_DATA = craeteGraphData(subGraphResult, 'GRAPH_DATA', 'queryByCypher');
    // console.log('GRAPH_DATA', GRAPH_DATA);

    const { nodes, relationships } = subGraphResult.data;
    console.log('subGraphResult.data', subGraphResult.data);

    const graphData = {
      nodes: nodes.map(node => {
        const { vid, label, ...others } = node;
        return {
          ...others.properties,
          ...others,
          label,
          nodeType: label,
          id: `${vid}`,
        };
      }),
      edges: relationships.map(r => {
        const { uid, label, destination, source, ...others } = r;
        return {
          ...others.properties,
          ...others,
          id: `${uid}`,
          label,
          edgeType: label,
          target: `${destination}`,
          source: `${source}`,
        };
      }),
    };
    return graphData;
  }

  /**
   * 使用 Cypher 语句查询
   * @param params
   */
  async queryByGraphLanguage(params: ILanguageQueryParams) {
    const { graphName = '', value, authorization = '' } = params;

    const responseData = await this.querySubGraphByCypher(value, graphName, authorization);
    return {
      data: responseData,
      code: 200,
      success: true,
    };
  }

  /**
   *
   * @param params
   */
  async queryNeighbors(params: INeighborsParams) {
    const { ids, graphName = '', sep = 1, authorization = '' } = params;
    let cypher = `match(n)-[*..${sep}]-(m) WHERE id(n)=${ids[0]} RETURN n, m LIMIT 100`;

    if (ids.length > 1) {
      // 查询两度关系，需要先查询节点，再查询子图
      cypher = `match(n)-[*..${sep}]-(m) WHERE id(n) in [${ids}] RETURN n, m LIMIT 200`;
    }

    const responseData = await this.querySubGraphByCypher(cypher, graphName, authorization);
    return {
      data: responseData,
      code: 200,
      success: true,
    };
  }

  async queryEdgeSchema(edgeType: string, graphName: string, authorization: string) {
    const { engineServerURL } = readTuGraphConfig();

    const result = await this.ctx.curl(`${engineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: `CALL db.getEdgeSchema('${edgeType}')`,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    if (result.status !== 200) {
      return {
        success: false,
        code: result.status,
        data: result.data,
      };
    }

    const edgeSchema = result.data.result;
    const { constraints, label, properties } = JSON.parse(edgeSchema[0][0]);
    if (constraints.length === 0) {
      // 忽略这条信息
      return null;
    }
    const [source, target] = constraints[0];

    const propertiesObj = {} as any;
    for (const p of properties) {
      propertiesObj[p.name] = p.type === 'STRING' ? 'string' : 'number';
    }

    return {
      sourceNodeType: source,
      targetNodeType: target,
      edgeTypeKeyFromProperties: 'edgeType',
      edgeType: label,
      label,
      properties: propertiesObj,
    };
  }

  /**
   * 查询指定子图的 Schema
   * @param graphName 子图名称
   * @param authorization 认证信息
   */
  async querySchema(graphName: string, authorization: string) {
    const { engineServerURL } = readTuGraphConfig();

    const result = await this.ctx.curl(`${engineServerURL}/db/${graphName}/label`, {
      headers: {
        'content-type': 'application/json',
        Authorization: authorization,
      },
      method: 'GET',
      timeout: [30000, 50000],
      dataType: 'json',
    });

    if (result.status !== 200) {
      return {
        success: false,
        code: result.status,
        data: result.data,
      };
    }

    const labels = result.data;
    const { vertex, edge } = labels;

    const nodePromise = vertex.map(async v => {
      const nodeLabelResult = await this.ctx.curl(`${engineServerURL}/db/${graphName}/label/node/${v}`, {
        headers: {
          'content-type': 'application/json',
          Authorization: authorization,
        },
        method: 'GET',
        timeout: [30000, 50000],
        dataType: 'json',
      });
      const propertiesObj = {} as any;
      for (const key in nodeLabelResult.data) {
        const current = nodeLabelResult.data[key];
        propertiesObj[key] = current.type === 'STRING' ? 'string' : 'number';
      }
      return {
        id: v,
        nodeType: v,
        nodeTypeKeyFromProperties: 'nodeType',
        properties: propertiesObj,
      };
    });

    const nodeSchema = await Promise.all(nodePromise);

    const edgePromise = edge.map(async e => {
      const edgeLabelResult = await this.queryEdgeSchema(e, graphName, authorization);
      return edgeLabelResult;
    });

    const edgeSchema = await Promise.all(edgePromise);

    const graphSchema = {
      nodes: nodeSchema,
      edges: edgeSchema.filter(d => d),
    };
    return {
      code: 200,
      success: true,
      data: graphSchema,
    };
  }

  /**
   * 查询子图列表
   * @param authorization 认证信息
   */
  async getSubGraphList(authorization: string) {
    const { engineServerURL } = readTuGraphConfig();

    const result = await this.ctx.curl(`${engineServerURL}/db`, {
      headers: {
        'content-type': 'application/json',
        Authorization: authorization,
      },
      method: 'GET',
      timeout: [30000, 50000],
      dataType: 'json',
    });

    if (result.status !== 200) {
      return {
        success: false,
        code: result.status,
        data: null,
      };
    }

    const list = [] as any;
    for (const key in result.data) {
      const current = result.data[key];
      const { description, max_size_GB } = current;
      list.push({
        value: key,
        label: key,
        description,
        maxSizeGB: max_size_GB,
      });
    }
    return {
      success: true,
      code: 200,
      data: list,
    };
  }

  /**
   * 查询指定子图中节点和边的数量
   * @param graphName 子图名称
   * @param authorization 认证信息
   */
  async getVertexEdgeCount(graphName: string, authorization: string) {
    const { engineServerURL } = readTuGraphConfig();

    const nodeResult = await this.ctx.curl(`${engineServerURL}/db/${graphName}/node`, {
      headers: {
        'content-type': 'application/json',
        Authorization: authorization,
      },
      method: 'GET',
      timeout: [30000, 50000],
      dataType: 'json',
    });

    if (nodeResult.status !== 200) {
      return {
        success: false,
        code: nodeResult.status,
        data: null,
      };
    }

    const { num_vertex, num_label } = nodeResult.data;

    // 查询 graph 中边的数量
    const edgeCypher = 'MATCH ()-->() RETURN count(*)';
    const result = await this.ctx.curl(`${engineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: edgeCypher,
      },
      timeout: [30000, 500000],
      dataType: 'json',
    });

    if (result.status !== 200) {
      return {
        success: false,
        code: result.status,
        data: result.data,
      };
    }

    return {
      success: true,
      code: 200,
      data: {
        nodeCount: num_vertex,
        nodeLabelCount: num_label,
        edgeCount: result.data.result[0][0],
      },
    };
  }
}

export default TuGraphService;
