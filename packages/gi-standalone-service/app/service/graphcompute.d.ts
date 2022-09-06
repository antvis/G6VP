import { Service } from 'egg';
declare class GraphComputeService extends Service {
    /**
     * 创建 GraphScope 实例
     */
    createGraphScopeInstance(): Promise<{
        success: any;
        code: any;
        message: any;
        data: {
            instanceId: any;
        };
    } | null>;
    /**
     * 关闭创建的 GraphScope 实例
     */
    closeGraphScopeInstance(instanceId: any): Promise<any>;
    /**
     * 将数据加载到 GraphScope 引擎中
     * @param params
     */
    loadDataToGraphScope(params: any): Promise<any>;
    /**
     * 将加载到 GraphScope 中的数据卸载掉
     */
    unloadDataFromGraphScope(graphName: any): Promise<any>;
    generatorGraphData(value: any): {};
    /**
     * 通过 Gremlin 语句查询
     * @param gremlinSQL Gremlin 查询语句
     */
    queryByGremlinLanguage(params: any): Promise<{
        success: boolean;
        code: number;
        message: string;
        data: {
            nodes: never[];
            edges: never[];
        };
    }>;
    closeGraphInstance(params: any): Promise<{
        success: boolean;
        errorMsg: string;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        errorMsg?: undefined;
    }>;
    /**
     * 上传文件到部署 GraphScope 的服务器上
     * @param params
     */
    uploadFileToService(params: any): Promise<import("_urllib@2.38.1@urllib").HttpClientResponse<any> | {
        success: any;
        code: any;
        message: any;
        data: {
            fileName: string;
            filePath: unknown;
        };
    } | undefined>;
    /**
     * 执行 GraphScope 图算法
     * @param params 算法参数
     */
    execAlgorithm(params: any): Promise<any>;
    /**
     * 批量查询节点的属性
     * @param gremlinClientInsance Gremlin 客户端实例
     * @param nodeIds 节点ID数组
     */
    queryNodesProperties(gremlinClientInsance: any, nodeIds: any): Promise<never[]>;
    /**
     * 邻居查询
     * @param params
     */
    queryNeighbors(params: any): Promise<{
        success: boolean;
        code: number;
        message: string;
        data: {
            nodes: never[];
            edges: never[];
        };
    }>;
    /**
     * 查询节点属性详情
     * @param params 节点 ID
     */
    queryElementProperties(params: any): Promise<{
        success: boolean;
        code: number;
        message: string;
        data: {};
    }>;
    /**
     * 统计元素数量
     */
    statisticsElementCount(params: any): Promise<any>;
    /**
     * 根据 GraphName 查询 Schema 数据
     */
    queryGraphSchema(graphName: any): Promise<any>;
    /**
     * 执行算法成功后，将算法结果写到数据指定字段上
     * @param params
     */
    addColumnToData(params: any): Promise<any>;
    /**
     * 将 JSON 描述的 pattern 转换为 Gremlin 语句
     * @param value JSON 值
     */
    jsonToGremlin(value: any): Promise<any>;
    getGraphScopeInstance(): Promise<any>;
}
export default GraphComputeService;
