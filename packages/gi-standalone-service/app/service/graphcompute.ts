// @ts-nocheck

import { Service } from 'egg';

import gremlin from 'gremlin_patch';
// @ts-ignore
import fs from 'fs';
import FormStream from 'formstream';
import { GRAPHSCOPE_SERVICE_URL } from '../util';

class GremlinClass {
  public instance = null;
  public clientInstance = null;

  constructor(serverURL, isClient) {
    if (isClient) {
      if (!this.clientInstance) {
        this.clientInstance = this.initGremlinClient(serverURL);
      }
      return this.clientInstance;
    }

    if (!this.instance) {
      this.instance = this.initGremlinInstance(serverURL);
    }
    return this.instance;
  }

  static getInstance(serverURL) {
    if (!this.prototype.instance) {
      this.prototype.instance = new GremlinClass(serverURL, false);
    }
    return this.prototype.instance;
  }

  static getClientInstance(serverURL) {
    if (!this.prototype.clientInstance) {
      this.prototype.clientInstance = new GremlinClass(serverURL, true);
    }
    return this.prototype.clientInstance;
  }

  /**
   * 初始化 Gremlin 实例，支持通过 API 方式调用
   * @param graphURL GraphScope 返回的 Gremlin 解析器的地址
   */
  initGremlinInstance(graphURL) {
    if (!graphURL) {
      throw new Error('请先载图，然后再初始化 Gremlin 客户端');
    }
    const traversal = gremlin.process.AnonymousTraversalSource.traversal;
    const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
    const g = traversal().withRemote(new DriverRemoteConnection(graphURL));
    return g;
  }

  /**
   * 初始化 Gremlin 客户端，支持通过 Gremlin 语句查询
   */
  initGremlinClient(gremlinServer) {
    if (!gremlinServer) {
      throw new Error('请先载图，然后再初始化 Gremlin 客户端');
    }

    const client = new gremlin.driver.Client(gremlinServer, {
      traversalSource: 'g',
    });

    return client;
  }

  static destoryInstance() {
    this.prototype.instance = null;
    this.prototype.clientInstance = null;
  }
}

class GraphComputeService extends Service {
  /**
   * 创建 GraphScope 实例
   */
  async createGraphScopeInstance() {
    const result = await this.ctx.curl(`${GRAPHSCOPE_SERVICE_URL}/api/graphservice/createInstance`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      data: {
        num_workers: 2,
        vineyard_shared_mem: '4Gi',
      },
      timeout: [15000, 300000],
      dataType: 'json',
    });

    console.log('创建session成功', result);
    if (!result || !result.data) {
      return null;
    }

    const { instance_id, success, code, message } = result.data;

