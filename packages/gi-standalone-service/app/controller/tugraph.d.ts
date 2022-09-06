import { Controller } from 'egg';
declare class TuGraphController extends Controller {
    index(): Promise<void>;
    /**
     * 创建 GraphScope 实例
     */
    connect(): Promise<void>;
    queryByGraphLanguage(): Promise<void>;
    /**
     * 邻居查询
     */
    queryNeighbors(): Promise<void>;
    /**
     * 获取 Schema
     */
    getSchema(): Promise<void>;
    getSubGraphList(): Promise<void>;
    getVertexEdgeCount(): Promise<void>;
}
export default TuGraphController;
