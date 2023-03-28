import { Controller } from 'egg';
import { responseData } from '../util';

class HugeGraphController extends Controller {
  /**
   * 列出数据库中全部的图
   * @returns
   */
  async listGraphs() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.hugegraph.listGraphs(params);
    responseData(ctx, result);

    if (!result || !result.data) {
      return {
        success: false,
        code: 200,
        message: `图列表查询失败：${result}`,
      };
    }

    return {
      success: true,
      code: 200,
      message: '图列表查询成功',
      data: result.data,
    };
  }
  /**
   * 获取 Schema
   */
  async getSchema() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.hugegraph.getGraphSchema(params);
    responseData(ctx, result);
  }
  /**
   * 使用 gremlin 查询指定 graph 的数据
   */
  async gremlin() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.hugegraph.queryByGremlin(params);
    responseData(ctx, result);
    if (!result || !result.data) {
      return {
        success: false,
        code: 200,
        message: `Gremlin 查询失败：${result}`,
      };
    }

    return {
      success: true,
      code: 200,
      message: 'Gremlin 查询成功',
      data: result.data,
    };
  }

  /**
   * 邻居查询
   */
  async queryNeighbors() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.hugegraph.queryNeighbors(params);
    responseData(ctx, result);

    if (!result || !result.data) {
      return {
        success: false,
        code: 200,
        message: `扩散查询失败：${result}`,
      };
    }

    return {
      success: true,
      code: 200,
      message: '扩散查询成功',
      data: result.data,
    };
  }

  /**
   * 元素详情查询
   */
  async queryOneElementProperties() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.hugegraph.queryOneElementProperties(params);
    responseData(ctx, result);

    if (!result || !result.data) {
      return {
        success: false,
        code: 200,
        message: `详情查询失败：${result}`,
      };
    }

    return {
      success: true,
      code: 200,
      message: '详情查询成功',
      data: result.data,
    };
  }
}

export default HugeGraphController;
