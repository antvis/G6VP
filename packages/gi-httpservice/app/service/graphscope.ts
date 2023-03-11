// @ts-nocheck

import { Service } from 'egg';

import gremlin from 'gremlin_patch';
// @ts-ignore
import FormStream from 'formstream';
import fs from 'fs';
import { readGraphScopeConfig } from '../util';

interface ConnectProps {
  engineServerURL: string;
  httpServerURL: string;
  isStringType: boolean;
}

class GremlinClass {
  public instance = null;
  public clientInstance = null;
  public account;

  constructor(serverURL, isClient, account = {}) {
    if (!this.account || JSON.stringify(this.account) !== JSON.stringify(account)) {
      this.account = account;
      this.clientInstance = this.initGremlinClient(serverURL, account);
      return this.clientInstance;
    }
    if (isClient) {
      if (!this.clientInstance) {
        this.clientInstance = this.initGremlinClient(serverURL, account);
      }
      return this.clientInstance;
    }

    if (!this.instance) {
      this.instance = this.initGremlinInstance(serverURL);
    }
    return this.instance;
  }

  static getClientInstance(serverURL, account = {}) {
    const accountChange = !this.prototype.account || JSON.stringify(this.prototype.account) !== JSON.stringify(account);
    if (accountChange || !this.prototype.clientInstance) {
      this.prototype.clientInstance = new GremlinClass(serverURL, true, account);
    }
    return this.prototype.clientInstance;
  }

  /**
   * 初始化 Gremlin 实例，支持通过 API 方式调用
   * @param graphURL GraphScope 返回的 Gremlin 解析器的地址
   */
  initGremlinInstance(graphURL) {
    if (!graphURL) {
      throw new Error('Failed to init Gremlin Instance. 请先载图，然后再初始化 Gremlin 客户端');
    }
    const traversal = gremlin.process.AnonymousTraversalSource.traversal;
    const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
    const g = traversal().withRemote(new DriverRemoteConnection(graphURL));
    return g;
  }

  /**
   * 初始化 Gremlin 客户端，支持通过 Gremlin 语句查询
   */
  initGremlinClient(gremlinServer, account) {
    if (!gremlinServer) {
      throw new Error('Failed to init gremlin cliend. 请先载图，然后再初始化 Gremlin 客户端');
    }
    const authenticator = new gremlin.driver.auth.PlainTextSaslAuthenticator(account.username, account.password);
    const client = new gremlin.driver.Client(gremlinServer, {
      traversalSource: 'g',
      authenticator,
    });

    return client;
  }

  static destoryInstance() {
    this.prototype.account = undefined;
    this.prototype.instance = null;
    if (this.prototype.clientInstance) {
      this.prototype.clientInstance.close();
    }
    this.prototype.clientInstance = null;
  }
}


/**
 * 初始化 Gremlin 客户端，支持通过 Gremlin 语句查询
 * @param gremlinServer Endpoint of gremlin server
 * @param account Authenticator of gremlin server
 */
function initGremlinClient(gremlinServer: string, account = {"username": "", "password": ""}) {
  if (!("username" in account) || (!"password" in account)) {
    throw new Error('Authenticator failed: username or password not exists.');
  }
  const authenticator = new gremlin.driver.auth.PlainTextSaslAuthenticator(
    account.username, account.password
  );
  const client = new gremlin.driver.Client(gremlinServer, {
    traversalSource: 'g',
    authenticator,
  });

  console.log(`Gremlin client init on server ${gremlinServer}`);
  return client;
}

function closeGremlinClient(client): void {
 console.log("Gremlin client close");
 try { client.close(); } catch (error) {}
}


class GraphComputeService extends Service {
  async connectGraphScope(params: ConnectProps) {
    const { isStringType, ...others } = params;
    const oidType = isStringType ? 'string' : 'int64_t';
    const config = {
      ...others,
      oidType,
    };

    fs.writeFileSync(`${__dirname}/GRAPHSCOPE_CONFIG.json`, JSON.stringify(config, null, 2), 'utf-8');
    return {
      success: true,
      data: others,
      code: 200,
    };
  }

