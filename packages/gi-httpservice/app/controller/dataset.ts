import { Controller } from 'egg';

import { wrapperResult } from '../util';

class DatasetController extends Controller {
  // find dataset case
  async findCase() {
    const { ctx } = this;
    const result = await ctx.service.graphinsight.dataset.findCase();
    wrapperResult(ctx, true, result);
  }

  // list dataset
  async list() {
    const { ctx } = this;
    try {
      const result = await ctx.service.graphinsight.dataset.list();
      wrapperResult(ctx, true, result);
    } catch (e) {
      console.error('List dataset failed: ', e);
      wrapperResult(ctx, false, []);
    }
  }

  // create dataset
  async create() {
    const { ctx } = this;
    const params = ctx.request.body;
    try {
      const result = await ctx.service.graphinsight.dataset.create(params);
      wrapperResult(ctx, true, result);
    } catch (e) {
      console.error('Create dataset failed: ', e);
      wrapperResult(ctx, false, {});
    }
  }

  // get dataset by id
  async getById() {
    const { ctx } = this;
    const { id } = ctx.params;
    try {
      const result = await ctx.service.graphinsight.dataset.getById(id);
      wrapperResult(ctx, true, result);
    } catch (e) {
      console.error('Get dataset by id failed: ', e);
      wrapperResult(ctx, false, {});
    }
  }

  // remove dataset by id
  async removeById() {
    const { ctx } = this;
    const params = ctx.request.body;
    try {
      const result = await ctx.service.graphinsight.dataset.removeById(params.id);
      wrapperResult(ctx, true, result);
    } catch (e) {
      console.error('Remove dataset by id failed: ', e);
      wrapperResult(ctx, false, false);
    }
  }

  // update dataset by id
  async updateById() {
    const { ctx } = this;
    const params = ctx.request.body;
    try {
      const result = await ctx.service.graphinsight.dataset.updateById(params);
      wrapperResult(ctx, true, result);
    } catch (e) {
      console.error('Update dataset by id failed: ', e);
      wrapperResult(ctx, false, false);
    }
  }
}

export default DatasetController;
