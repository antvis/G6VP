import { Controller } from 'egg';
import { responseData } from '../util';

class Neo4jController extends Controller {
  /**
   * 创建 GraphScope 实例
   */
  async connect() {
    const { ctx } = this;
    const params = ctx.request.body;
    const { uri, username, password } = params;
    const result = await ctx.service.neo4j.connect(uri, username, password);
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

    const result = await ctx.service.graphcompute.queryNeighbors(params);
    responseData(ctx, result);
  }

  /**
   * 获取 Schema
   */
  async getSchema() {
    const { ctx } = this;
    const { graphName } = ctx.query;

    const result = await ctx.service.graphcompute.queryGraphSchema(graphName);
    responseData(ctx, result);
  }

  /**
   * 获取元素的属性详情
   */
  async queryElementProperties() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.graphcompute.queryElementProperties(params);
    responseData(ctx, result);
  }
}

export default Neo4jController;
