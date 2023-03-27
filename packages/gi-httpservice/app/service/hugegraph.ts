// @ts-nocheck

import { Service } from 'egg';
import fs from 'fs';
import { readNeo4jConfig } from '../util';

class HugeGraphService extends Service {
  private uri: string;
  private username: string;
  private password: string;

  async connect(params) {
    const { uri, username, password, httpServerURL } = params;
    let result;
    try {
      // this.uri = uri;
      // this.username = username;
      // this.password = password;

      // new Neo4jDriverInstanceClass(uri, username, password);

      const { engineServerURL } = readGraphScopeConfig();
      console.log('engineServerURLengineServerURL', engineServerURL);
      result = await this.ctx.curl(`${engineServerURL}/graphs/hugegraph/schema`, {
        method: 'GET',
        data: {},
        dataType: 'json',
      });
      console.log('rerererre', result);

      const config = {
        uri,
        username,
        password,
        httpServerURL,
      };
      console.log('xxx', config);
      fs.writeFileSync(`${__dirname}/HugeGraph_CONFIG.json`, JSON.stringify(config, null, 2), 'utf-8');

      return {
        success: true,
        code: 200,
        message: '连接数据库成功',
        data: {
          httpServerURL,
        },
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
   * 关闭创建的 GraphScope 实例
   */
  async disConnect() {
    try {
      const session = Neo4jDriverInstanceClass.getSessionInstance(this.uri, this.username, this.password);
      const result = await session.close();
      return {
        success: true,
        code: 200,
        message: '关闭连接成功',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: error,
      };
    }
  }

  /**
   * 将 Neo4j 查询结果转成图结构
   * @param records
   */
  generatorGraphData(records) {
    const nodeArray = [];
    const edgeArray = [];
    records.forEach(record => {
      const currentObj = record.toObject();
      for (const key in currentObj) {
        const { labels, properties, identity, start, end, type, segments } = currentObj[key];
        // start && end && identity 都存在的为边
        if (start && end && identity && !segments) {
          // 不存在 labels 则说明是边
          const hasRelation = edgeArray.find(d => d.id === `${identity.low}`);
          if (!hasRelation) {
            edgeArray.push({
              id: identity.low,
              source: `${start.low}`,
              target: `${end.low}`,
              edgeType: type,
              properties,
            });
          }
        }

        // labels && identity 存在，start && end 不存在的为点
        if (labels && identity && !segments) {
          // 不存在 labels 则说明是边
          // 是否已经存在该节点
          const hasNode = nodeArray.find(d => d.id === `${identity.low}`);
          if (!hasNode) {
            nodeArray.push({
              id: `${identity.low}`,
              label: labels[0],
              nodeType: labels[0],
              properties,
            });
          }
        }

        // start && end 存在，identity 不存在的为 path
        if (segments) {
          segments.forEach(segment => {
            const { start, end, relationship } = segment;
            const { identity: startIdentity, labels: startLabels, properties: startProperties } = start;
            const { identity: endIdentity, labels: endLabels, properties: endProperties } = end;
            const hasStartNode = nodeArray.find(d => d.id === `${startIdentity.low}`);
            if (!hasStartNode) {
              nodeArray.push({
                id: `${startIdentity.low}`,
                label: startLabels[0],
                nodeType: startLabels[0],
                properties: startProperties,
              });
            }

            const hasEndtNode = nodeArray.find(d => d.id === `${endIdentity.low}`);
            if (!hasEndtNode) {
              nodeArray.push({
                id: `${endIdentity.low}`,
                label: endLabels[0],
                nodeType: endLabels[0],
                properties: endProperties,
              });
            }

            const { identity, type, start: source, end: target, properties } = relationship;
            const hasRelation = edgeArray.find(d => d.id === `${identity.low}`);
            if (!hasRelation) {
              edgeArray.push({
                source: `${source.low}`,
                target: `${target.low}`,
                edgeType: type,
                properties,
              });
            }
          });
        }
      }
    });
    return {
      nodes: nodeArray,
      edges: edgeArray,
    };
  }

  /**
   * 使用 Graph Language 语句进行查询
   * @param params 查询参数
   */
  async queryByGraphLanguage(params) {
    const defaultQuery = `MATCH (p) RETURN p LIMIT 6`;
    const { value = defaultQuery } = params;
    const { uri, username, password } = readNeo4jConfig();

    const session = Neo4jDriverInstanceClass.getSessionInstance(uri, username, password);

    const response = await session.readTransaction(tx => tx.run(value));

    const graphData = this.generatorGraphData(response.records);

    return {
      success: true,
      code: 200,
      data: graphData,
    };
  }

  /**
   * 邻居查询
   * @param params
   */
  async queryNeighbors(params) {
    const { ids, sep = 1 } = params;

    let cypher = `match data=(n)-[*..${sep}]-(m) WHERE id(n)=${ids[0]} RETURN data LIMIT 100`;

    if (ids.length > 1) {
      // 查询两度关系，需要先查询节点，再查询子图
      cypher = `match data=(n)-[*..${sep}]-(m) WHERE id(n) in [${ids}] RETURN data LIMIT 200`;
    }

    const { uri, username, password } = readNeo4jConfig();

    const session = Neo4jDriverInstanceClass.getSessionInstance(uri, username, password);

    const response = await session.readTransaction(tx => tx.run(cypher));

    const graphData = this.generatorGraphData(response.records);

    return {
      data: graphData,
      code: 200,
      success: true,
    };
  }

  /**
   * 查询 Neo4j 数据库中的 Schema
   */
  async getGraphSchema() {
    const { uri, username, password } = readNeo4jConfig();

    const session = Neo4jDriverInstanceClass.getSessionInstance(uri, username, password);

    const schemaCypher = 'CALL db.schema.visualization';

    const result = await session.readTransaction(tx => tx.run(schemaCypher));

    const nodeSchemas = [];
    const edgeSchemas = [];
    result.records.forEach(record => {
      const currentRecord = record.toObject();

      const { nodes, relationships } = currentRecord;

      for (const node of nodes) {
        const { identity, labels, properties } = node;
        const hasNode = nodeSchemas.find(d => d.id === `${identity.low}`);
        if (!hasNode) {
          nodeSchemas.push({
            id: `${identity.low}`,
            label: labels[0],
            nodeType: labels[0],
            nodeTypeKeyFromProperties: 'nodeType',
            properties,
          });
        }
      }

      for (const edge of relationships) {
        const { identity, type, start, end, properties } = edge;
        const hasEdge = edgeSchemas.find(d => d.id === `${identity.low}`);
        if (!hasEdge) {
          const sourceNode = nodeSchemas.find(d => d.id === `${start.low}`);
          const targetNode = nodeSchemas.find(d => d.id === `${end.low}`);

          edgeSchemas.push({
            id: `${identity.low}`,
            label: type,
            edgeType: type,
            sourceNodeType: sourceNode.label,
            targetNodeType: targetNode.label,
            edgeTypeKeyFromProperties: 'edgeType',
            properties,
          });
        }
      }
    });

    return {
      success: true,
      code: 200,
      data: {
        nodes: nodeSchemas,
        edges: edgeSchemas,
      },
    };
  }
}

export default HugeGraphService;
