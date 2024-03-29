import { Controller } from 'egg';

import { wrapperResult } from '../util';

class GraphInsightController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('index.html');
  }
  // find project case
  async findCase() {
    const { ctx } = this;
    const result = await ctx.service.graphinsight.project.findCase();
    wrapperResult(ctx, true, result);
  }

  // list project
  async listProject() {
    const { ctx } = this;
    try {
      const result = await ctx.service.graphinsight.project.listProject();
      wrapperResult(ctx, true, result);
    } catch (e) {
      console.error('List project failed: ', e);
      wrapperResult(ctx, false, []);
    }
  }

  // create project
  async createProject() {
    const { ctx } = this;
    const params = ctx.request.body;
    try {
      // projectID
      const result = await ctx.service.graphinsight.project.createProject(params);
      wrapperResult(ctx, true, result);
    } catch (e) {
      console.error('Create project failed: ', e);
      wrapperResult(ctx, false, {});
    }
  }

  // get project by id
  async getProjectById() {
    const { ctx } = this;
    const projectID = ctx.params.id;
    try {
      const result = await ctx.service.graphinsight.project.getProjectById(projectID);
      wrapperResult(ctx, true, result);
    } catch (e) {
      console.error('Get project by id failed: ', e);
      wrapperResult(ctx, false, {});
    }
  }

  // remove project by id
  async removeProjectById() {
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
  async updateProjectById() {
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

export default GraphInsightController;
