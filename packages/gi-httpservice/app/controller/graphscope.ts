import { Controller } from 'egg';
import { responseData } from '../util';

class GraphScopeController extends Controller {
  async connectGraphScope() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.graphscope.connectGraphScope(params);
    responseData(ctx, result);
  }

  /**
   * Gremlin 查询
   */
  async gremlinQuery() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.graphscope.queryByGremlinLanguage(params);
    responseData(ctx, result);
  }

  /**
   * 邻居查询
   */
  async queryNeighbors() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.graphscope.queryNeighbors(params);
    responseData(ctx, result);
  }

  /**
   * 获取元素的属性详情
   */
  async queryElementProperties() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.graphscope.queryElementProperties(params);
    responseData(ctx, result);
  }

  /**
   * 执行图算法
   */
  async execAlgorithm() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.graphscope.execAlgorithm(params);
    responseData(ctx, result);
  }

  /**
   * 获取子图列表
   */
  async listSubgraph() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.graphscope.listSubgraph(params);
    responseData(ctx, result);
  }
}

export default GraphScopeController;
