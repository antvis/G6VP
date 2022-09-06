import { Service } from 'egg';
declare class Neo4jService extends Service {
    private uri;
    private username;
    private password;
    /**
     * 创建 GraphScope 实例
     */
    connect(uri: any, username: any, password: any): Promise<{
        success: boolean;
        code: number;
        message: unknown;
    }>;
    /**
     * 关闭创建的 GraphScope 实例
     */
    disConnect(): Promise<{
        success: boolean;
        code: number;
        message: string;
        data: any;
    } | {
        success: boolean;
        code: number;
        message: unknown;
        data?: undefined;
    }>;
    /**
     * 使用 Graph Language 语句进行查询
     * @param params 查询参数
     */
    queryByGraphLanguage(params: any): Promise<{
        success: boolean;
        code: number;
        data: any;
    }>;
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
}
export default Neo4jService;
