// @ts-nocheck

import { Service } from 'egg';
import fs from 'fs';
import neo4j from 'neo4j-driver';
import { readNeo4jConfig } from '../util';

class Neo4jDriverInstanceClass {
  public driver = null;
  public session = null;

  constructor(uri, username, password) {
    if (!this.session) {
      this.session = this.initSessionInstance(uri, username, password);
    }

    if (!this.driver) {
      this.driver = this.initDriverInstance(uri, username, password);
    }
    return this.driver;
  }

  static getSessionInstance(uri, username, password) {
    if (!this.prototype.session) {
      this.prototype.session = this.prototype.initSessionInstance(uri, username, password);
    }
    return this.prototype.session;
  }

  static getDriverInstance(uri, username, password) {
    if (!this.prototype.driver) {
      this.prototype.driver = this.prototype.initDriverInstance(uri, username, password);
    }
    return this.prototype.driver;
  }

  /**
   * 初始化 Gremlin 实例，支持通过 API 方式调用
   * @param graphURL GraphScope 返回的 Gremlin 解析器的地址
   */
  initSessionInstance(uri, username, password) {
    if (!this.session) {
      const driver = this.initDriverInstance(uri, username, password);
      const session = driver.session({ database: 'neo4j' });
      this.session = session;
    }
    return this.session;
  }

  initDriverInstance(uri, username, password) {
    if (!this.driver) {
      const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
      this.driver = driver;
    }
    return this.driver;
  }

  static destoryInstance() {
    this.prototype.session = null;
    this.prototype.driver = null;
  }
}

class Neo4jService extends Service {
  private uri: string;
  private username: string;
  private password: string;
  /**
   * 创建 GraphScope 实例
   */
  async connect(params) {
    const { uri, username, password, httpServerURL } = params;
    try {
      // this.uri = uri;
      // this.username = username;
      // this.password = password;

      new Neo4jDriverInstanceClass(uri, username, password);

      const config = {
        uri,
        username,
        password,
        httpServerURL,
      };
      console.log('xxx', config);
      fs.writeFileSync(`${__dirname}/Neo4j_CONFIG.json`, JSON.stringify(config, null, 2), 'utf-8');

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
   * 使用 Graph Language 语句进行查询
   * @param params 查询参数
   */
  async queryByGraphLanguage(params) {
    const readQuery = `MATCH (p) RETURN p LIMIT 6`;
    const query = `match (n)-[r:*..1]-(m) WHERE id(n)=1 RETURN r, n, m LIMIT 50`;

    const query1 = `match data=(n)-[*..1]-(m) WHERE id(n)=1 RETURN data LIMIT 50`;
    const { value = readQuery } = params;
    const { uri, username, password } = readNeo4jConfig();

    const session = Neo4jDriverInstanceClass.getSessionInstance(uri, username, password);

    const readResult = await session.readTransaction(tx => tx.run(value));
    // console.log('查询结果', readResult);
    const nodeArray = [];
    const edgeArray = [];
    readResult.records.forEach(record => {
      // console.log(`Found person: ${record.get('name')}`, record);
      // console.log(`Found person:`, record.toObject());
      const currentObj = record.toObject();
      for (const key in currentObj) {
        const { labels, properties, identity, start, end, type } = currentObj[key];
        // start && end && identity 都存在的为边
        if (start && end && identity) {
          // 不存在 labels 则说明是边
          edgeArray.push({
            id: identity.low,
            source: `${start.low}`,
            target: `${end.low}`,
            edgeType: type,
            properties,
          });
        }

        // labels && identity 存在，start && end 不存在的为点
        if (labels && identity) {
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
        if (start && end && !identity) {
          console.log(currentObj[key]);
          const { start: pathStart, end: pathEnd } = currentObj[key];
          console.log(pathStart, pathEnd);
        }
      }
    });

    return {
      success: true,
      code: 200,
      data: {
        nodes: nodeArray,
        edges: edgeArray,
      },
    };
  }

  /**
   * 邻居查询
   * @param params
   */
  async queryNeighbors(params) {
    const { ids, sep = 1 } = params;
    let cypher = `match(n)-[*..${sep}]-(m) WHERE id(n)=${ids[0]} RETURN n, m LIMIT 100`;

    if (ids.length > 1) {
      // 查询两度关系，需要先查询节点，再查询子图
      cypher = `match(n)-[*..${sep}]-(m) WHERE id(n) in [${ids}] RETURN n, m LIMIT 200`;
    }

    const session = Neo4jDriverInstanceClass.getSessionInstance(this.uri, this.username, this.password);

    const responseData = await session.readTransaction(tx => tx.run(cypher));

    console.log('查询结果', responseData);

    return {
      data: responseData,
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

export default Neo4jService;
