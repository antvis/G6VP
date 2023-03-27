import { Controller } from 'egg';
import { responseData } from '../util';

class HugeGraphController extends Controller {
  /**
   * 创建 GraphScope 实例
   */
  async connect() {
    const { ctx } = this;
    const params = ctx.request.body;
    console.log('hugegraphcontroller', params);
    const result = await ctx.service.hugegraph.connect(params);

    if (!result || !result.data) {
      return {
        success: false,
        code: 200,
        message: `子图列表查询失败：${result}`,
      };
    }

    return {
      success: true,
      code: 200,
      message: '子图列表查询成功',
      data: result.data.data,
    };
    responseData(ctx, result);
  }

  async disConnect() {
    const { ctx } = this;
    const result = await ctx.service.hugegraph.disConnect();
    responseData(ctx, result);
  }

  async queryByGraphLanguage() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.hugegraph.queryByGraphLanguage(params);
    responseData(ctx, result);
  }

  /**
   * 邻居查询
   */
  async queryNeighbors() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.hugegraph.queryNeighbors(params);
    responseData(ctx, result);
  }

  /**
   * 获取 Schema
   */
  async getSchema() {
    const { ctx } = this;

    const result = await ctx.service.hugegraph.getGraphSchema();
    responseData(ctx, result);
  }
}

export default HugeGraphController;
