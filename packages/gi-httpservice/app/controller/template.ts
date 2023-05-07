import { Controller } from 'egg';

import { wrapperResult } from '../util';

class TemplateController extends Controller {
  // list template
  async list() {
    const { ctx } = this;
    try {
      const result = await ctx.service.graphinsight.template.list();
      wrapperResult(ctx, true, result);
    } catch (e) {
      console.error('List template failed: ', e);
      wrapperResult(ctx, false, []);
    }
  }

  // create template
  async create() {
    const { ctx } = this;
    const params = ctx.request.body;
    try {
      const result = await ctx.service.graphinsight.template.create(params);
      wrapperResult(ctx, true, result);
    } catch (e) {
      console.error('Create template failed: ', e);
      wrapperResult(ctx, false, {});
    }
  }

  // get template by id
  async getById() {
    const { ctx } = this;
    const { id } = ctx.params;
    try {
      const result = await ctx.service.graphinsight.template.getById(id);
      wrapperResult(ctx, true, result);
    } catch (e) {
      console.error('Get template by id failed: ', e);
      wrapperResult(ctx, false, {});
    }
  }

  // remove template by id
  async removeById() {
    const { ctx } = this;
    const params = ctx.request.body;
    try {
      const result = await ctx.service.graphinsight.template.removeById(params.id);
      wrapperResult(ctx, true, result);
    } catch (e) {
      console.error('Remove template by id failed: ', e);
      wrapperResult(ctx, false, false);
    }
  }

  // recycle a template
  async recycleById() {
    const { ctx } = this;
    const params = ctx.request.body;
    try {
      const result = await ctx.service.graphinsight.template.recycleById(params.id);
      wrapperResult(ctx, true, result);
    } catch (e) {
      console.error('Recycle template by id failed: ', e);
      wrapperResult(ctx, false, false);
    }
  }

  // recover a template
  async recoverById() {
    const { ctx } = this;
    const params = ctx.request.body;
    try {
      const result = await ctx.service.graphinsight.template.recoverById(params.id);
      wrapperResult(ctx, true, result);
    } catch (e) {
      console.error('Recover template by id failed: ', e);
      wrapperResult(ctx, false, false);
    }
  }

  // update template by id
  async updateById() {
    const { ctx } = this;
    const params = ctx.request.body;
    try {
      const result = await ctx.service.graphinsight.template.updateById(params);
      wrapperResult(ctx, true, result);
    } catch (e) {
      console.error('Update template by id failed: ', e);
      wrapperResult(ctx, false, false);
    }
  }
}

export default TemplateController;
