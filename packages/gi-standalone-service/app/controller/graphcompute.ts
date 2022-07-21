import { Controller } from 'egg';
import { responseData } from '../util';

class GraphComputeController extends Controller {
  /**
   * 创建 GraphScope 实例
   */
  async createGraphScopeInstance() {
    const { ctx } = this;
    const params = ctx.request.body;
    const { mode } = params;
    const result = ctx.service.graphcompute.createGraphScopeInstance(mode);
    responseData(ctx, result);
  }

  /**
   * 关闭 GraphScope 引擎实例
   */
  async closeGraphScopeInstance() {
    const { ctx } = this;
    const { instanceId, mode } = ctx.query;

    const result = ctx.service.graphcompute.closeGraphScopeInstance(instanceId, mode);
    responseData(ctx, result);
  }

  /**
   * 将本地的文件上传到服务器上面
   */
  async uploadFile() {
    const { ctx } = this;
    const params = ctx.request.body;
    const uploadParams = {
      instanceId: params.instance_id,
      file: ctx.request.files[0],
    };
    const result = ctx.service.graphcompute.uploadFileToService(uploadParams);
    responseData(ctx, result);
  }

  /**
   * 将数据载入到 GraphScope 引擎中
   */
  async loadDataToGraphScope() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = ctx.service.graphcompute.loadDataToGraphScope(params);
    responseData(ctx, result);
  }

  /**
   * Gremlin 查询
   */
  async gremlinQuery() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = ctx.service.graphcompute.queryByGremlinLanguage(params);
    responseData(ctx, result);
  }

  /**
   * 邻居查询
   */
  async queryNeighbors() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = ctx.service.graphcompute.queryNeighbors(params);
    responseData(ctx, result);
  }

  /**
   * 获取 Schema
   */
  async getSchema() {
    const { ctx } = this;
    const { projectId, mode = '1' } = ctx.query;

    const result = ctx.service.graphcompute.queryGraphSchema(projectId, parseInt(mode, 10));
    responseData(ctx, result);
  }

  /**
   * 获取 GraphScope 实例列表
   */
  async getInstance() {
    const { ctx } = this;
    const result = ctx.service.graphcompute.getGraphScopeInstance();
    responseData(ctx, result);
  }

  /**
   * 获取元素的属性详情
   */
  async queryElementProperties() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = ctx.service.graphcompute.queryElementProperties(params);
    responseData(ctx, result);
  }
}

export default GraphComputeController;
