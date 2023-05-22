import { notification } from 'antd';
import neo4j, { Driver, Node, Path, Relationship } from 'neo4j-driver';
export interface GraphNode {
  id: string; // 节点id
  label: string; // 节点标签
  nodeType: string;
  nodeTypeKeyFromProperties: string;
  data: Record<string, any>; // 节点属性
}

export interface GraphEdge {
  id: string;
  source: string; // 边的起点
  target: string; // 边的终点
  label: string; // 边的标签
  edgeType: string;
  edgeTypeKeyFromProperties: string;
  data: Record<string, any>; // 边的属性
}

export interface Graph {
  nodes: GraphNode[]; // 图的节点
  edges: GraphEdge[]; // 图的边
}

export interface Table {
  headers: string[]; // 表头
  rows: Record<string, any>[]; // 表的行
}

class Neo4JDriver {
  private driver: Driver;
  private database: string;

  constructor(uri: string, username: string, password: string) {
    try {
      this.driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
      this.database = '';
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 获取数据库名称
   * @returns 数据库名称
   */
  async connect() {
    try {
      await this.driver.verifyConnectivity();
      return true;
    } catch (error) {
      return false;
    }
  }

  async getDatabase(): Promise<any> {
    try {
      const session = this.driver.session();
      const result = await session.run('SHOW DATABASES');
      return result.records.map(record => {
        return record.toObject();
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 获取数据库的schema，如果能够转化为图结构，返回图结构，否则返回table结构
   * @param databaseName 数据库名称
   * @returns 如果能够转化为图结构，返回图结构，否则返回table结构
   */
  async getSchema(databaseName: string): Promise<Graph | Table> {
    this.database = databaseName;
    const session = this.driver.session({
      database: databaseName,
    });
    try {
      const result = await session.run(`
      CALL db.schema.visualization
    `);
      session.close();
      const record = result.records[0];

      const nodes = record.get('nodes').map((node: Node) => {
        const label = node.labels[0];
        const properties = node.properties;
        return {
          id: node.elementId,
          label,
          nodeType: label,
          nodeTypeKeyFromProperties: 'GI_TYPE',
          properties: {
            ...properties,
            GI_TYPE: 'string',
          },
        };
      });

      const edges = record.get('relationships').map((relationship: Relationship) => {
        const source = relationship.startNodeElementId;
        const target = relationship.endNodeElementId;
        const label = relationship.type;
        const properties = relationship.properties;
        const id = relationship.elementId;

        return {
          id,
          source,
          target,
          label,
          edgeType: label,
          edgeTypeKeyFromProperties: 'GI_TYPE',
          properties: {
            ...properties,
            GI_TYPE: 'string',
            source: 'string',
            target: 'string',
          },
        };
      });
      return { nodes, edges };
    } catch (error) {
      console.log(error);
      return {
        nodes: [],
        edges: [],
      };
    }
  }

  /**
   * 将查询结果转化为图结构，如果不能转化为图结构，转化为table结构
   * @param result 查询结果
   * @returns 如果能够转化为图结构，返回图结构，否则返回table结构
   */
  private processResult(result) {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const table: Table = {
      headers: [],
      rows: [],
    };

    result.records.forEach(record => {
      //@ts-ignore
      record._fields.forEach(item => {
        const isNode = item.__isNode__;
        const isEdge = item.__isRelationship__;
        const isPath = item.__isPath__;
        const isInteger = item.__isInteger__;

        if (isNode) {
          const { labels, properties, identity } = item as Node;
          const nodeLabel = labels[0];
          nodes.push({
            id: identity.low.toString(),
            label: nodeLabel,
            nodeType: nodeLabel,
            nodeTypeKeyFromProperties: 'GI_TYPE',
            data: {
              label: nodeLabel,
              GI_TYPE: nodeLabel,
              ...properties,
            },
          });
        }
        if (isEdge) {
          const { start, end, properties, type, identity } = item as Relationship;
          const source = start.low.toString();
          const target = end.low.toString();
          const label = type;
          edges.push({
            id: identity.low.toString(),
            source,
            target,
            label,
            edgeType: label,
            edgeTypeKeyFromProperties: 'GI_TYPE',
            data: {
              source,
              target,
              GI_TYPE: label,
              label,
              ...properties,
            },
          });
        }
        if (isPath) {
          const { segments } = item as Path;
          segments.forEach(c => {
            const { start, end, relationship } = c;
            const { identity: startIdentity, labels: startLabels, properties: startProperties } = start;
            const { identity: endIdentity, labels: endLabels, properties: endProperties } = end;
            let hasStarNode, hasEndNode;

            nodes.forEach(item => {
              if (item.id === startIdentity.low.toString()) hasStarNode = true;
              if (item.id === endIdentity.low.toString()) hasEndNode = true;
            });

            if (!hasStarNode) {
              nodes.push({
                id: startIdentity.low.toString(),
                label: startLabels[0],
                nodeType: startLabels[0],
                nodeTypeKeyFromProperties: 'GI_TYPE',
                data: {
                  label: startLabels[0],
                  GI_TYPE: startLabels[0],
                  ...startProperties,
                },
              });
            }
            if (!hasEndNode) {
              nodes.push({
                id: endIdentity.low.toString(),
                label: endLabels[0],
                nodeType: endLabels[0],
                nodeTypeKeyFromProperties: 'GI_TYPE',
                data: {
                  label: endLabels[0],
                  GI_TYPE: endLabels[0],
                  ...endProperties,
                },
              });
            }
            const { identity, type, start: source, end: target, properties } = relationship;
            const hasRelationship = edges.find(d => d.id === identity.low.toString());
            if (!hasRelationship) {
              edges.push({
                id: identity.low.toString(),
                source: source.low.toString(),
                target: target.low.toString(),
                label: type,
                edgeType: type,
                edgeTypeKeyFromProperties: 'GI_TYPE',
                data: {
                  source: source.low.toString(),
                  target: target.low.toString(),
                  GI_TYPE: type,
                  ...properties,
                },
              });
            }
          });
        }
        if (isInteger) {
          table.headers.push(...(record.keys as string[]));
          table.rows.push(item.low);
        }
      });
    });

    console.log({ nodes, edges, table });
    return { nodes, edges, table };
  }

  /**
   * 获取指定节点的k度关系，如果能够转化为图结构，返回图结构，否则返回table结构
   * @param nodeIds 节点id数组
   * @param degree k度
   * @returns 如果能够转化为图结构，返回图结构，否则返回table结构
   */
  async getKDegreeRelationships(nodeIds: string[], degree: number): Promise<Graph | Table> {
    try {
      const session = this.driver.session({ database: this.database });

      const value = `
      match data=(n)-[*..${degree}]-(m) WHERE id(n) in [${nodeIds}] RETURN data LIMIT 200
      `;

      const result = await session.run(value);
      console.log('%c[Neo4j Driver] NeighborsQuery 查询语句', 'color:yellow', value);
      console.log('%c[Neo4j Driver] NeighborsQuery 查询结果', 'color:green', result);

      session.close();

      return this.processResult(result);
    } catch (error: any) {
      console.log('error', error);
      notification.error({
        message: '邻居查询出错',
        description: error.toString(),
      });
      return {
        nodes: [],
        edges: [],
      };
    }
  }

  /**
   * 查询cypher语句
   * @param cypher cypher语句
   * @returns 如果能够转化为图结构，返回图结构，否则返回table结构
   */
  async queryCypher(cypher: string): Promise<Graph | Table> {
    try {
      const session = this.driver.session({
        database: this.database,
      });
      const result = await session.run(cypher);
      console.log('%c[Neo4j Driver] QueryCypher 查询语句', 'color:yellow', cypher);
      console.log('%c[Neo4j Driver] QueryCypher 查询结果', 'color:green', result);
      session.close();
      return this.processResult(result);
    } catch (error: any) {
      console.log(error);
      notification.error({
        message: 'Cypher 查询出错',
        description: error.toString(),
      });
      return {
        nodes: [],
        edges: [],
      };
    }
  }

  /**
   * 关闭数据库连接
   */
  async close(): Promise<void> {
    await this.driver.close();
  }
}

export default Neo4JDriver;
