import { Controller } from 'egg';
declare class GraphComputeController extends Controller {
    /**
     * 创建 GraphScope 实例
     */
    createGraphScopeInstance(): Promise<void>;
    /**
     * 关闭 GraphScope 引擎实例
     */
    closeGraphScopeInstance(): Promise<void>;
    /**
     * 将本地的文件上传到服务器上面
     */
    uploadFile(): Promise<void>;
    /**
     * 将数据载入到 GraphScope 引擎中
     */
    loadDataToGraphScope(): Promise<void>;
    /**
     * Gremlin 查询
     */
    gremlinQuery(): Promise<void>;
    /**
     * 邻居查询
     */
    queryNeighbors(): Promise<void>;
    /**
     * 获取 Schema
     */
    getSchema(): Promise<void>;
    /**
     * 获取 GraphScope 实例列表
     */
    getInstance(): Promise<void>;
    /**
     * 获取元素的属性详情
     */
    queryElementProperties(): Promise<void>;
    /**
     * 执行图算法
     */
    execAlgorithm(): Promise<void>;
}
export default GraphComputeController;
