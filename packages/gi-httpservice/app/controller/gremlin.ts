import { Controller } from 'egg';
import { responseData } from '../util';

class GremlinController extends Controller {
  async connect() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.gremlin.connect(params);
    responseData(ctx, result);
  }

  /**
   * Gremlin 查询
   */
  async query() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.gremlin.query(params);
    responseData(ctx, result);
  }
  async schema() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.gremlin.schema(params);
    responseData(ctx, result);
  }
}

export default GremlinController;
