/**
 * Schema 相关，主要包括以下几部分内容：
 * 1. 创建 Schema
 * 2. 查询 Schema 
 * 3. 点类型
 * 4. 边类型
 * 5. 修改 Schema
 */

import { Service } from 'egg';
import { EngineServerURL } from './constant'

class TuGraphSchemaService extends Service {

  /**
   * 获取指定边类型的 Schema 信息
   * @param graphName 子图名称
   * @param edgeType 边类型
   * @returns 
   */
  async queryEdgeSchemaByType(graphName: string, edgeType: string) {
    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
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
      edgeType: label,
      label,
      properties: propertiesObj,
    };
  }

   /**
   * 获取指定边类型的 Schema 信息
   * @param graphName 子图名称
   * @param nodeType 节点类型
   * @returns 
   */
   async queryVertexSchemaByType(graphName: string, nodeType: string) {
    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: `CALL db.getVertexSchema('${nodeType}')`,
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

    const vertexSchema = result.data.result;
    const { label, properties } = JSON.parse(vertexSchema[0][0]);

    const propertiesObj = {} as any;
    for (const p of properties) {
      propertiesObj[p.name] = p.type === 'STRING' ? 'string' : 'number';
    }

    return {
      nodeType: label,
      label,
      properties: propertiesObj,
    };
  }

  /**
   * 获取所有边类型 Schema 的信息
   * @param graphName 子图名称
   * @returns 
   */
  async queryEdgeSchema(graphName: string) {
    // step1: 先获取所有边类型 
    const typeResult = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: `CALL db.edgeLabels()`,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    // step2: 根据获取到的边类型，再获取每个边类型的详细属性
    const edgeSchemaPromise = typeResult.data.map(async d => {
      const currentEdgeSchema = await this.queryEdgeSchemaByType(graphName, d)
      return currentEdgeSchema
    })
    const edgeSchema = await Promise.all(edgeSchemaPromise)
    return edgeSchema
  }

  async queryVertexSchema(graphName: string) {
    // step1: 先获取所有边类型 
    const typeResult = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: `CALL db.vertexLabels()`,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    // step2: 根据获取到的边类型，再获取每个边类型的详细属性
    const vertexSchemaPromise = typeResult.data.map( async d => {
      const currentVertexSchema = await this.queryVertexSchemaByType(graphName, d)
      return currentVertexSchema
    })
    const vertexSchema = await Promise.all(vertexSchemaPromise)
    return vertexSchema
  }

  /**
   * 查询指定子图的 Schema
   * @param graphName 子图名称
   */
  async querySchema(graphName: string) {
    const vertexSchema = await this.queryVertexSchema(graphName)
    const edgeSchema = await this.queryEdgeSchema(graphName)
    return {
      nodes: vertexSchema,
      edges: edgeSchema
    }
  }


  /**
   * 查询指定子图中节点和边的数量
   * @param graphName 子图名称
   * @param authorization 认证信息
   */
  async getVertexEdgeCount(graphName: string, authorization: string) {

    const nodeResult = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        script: 'MATCH n RETURN count(*)'
      },
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
    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
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

export default TuGraphSchemaService;
