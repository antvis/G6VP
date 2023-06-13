import { Service } from 'egg';
import gremlin from 'gremlin';

interface QueryParams {
  engineServerURL: string;
  httpServerURL: string;
  value: string;
  limit: number;
}

class GremlinService extends Service {
  g: gremlin.process.GraphTraversal | undefined;
  client: gremlin.driver.Client;
  async connect(params: QueryParams) {
    try {
      const { engineServerURL } = params;
      const isHost = engineServerURL.split('//').length === 1;
      const url = isHost ? engineServerURL : engineServerURL[1];
      console.log(`ws://${url}/gremlin`);
      this.client = new gremlin.driver.Client(`ws://${engineServerURL}/gremlin`, {
        traversalSource: 'g',
        mimeType: 'application/json',
      });
      return {
        success: true,
        data: true,
        code: 200,
      };
    } catch (error) {
      return {
        success: false,
        data: error,
        code: 200,
      };
    }
  }
  async query(params: QueryParams) {
    console.log('queryParams', params);
    const { limit = 300, value } = params || {};
    if (!this.client) {
      await this.connect(params);
    }
    if (this.client) {
      try {
        const queryString = this.makeQuery(value, limit);

        const result = await this.client.submit(queryString, {});
        // @TODO 对边的处理
        const nodes = this.nodesToJson(result._items);

        console.log('queryString', queryString, 'nodes', nodes);
        return {
          data: {
            nodes,
            edges: [],
          },
          success: true,
          code: 200,
        };
      } catch (error) {
        return {
          data: {},
          success: false,
          code: 500,
        };
      }
    }
    return {
      data: {},
      success: false,
      code: 500,
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async schema(_params: QueryParams) {
    return {
      success: false,
      data: {
        nodes: [],
        edges: [],
      },
      code: 200,
    };
  }

  makeQuery(query, nodeLimit) {
    const nodeLimitQuery = !isNaN(nodeLimit) && Number(nodeLimit) > 0 ? `.limit(${nodeLimit})` : '';
    return `${query}${nodeLimitQuery}.dedup().as('node').project('id', 'label', 'properties', 'edges').by(__.id()).by(__.label()).by(__.valueMap().by(__.unfold())).by(__.outE().project('id', 'from', 'to', 'label', 'properties').by(__.id()).by(__.select('node').id()).by(__.inV().id()).by(__.label()).by(__.valueMap().by(__.unfold())).fold())`;
  }
  edgesToJson(edgeList) {
    return edgeList.map(edge => ({
      id: typeof edge.get('id') !== 'string' ? JSON.stringify(edge.get('id')) : edge.get('id'),
      from: edge.get('from'),
      to: edge.get('to'),
      label: edge.get('label'),
      properties: this.mapToObj(edge.get('properties')),
    }));
  }
  nodesToJson(nodeList) {
    return nodeList.map(node => {
      const nodeType = node.get('label');
      return {
        id: node.get('id').toString(),
        nodeType,
        nodeTypeKeyFromProperties: 'nodeType',
        properties: {
          nodeType,
          ...this.mapToObj(node.get('properties')),
        },
        edges: this.edgesToJson(node.get('edges')),
      };
    });
  }
  mapToObj(inputMap) {
    const obj = {};
    inputMap.forEach((value, key) => {
      obj[key] = value;
    });

    return obj;
  }
}

export default GremlinService;
