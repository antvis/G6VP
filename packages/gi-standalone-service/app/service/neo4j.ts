// @ts-nocheck

import { Service } from 'egg';

import neo4j from 'neo4j-driver';

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
  async connect(uri, username, password) {
    try {
      this.uri = uri;
      this.username = username;
      this.password = password;
      new Neo4jDriverInstanceClass(uri, username, password);
      return {
        success: true,
        code: 200,
        message: '连接数据库成功',
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
    const readQuery = `MATCH (p:Person)
                       WHERE p.name = 'Alice'
                       RETURN p`;
    const { value = readQuery } = params;
    const session = Neo4jDriverInstanceClass.getSessionInstance(this.uri, this.username, this.password);

    const readResult = await session.readTransaction(tx => tx.run(value));
    // console.log('查询结果', readResult);
    readResult.records.forEach(record => {
      // console.log(`Found person: ${record.get('name')}`, record);
      console.log(`Found person:`, record.toObject().p);
    });
    return {
      success: true,
      code: 200,
      data: readResult.records,
    };
  }

  generatorGraphData(value) {
    const { id, label, properties } = value;
    const obj = {};

    // 节点
    obj['id'] = `${id}`;
    obj['label'] = label;

    if (properties) {
      const elementProp = {};
      for (const key in properties) {
        const currentProp = properties[key];
        if (currentProp && currentProp[0]) {
          elementProp[`${key}`] = currentProp[0].value;
        }
      }
      obj['data'] = elementProp;
    }

    return obj;
  }

  /**
   * 通过 Gremlin 语句查询
   * @param gremlinSQL Gremlin 查询语句
   */
  async queryByGremlinLanguage(params) {
    const { value, gremlinServer } = params;

    const clientInstance = GremlinClass.getClientInstance(gremlinServer);

    const result = await clientInstance.submit(value);

    const edgeItemsMapping = {};
    const nodeItemsMapping = {};
    for (const value of result) {
      const { id, label, outV, inV, objects } = value;
      const baseicInfo = this.generatorGraphData(value);

      // Edge
      if (outV && inV) {
        // 存在 outV 及 inV，则说明是 Edge
        edgeItemsMapping[id] = {
          ...baseicInfo,
          edgeType: label,
          source: `${outV.id}`,
          target: `${inV.id}`,
        };

        const { id: outVID, label: outLabel } = outV;
        const { id: inVID, label: inLabel } = inV;
        // Source
        if (outVID) {
          const edgeOutObj = this.generatorGraphData(outV);
          nodeItemsMapping[outVID] = {
            ...edgeOutObj,
            nodeType: outLabel,
          };
        }

        // Target
        if (inVID) {
          const edgeInObj = this.generatorGraphData(inV);
          nodeItemsMapping[inVID] = {
            ...edgeInObj,
            nodeType: inLabel,
          };
        }
      } else if (objects) {
        // Path
        objects.forEach(o => {
          const { outV: pathOutV, inV: pathInV } = o;
          // 点边基础的信息
          const baseicObjInfo = this.generatorGraphData(o);
          if (pathOutV && pathInV) {
            // 边
            edgeItemsMapping[id] = {
              ...baseicObjInfo,
              edgeType: label,
              source: `${outV.id}`,
              target: `${inV.id}`,
            };

            const { id: pathOutVID, label: pathOutLabel } = pathOutV;
            const { id: pathInVID, label: pathInLabel } = pathInV;
            // Source
            if (pathOutVID) {
              const outObj = this.generatorGraphData(pathOutV);
              nodeItemsMapping[pathOutVID] = {
                ...outObj,
                nodeType: pathOutLabel,
              };
            }

            // Target
            if (pathInVID) {
              const inObj = this.generatorGraphData(pathInV);
              nodeItemsMapping[pathOutVID] = {
                ...inObj,
                nodeType: pathInLabel,
              };
            }
          } else {
            nodeItemsMapping[id] = {
              ...baseicObjInfo,
              nodeType: o.label,
            };
          }
        });
      } else {
        // Node
        nodeItemsMapping[id] = {
          ...baseicInfo,
          nodeType: label,
        };
      }
    }

    // 查询点的详情
    const nodeIds = Object.keys(nodeItemsMapping);
    const propertiesArr = await this.queryNodesProperties(clientInstance, nodeIds);

    // 构造 { id: properties } 对象
    for (let i = 0; i < nodeIds.length; i++) {
      nodeItemsMapping[nodeIds[i]] = {
        ...nodeItemsMapping[nodeIds[i]],
        data: propertiesArr[i],
      };
    }

    const nodes = [];
    const edges = [];

    // 将点边 map 转换成数组
    for (const nodeKey in nodeItemsMapping) {
      nodes.push(nodeItemsMapping[nodeKey]);
    }

    for (const edgeKey in edgeItemsMapping) {
      // TODO：临时删掉边的ID
      delete edgeItemsMapping[edgeKey].id;
      edges.push(edgeItemsMapping[edgeKey]);
    }

    return {
      success: true,
      code: 200,
      message: 'Gremlin 查询成功',
      data: {
        nodes,
        edges,
      },
    };
  }

  /**
   * 批量查询节点的属性
   * @param gremlinClientInsance Gremlin 客户端实例
   * @param nodeIds 节点ID数组
   */
  async queryNodesProperties(gremlinClientInsance, nodeIds) {
    const propertiesArr = [];
    if (!nodeIds || nodeIds.length === 0) {
      return propertiesArr;
    }

    for (const id of nodeIds) {
      const propertyGremlinSQL = `g.V(${id}).valueMap()`;
      const propertiesResult = await gremlinClientInsance.submit(propertyGremlinSQL);

      if (propertiesResult && propertiesResult.length === 1) {
        for (const properties of propertiesResult) {
          const entries = properties.entries();
          const currentObj = {};
          for (const current of entries) {
            const [key, value] = current;
            currentObj[key] = value.join(',');
          }
          propertiesArr.push(currentObj);
        }
      } else {
        propertiesArr.push({});
      }
    }
    return propertiesArr;
  }

  /**
   * 邻居查询
   * @param params
   */
  async queryNeighbors(params) {
    const { id = [], sep, gremlinServer } = params;
    let str = '';

    for (let i = 0; i < sep - 1; i++) {
      str += '.both()';
    }

    const clientInstance = GremlinClass.getClientInstance(gremlinServer);

    const gremlinSQL = `g.V(${id.join(',')})${str}.bothE().limit(100)`;
    const result = await clientInstance.submit(gremlinSQL);

    const edgeItemsMapping = {};
    const nodeItemsMapping = {};
    for (const value of result) {
      const { id: itemId, label, outV, inV } = value;
      const baseicInfo = this.generatorGraphData(value);

      // Edge
      if (outV && inV) {
        // 存在 outV 及 inV，则说明是 Edge
        edgeItemsMapping[itemId] = {
          ...baseicInfo,
          edgeType: label,
          source: `${outV.id}`,
          target: `${inV.id}`,
        };

        const { id: outVID, label: outLabel } = outV;
        const { id: inVID, label: inLabel } = inV;
        // Source
        if (outVID) {
          const edgeOutObj = this.generatorGraphData(outV);
          nodeItemsMapping[outVID] = {
            ...edgeOutObj,
            nodeType: outLabel,
          };
        }

        // Target
        if (inVID) {
          const edgeInObj = this.generatorGraphData(inV);
          nodeItemsMapping[inVID] = {
            ...edgeInObj,
            nodeType: inLabel,
          };
        }
      }
    }

    // 查询点的详情
    const nodeIds = Object.keys(nodeItemsMapping);

    const propertiesArr = await this.queryNodesProperties(clientInstance, nodeIds);

    // 构造 { id: properties } 对象
    for (let i = 0; i < nodeIds.length; i++) {
      nodeItemsMapping[nodeIds[i]] = {
        ...nodeItemsMapping[nodeIds[i]],
        data: propertiesArr[i],
      };
    }

    const nodes = [];
    const edges = [];

    // 将点边 map 转换成数组
    for (const nodeKey in nodeItemsMapping) {
      nodes.push(nodeItemsMapping[nodeKey]);
    }

    for (const edgeKey in edgeItemsMapping) {
      // TODO：临时删掉边的ID
      delete edgeItemsMapping[edgeKey].id;
      edges.push(edgeItemsMapping[edgeKey]);
    }

    return {
      success: true,
      code: 200,
      message: '邻居查询成功',
      data: {
        nodes,
        edges,
      },
    };
  }
}

export default Neo4jService;
