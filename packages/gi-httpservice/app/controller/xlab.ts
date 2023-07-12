import { Controller } from 'egg';
import { responseData } from '../util';

class TuGraphController extends Controller {
  /**
   * 获取元素的属性详情
   */
  async queryElementProperties() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.xlab.queryElementProperties(params);
    responseData(ctx, result);
  }

  async fuzzyQuery() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.xlab.fuzzyQuery(params);
    responseData(ctx, result);
  }
}

export default TuGraphController;
