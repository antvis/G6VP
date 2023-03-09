/**
 * 子图相关，主要包括以下几部分内容：
 * 1. 创建子图
 * 2. 删除子图
 * 3. 修改子图
 * 4. 获取子图列表
 * 5. 查询子图信息
 * 6. 提取子图
 */

import { Service } from 'egg';
import { EngineServerURL } from './constant'

class TuGraphSubGraphService extends Service {

  /**
   * 根据节点 ID 提取子图信息
   * @param graphName 子图名称
   * @param vertexIds 节点 ID 集合
   * @returns 
   */
  async querySubGraphByNodeIds(graphName: string, vertexIds: string[]) {
    const subGraphResult = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: `call db.subgraph([${vertexIds}])`,
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
    return {
      success: true,
      data: graphData
    }
  }

  /**
   * 通过 Cypher 语句查询子图数据
   * @param graphName 图名称
   * @param cypher Cypher 查询语句
   */
  async querySubGraphByCypher(graphName: string, cypher: string) {
    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
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

    // TODO： 这个逻辑需要等 TuGraph 重构完再调整
    // const nodeIds = [...new Set([...getNodeIdsByEids(result).nodeIds, ...getNodeIds(result)])];
    const nodeIds = []
    // 拿到节点 ID 后，查询子图

    if (nodeIds.length === 0) {
      return {
        nodes: [],
        edges: [],
      };
    }

    const subGraphResult = await this.querySubGraphByNodeIds(graphName, nodeIds)
    return subGraphResult
  }

  /**
   * 查询子图列表
   */
  async getSubGraphList() {
    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        script: `CALL dbms.graph.listGraphs()`,
      },
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
}

export default TuGraphSubGraphService;
