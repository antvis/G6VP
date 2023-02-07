import { Controller } from 'egg';

import { wrapperResult } from '../util';

class DatasetController extends Controller {
  // find project case
  async findCase() {
    const { ctx } = this;
    const result = await ctx.service.graphinsight.project.findCase();
    wrapperResult(ctx, true, result);
  }

  // list project
  async list() {
    const { ctx } = this;
    try {
      const result = await ctx.service.graphinsight.dataset.list();
      wrapperResult(ctx, true, result);
    } catch (e) {
      console.error('List project failed: ', e);
      wrapperResult(ctx, false, []);
    }
  }

  // create project
  async create() {
    const { ctx } = this;
    const params = ctx.request.body;
    try {
      const result = await ctx.service.graphinsight.dataset.create(params);
      wrapperResult(ctx, true, result);
    } catch (e) {
      console.error('Create project failed: ', e);
      wrapperResult(ctx, false, {});
    }
  }

  // get project by id
  async getById() {
    const { ctx } = this;
    const { id } = ctx.params;
    try {
      const result = await ctx.service.graphinsight.dataset.getById(id);
      wrapperResult(ctx, true, result);
    } catch (e) {
      console.error('Get project by id failed: ', e);
      wrapperResult(ctx, false, {});
    }
  }

  // remove project by id
  async removeById() {
    const { ctx } = this;
    const params = ctx.request.body;
    try {
      const result = await ctx.service.graphinsight.project.removeProjectById(params.id);
      wrapperResult(ctx, true, result);
    } catch (e) {
      console.error('Remove project by id failed: ', e);
      wrapperResult(ctx, false, false);
    }
  }

  // update project by id
  async updateById() {
    const { ctx } = this;
    const params = ctx.request.body;
    try {
      const result = await ctx.service.graphinsight.project.updateProjectById(params);
      wrapperResult(ctx, true, result);
    } catch (e) {
      console.error('Update project by id failed: ', e);
      wrapperResult(ctx, false, false);
    }
  }
}

export default DatasetController;