    return {
      success,
      code,
      message,
      data: {
        instanceId: instance_id,
      },
    };
  }

  /**
   * 关闭创建的 GraphScope 实例
   */
  async closeGraphScopeInstance(instanceId) {
    const result = await this.ctx.curl(`${GRAPHSCOPE_SERVICE_URL}/api/graphservice/closeInstance`, {
      method: 'GET',
      data: {
        instance_id: instanceId,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });
    // 关闭 GS 引擎后，销毁 Gremlin 查询实例
    GremlinClass.destoryInstance();
    return result.data;
  }

  /**
   * 将数据加载到 GraphScope 引擎中
   * @param params
   */
  async loadDataToGraphScope(params) {
    console.log('开始载图', params);
    const result = await this.ctx.curl(`${GRAPHSCOPE_SERVICE_URL}/api/graphservice/loadData`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      data: params,
      timeout: [5000, 60000],
      dataType: 'json',
    });

    console.log('载图完成', result);
    if (!result || !result.data || !result.data.success) {
      return result.data;
    }

    const { graph_name, graph_url, success, code, hostname, hostip, message } = result.data;
    // 更新 Gremlin server，暂时固定写死
    const graphURL = graph_url.replace(/(?<=\/\/)([0-9\.]*)(?=\:)/g, hostip || '47.242.172.5');

    return {
      success,
      code,
      message,
      data: {
        graphName: graph_name,
        graphURL,
        hostName: hostname,
        hostIp: hostip,
      },
    };
  }

  /**
   * 将加载到 GraphScope 中的数据卸载掉
   */
  async unloadDataFromGraphScope(graphName) {
    const result = await this.ctx.curl(`${GRAPHSCOPE_SERVICE_URL}/api/graphservice/unloadData`, {
      method: 'GET',
      data: {
        graph_name: graphName,
      },
      dataType: 'json',
    });

    return result.data;
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

  async closeGraphInstance(params) {
    const { instanceId, graphName } = params;

    //step1: unload graph data
    if (graphName) {
      const unloadDataResult = await this.unloadDataFromGraphScope(graphName);
      console.log('卸载数据', unloadDataResult);
      if (!unloadDataResult || !unloadDataResult.success) {
        return {
          success: false,
          errorMsg: 'unload graphData failed!',
        };
      }
    }

    //step2: close graphscope instance
    if (instanceId) {
      const closeResult = await this.closeGraphScopeInstance(instanceId);
      console.log('关闭实例', closeResult);
      if (!closeResult || !closeResult.success) {
        return {
          success: false,
          errorMsg: 'close graphscope failed!',
        };
      }
    }

    return {
      success: true,
      message: 'unload graphData and close graphscope success!',
    };
  }

  /**
   * 上传文件到部署 GraphScope 的服务器上
   * @param params
   */
  async uploadFileToService(params) {
    const { file, instanceId } = params;

    if (!file) {
      return;
    }

    const { filepath, filename } = file;
    const fileContent = fs.readFileSync(filepath, {
      encoding: 'utf8',
    });

    console.log('上传文件参数', file);
    const form = new FormStream();
    form.buffer('file', new Buffer(fileContent, 'utf8'), filename);
    form.field('instance_id', instanceId);

    const result = await this.ctx.curl(`${GRAPHSCOPE_SERVICE_URL}/api/graphservice/uploadFile`, {
      method: 'POST',
      headers: form.headers(),
      stream: form,
      timeout: [10000, 30000],
      dataType: 'json',
    });

    if (!result || !result.data) {
      return result;
    }

    const { success, code, message, records } = result.data;
    return {
      success,
      code,
      message,
      data: {
        fileName: Object.keys(JSON.parse(records))[0],
        // @ts-ignore
        filePath: Object.values(JSON.parse(records))[0],
      },
    };
  }

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
    let algorithmParams = {
      name,
      limit,
      sortById,
      vertex_label,
      edge_label,
      graph_name: graphName,
    };
    if (name === 'pagerank') {
      algorithmParams['delta'] = delta;
    }

    if (name === 'pagerank' || name === 'lpa' || name === 'eigenvector_centrality') {
      algorithmParams['max_round'] = maxRound;
    }

    if (name === 'eigenvector_centrality') {
      algorithmParams['tolerance'] = tolerance;
    }

    if (name === 'sssp') {
      algorithmParams['weight'] = weight;
      algorithmParams['src'] = src;
    }

    if (name === 'k_core') {
      algorithmParams['k'] = k;
    }

    console.log('执行图算法参数', algorithmParams);

    const result = await this.ctx.curl(`${GRAPHSCOPE_SERVICE_URL}/api/graphservice/algorithm`, {
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

    console.log('addColumnResult', addColumnResult);
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

  /**
   * 查询节点属性详情
   * @param params 节点 ID
   */
  async queryElementProperties(params) {
    const { id = [], gremlinServer } = params;

    const clientInstance = GremlinClass.getClientInstance(gremlinServer);

    // 查询属性的 Gremlin 已经
    const gremlinSQL = `g.V(${id.join(',')}).valueMap()`;

    console.log('查询语句', gremlinSQL);
    const result = await clientInstance.submit(gremlinSQL);
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

    return {
      success: true,
      code: 200,
      message: '属性查询成功',
      data: resultObj,
    };
  }

  /**
   * 统计元素数量
   */
  async statisticsElementCount(params) {
    const { id, sep, rules, gremlinServer } = params;
    console.log('rules', rules);
    let str = '';

    for (let i = 0; i < sep - 1; i++) {
      str += '.both()';
    }

    const clientInstance = GremlinClass.getClientInstance(gremlinServer);

    // TODO 暂时还没有添加过滤规则
    const gremlinSQL = `g.V(${id})${str}.bothE().count()`;
    const result = await clientInstance.submit(gremlinSQL);
    if (!result) {
      return result;
    }

    return {
      success: true,
      code: 200,
      data: result,
    };
  }

  /**
   * 根据 GraphName 查询 Schema 数据
   */
  async queryGraphSchema(graphName) {
    const result = await this.ctx.curl(`${GRAPHSCOPE_SERVICE_URL}/api/graphservice/graphSchema`, {
      method: 'GET',
      data: {
        // @ts-ignore
        graph_name: graphName,
      },
      dataType: 'json',
    });

    if (!result || !result.data) {
      return result;
    }

    const { code, success, message, result: schemaResult } = result.data;
    if (!success) {
      return result.data;
    }

    const gsGchemaData = JSON.parse(schemaResult);
    const { vertices, edges } = gsGchemaData;
    const nodeData = vertices.map(v => {
      const { label, properties } = v;
      // 将 properties 转换为 key/value 的形式
      const current = {};
      for (const p of properties) {
        current[p.name] = p.type;
      }
      return {
        nodeType: label,
        nodeTypeKeyFromProperties: 'nodeType',
        properties: current,
      };
    });

    const edgeData = edges.map(edge => {
      const { label, properties, relations = [] } = edge;
      const { src_label, dst_label } = relations[0] || ({} as any);
      const current = {};
      for (const p of properties) {
        current[p.name] = p.type;
      }

      return {
        edgeType: label,
        sourceNodeType: src_label,
        targetNodeType: dst_label,
        nodeTypeKeyFromProperties: 'edgeType',
        properties: current,
      };
    });

    return {
      code,
      success,
      message,
      data: {
        nodes: nodeData,
        edges: edgeData,
      },
    };
  }

  /**
   * 执行算法成功后，将算法结果写到数据指定字段上
   * @param params
   */
  async addColumnToData(params) {
    const { graphName, contextName, colomnName, needGremlin } = params;
    const result = await this.ctx.curl(`${GRAPHSCOPE_SERVICE_URL}/api/graphservice/addColumn`, {
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
   * 将 JSON 描述的 pattern 转换为 Gremlin 语句
   * @param value JSON 值
   */
  async jsonToGremlin(value) {
    const result = await this.ctx.curl(`${GRAPHSCOPE_SERVICE_URL}/api/graphservice/jsonToGremlin`, {
      method: 'GET',
      data: {
        json_str: value,
      },
      timeout: [10000, 30000],
      dataType: 'json',
    });

    if (!result || !result.data) {
      return result;
    }

    console.log('jsonToGremlin', result);

    return result.data;
  }

  async getGraphScopeInstance() {
    const result = await this.ctx.curl(`${GRAPHSCOPE_SERVICE_URL}/api/graphservice/getInstance`, {
      method: 'GET',
      timeout: [10000, 30000],
      dataType: 'json',
    });

    if (!result || !result.data) {
      return result;
    }

    console.log('getGraphScopeInstance', result);

    return result.data;
  }
}

export default GraphComputeService;
