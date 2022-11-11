import { Controller } from 'egg';
import { responseData } from '../util';

class Neo4jController extends Controller {
  /**
   * 创建 GraphScope 实例
   */
  async connect() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.neo4j.connect(params);
    responseData(ctx, result);
  }

  async disConnect() {
    const { ctx } = this;
    const result = await ctx.service.neo4j.disConnect();
    responseData(ctx, result);
  }

  async queryByGraphLanguage() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.neo4j.queryByGraphLanguage(params);
    responseData(ctx, result);
  }

  /**
   * 邻居查询
   */
  async queryNeighbors() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.neo4j.queryNeighbors(params);
    responseData(ctx, result);
  }

  /**
   * 获取 Schema
   */
  async getSchema() {
    const { ctx } = this;

    const result = await ctx.service.neo4j.getGraphSchema();
    responseData(ctx, result);
  }
}

export default Neo4jController;