  generatorGraphData(value) {
    const { id, label, properties } = value;
    const obj = {};

    // 节点
    obj.id = `${id}`;
    obj.label = label;

    if (properties) {
      const elementProp = {};
      for (const key in properties) {
        const currentProp = properties[key];
        if (currentProp && currentProp[0]) {
          elementProp[`${key}`] = currentProp[0].value;
        }
      }
      obj.data = elementProp;
    }

    return obj;
  }

  /**
   * 通过 Gremlin 语句查询
   * @param gremlinSQL Gremlin 查询语句
   */
  async queryByGremlinLanguage(params) {
    const { value: gremlinCode, gremlinServer, graphScopeAccount } = params;
    console.log(`Execute query ${gremlinCode} on server ${gremlinServer}`)

    const client = initGremlinClient(gremlinServer, graphScopeAccount);

    let result = [];
    try {
      result = await client.submit(gremlinCode);
    } catch (error) {
      closeGremlinClient(client);
      return {
        success: false,
        code: 200,
        message: `Gremlin 查询失败。${error}`,
        data: {
          nodes: [],
          edges: [],
        },
      };
    }

    console.log("Get gremlin result: ", result);

    let mode = 'graph';
    const tableResult: any[] = [];

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
      } else if (`${id}` && label) {
        // Node
        nodeItemsMapping[id] = {
          ...baseicInfo,
          nodeType: label,
        };
      } else {
        // 属性
        mode = 'table';
        tableResult.push(value);
      }
    }

    if (mode === 'graph') {
      // 查询点的详情
      const nodeIds = Object.keys(nodeItemsMapping);
      const propertiesArr = await this.queryNodesProperties(client, nodeIds);

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
        edges.push(edgeItemsMapping[edgeKey]);
      }

      closeGremlinClient(client);
      return {
        success: true,
        code: 200,
        message: 'Gremlin 查询成功',
        mode,
        data: {
          nodes,
          edges,
          mode,
        },
      };
    }

    closeGremlinClient(client);
    return {
      success: true,
      code: 200,
      message: 'Gremlin 查询成功',
      mode,
      data: {
        nodes: [],
        edges: [],
        mode,
        tableResult,
      },
    };
  }

  // 分布式暂时不支持，但保留
  /**
   * 执行 GraphScope 图算法
   * @param params 算法参数
   */
  async execAlgorithm(params) {
    const {
      name,
      graphName,
      colomnName,
      maxRound = 10,
      limit = 100,
      sortById,
      vertex_label,
      edge_label,
      delta = 0.85,
      weight = 1,
      src,
      tolerance,
      k,
    } = params;

    // 根据不同算法类型，过滤不需要的参数
    const algorithmParams = {
      name,
      limit,
      sortById,
      vertex_label,
      edge_label,
      graph_name: graphName,
    };
    if (name === 'pagerank') {
      algorithmParams.delta = delta;
    }

    if (name === 'pagerank' || name === 'lpa' || name === 'eigenvector_centrality') {
      algorithmParams.max_round = maxRound;
    }

    if (name === 'eigenvector_centrality') {
      algorithmParams.tolerance = tolerance;
    }

    if (name === 'sssp') {
      algorithmParams.weight = weight;
      algorithmParams.src = src;
    }

    if (name === 'k_core') {
      algorithmParams.k = k;
    }

    console.log('执行图算法参数', algorithmParams);
    const { engineServerURL } = readGraphScopeConfig();

    const result = await this.ctx.curl(`${engineServerURL}/api/graphservice/algorithm`, {
      method: 'GET',
      data: algorithmParams,
      timeout: [10000, 30000],
      dataType: 'json',
    });

    if (!result || !result.data) {
      return result;
    }

    const { result: algorithmResult, code, success, message, context_name } = result.data;

    // 算法执行失败
    if (!success) {
      return result.data;
    }

    const { id: dataIds, result: dataResult } = JSON.parse(algorithmResult);
    const algorithmArr = [];
    for (const key in dataIds) {
      const nodeId = dataIds[key];
      const nodeValue = dataResult[key];
      algorithmArr.push({
        id: nodeId,
        value: nodeValue,
      });
    }

    // 算法执行成功后，将结果写入到数据中，并且更新 Project 中 expandInfo 字段
    const addColumnResult = await this.addColumnToData({
      contextName: context_name,
      colomnName,
      needGremlin: true,
      graphName,
    });

    if (!addColumnResult || !addColumnResult.success) {
      return {};
    }
    const { graph_name, graph_url } = addColumnResult;

    // 算法执行成功，返回结果
    return {
      code,
      success,
      message,
      graphName: graph_name,
      gremlinClientURL: graph_url,
      data: algorithmArr,
    };
  }

  /**
   * 批量查询节点的属性
   * @param client Gremlin 客户端
   * @param nodeIds 节点ID数组
   */
  async queryNodesProperties(client, nodeIds) {
    const propertiesArr = [];
    if (!nodeIds || nodeIds.length === 0) {
      return propertiesArr;
    }

    for (const id of nodeIds) {
      const propertyGremlinSQL = `g.V(${id}).valueMap()`;
      const propertiesResult = await client.submit(propertyGremlinSQL);

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
    const { id = [], sep, gremlinServer, graphScopeAccount } = params;
    let str = '';

    for (let i = 0; i < sep - 1; i++) {
      str += '.both()';
    }

    const client = initGremlinClient(gremlinServer, graphScopeAccount);

    const gremlinSQL = `g.V(${id.join(',')})${str}.bothE().limit(100)`;
    const result = await client.submit(gremlinSQL);

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

    const propertiesArr = await this.queryNodesProperties(client, nodeIds);

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
      delete edgeItemsMapping[edgeKey].id;
      edges.push(edgeItemsMapping[edgeKey]);
    }

    closeGremlinClient(client);

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

  // TODO：queryNodesProperties 统一
  /**
   * 查询节点属性详情
   * @param params 节点 ID
   */
  async queryElementProperties(params) {
    const { id = [], gremlinServer, graphScopeAccount } = params;

    const client = initGremlinClient(gremlinServer, graphScopeAccount);

    // 查询属性的 Gremlin 已经
    const gremlinSQL = `g.V(${id.join(',')}).valueMap()`;

    console.log('查询语句', gremlinSQL);
    const result = await client.submit(gremlinSQL);
    const propertiesArr = [];
    console.log('查询属性值结果', result);

    for (const properties of result) {
      const entries = properties.entries();
      const currentObj = {};
      for (const current of entries) {
        const [key, value] = current;
        currentObj[key] = value.join(',');
      }
      propertiesArr.push(currentObj);
    }

    // 构造 { id: properties } 对象
    const resultObj = {};
    for (let i = 0; i < id.length; i++) {
      resultObj[id[i]] = propertiesArr[i];
    }

    closeGremlinClient(client);
    return {
      success: true,
      code: 200,
      message: '属性查询成功',
      data: resultObj,
    };
  }

  /**
   * 执行算法成功后，将算法结果写到数据指定字段上
   * @param params
   */
  async addColumnToData(params) {
    const { engineServerURL } = readGraphScopeConfig();

    const { graphName, contextName, colomnName, needGremlin } = params;
    const result = await this.ctx.curl(`${engineServerURL}/api/graphservice/addColumn`, {
      method: 'GET',
      data: {
        graph_name: graphName,
        context_name: contextName,
        column_name: colomnName,
        need_gremlin: needGremlin,
      },
      timeout: [10000, 30000],
      dataType: 'json',
    });

    if (!result || !result.data) {
      return result;
    }

    return result.data;
  }

  /**
   * 获取指定引擎的子图列表
   * @param params
   * @returns
   */
  async listSubgraph(params) {
    const { engineServerURL } = readGraphScopeConfig();

    const result = await this.ctx.curl(`${engineServerURL}/api/v1/graph`, {
      method: 'GET',
      data: {
        // @ts-ignore
        // graph_name: graphName,
      },
      dataType: 'json',
    });

    if (!result || !result.data) {
      return result;
    }

    return {
      success: true,
      code: 200,
      message: '子图列表查询成功',
      data: result.data.data,
    };
  }
}

export default GraphComputeService;
