/**
 * 数据查询，主要包括以下几部分内容：
 * 1. 查询节点
 * 2. 查询边
 * 3. 查询路径
 * 4. 查询点边属性
 * 5. 邻居查询
 */

import { Service } from 'egg';
import { INeighborsParams, ILanguageQueryParams } from './interface'
import { EngineServerURL } from './constant'

class TuGraphQueryService extends Service {

	/**
	 * 根据节点 ID 查询
	 * @param graphName 子图名称
	 * @param vertexId 节点 ID
	 */
	async queryNodeById(graphName: string, vertexId: string) {
		const cypherLanguage = `MATCH (n) WHERE id(n)=${vertexId} RETURN n`
		const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
				// 从请求头中获取认证信息
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: cypherLanguage,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    if (result.status !== 200) {
      return result.data;
    }

		const mockData = [
			{
				"n": {
					"identity": 12,
					"label": "person",
					"properties": {
						"born": 1965,
						"id": 14,
						"name": "Lana Wachowski",
						"poster_image": "https://image.tmdb.org/t/p/w185/8mbcXfOpmOiDLk6ZWfMsBGHEnet.jpg"
					}
				}
			}
		]

		const nodes = []
		for(const vertex of mockData) {
			for(const key in vertex) {
				const current = vertex[key]
				const { identity, ...others } = current
				const has = nodes.find(d => d.id === identity)
				if (!has) {
					nodes.push({
						...others,
						id: identity
					})
				}
			}
		}

		return {
			success: true,
			nodes
		}
	}

  /**
   * 使用 Cypher 语句查询
   * @param params
   */
  async queryByGraphLanguage(params: ILanguageQueryParams) {
    const { graphName = '', value } = params;

    const responseData = await this.service.openpiece.query.querySubGraphByCypher(value, graphName);
    return {
      data: responseData,
      code: 200,
      success: true,
    };
  }

  /**
   * 邻居查询
   * @param params
   */
  async queryNeighbors(params: INeighborsParams) {
    const { ids, graphName, sep = 1 } = params;
    let cypher = `match(n)-[*..${sep}]-(m) WHERE id(n)=${ids[0]} RETURN n, m LIMIT 100`;

    if (ids.length > 1) {
      // 查询两度关系，需要先查询节点，再查询子图
      cypher = `match(n)-[*..${sep}]-(m) WHERE id(n) in [${ids}] RETURN n, m LIMIT 200`;
    }

    const responseData = await this.service.openpiece.query.querySubGraphByCypher(cypher, graphName);
    return {
      data: responseData,
      code: 200,
      success: true,
    };
  }
}

export default TuGraphQueryService;
