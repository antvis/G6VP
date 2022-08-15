import { Controller } from 'egg';
import { responseData } from '../util';

class Neo4jController extends Controller {
  /**
   * 创建 GraphScope 实例
   */
  async connect() {
    const { ctx } = this;
    const params = ctx.request.body;
    const { uri, username, password } = params;
    const result = await ctx.service.neo4j.connect(uri, username, password);
    responseData(ctx, result);
  }

  async disConnect() {
    const { ctx } = this;
    const result = await ctx.service.neo4j.disConnect();
    responseData(ctx, result);
  }

  async queryByGraphLanguage() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.neo4j.queryByGraphLanguage(params);
    responseData(ctx, result);
  }

  /**
   * 关闭 GraphScope 引擎实例
   */
  async closeGraphScopeInstance() {
    const { ctx } = this;
    const { instanceId } = ctx.query;

    const result = await ctx.service.graphcompute.closeGraphScopeInstance(instanceId);
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
    const result = await ctx.service.graphcompute.uploadFileToService(uploadParams);
    responseData(ctx, result);
  }

  /**
   * 将数据载入到 GraphScope 引擎中
   */
  async loadDataToGraphScope() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.graphcompute.loadDataToGraphScope(params);
    responseData(ctx, result);
  }

  /**
   * Gremlin 查询
   */
  async gremlinQuery() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.graphcompute.queryByGremlinLanguage(params);
    responseData(ctx, result);
  }

  /**
   * 邻居查询
   */
  async queryNeighbors() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.graphcompute.queryNeighbors(params);
    responseData(ctx, result);
  }

  /**
   * 获取 Schema
   */
  async getSchema() {
    const { ctx } = this;
    const { graphName } = ctx.query;

    const result = await ctx.service.graphcompute.queryGraphSchema(graphName);
    responseData(ctx, result);
  }

  /**
   * 获取 GraphScope 实例列表
   */
  async getInstance() {
    const { ctx } = this;
    const result = await ctx.service.graphcompute.getGraphScopeInstance();
    responseData(ctx, result);
  }

  /**
   * 获取元素的属性详情
   */
  async queryElementProperties() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.graphcompute.queryElementProperties(params);
    responseData(ctx, result);
  }

  /**
   * 执行图算法
   */
  async execAlgorithm() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.graphcompute.execAlgorithm(params);
    responseData(ctx, result);
  }
}

export default Neo4jController;
