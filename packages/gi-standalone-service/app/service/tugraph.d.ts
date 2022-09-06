import { Service } from 'egg';
import { ILanguageQueryParams, INeighborsParams } from './serviceInterface';
declare class TuGraphService extends Service {
    connect(username: any, password: any, serverUrl: any): Promise<{
        success: boolean;
        code: number;
        data: any;
    }>;
    /**
     * 通过 Cypher 语句查询子图数据
     * @param cypher Cypher 查询语句
     * @param graphName 图名称
     * @param authorization 认证信息
     */
    querySubGraphByCypher(cypher: string, graphName: string, authorization: string): Promise<{
        nodes: any;
        edges: any;
    } | {
        success: boolean;
        code: number;
        data: any;
    }>;
    /**
     * 使用 Cypher 语句查询
     * @param params
     */
    queryByGraphLanguage(params: ILanguageQueryParams): Promise<{
        data: {
            nodes: any;
            edges: any;
        } | {
            success: boolean;
            code: number;
            data: any;
        };
        code: number;
        success: boolean;
    }>;
    /**
     *
     * @param params
     */
    queryNeighbors(params: INeighborsParams): Promise<{
        data: {
            nodes: any;
            edges: any;
        } | {
            success: boolean;
            code: number;
            data: any;
        };
        code: number;
        success: boolean;
    }>;
    queryEdgeSchema(edgeType: string, graphName: string, authorization: string): Promise<{
        success: boolean;
        code: number;
        data: any;
        sourceNodeType?: undefined;
        targetNodeType?: undefined;
        edgeTypeKeyFromProperties?: undefined;
        edgeType?: undefined;
        label?: undefined;
        properties?: undefined;
    } | {
        sourceNodeType: any;
        targetNodeType: any;
        edgeTypeKeyFromProperties: string;
        edgeType: any;
        label: any;
        properties: any;
        success?: undefined;
        code?: undefined;
        data?: undefined;
    } | null>;
    /**
     * 查询指定子图的 Schema
     * @param graphName 子图名称
     * @param authorization 认证信息
     */
    querySchema(graphName: string, authorization: string): Promise<{
        success: boolean;
        code: number;
        data: any;
    }>;
    /**
     * 查询子图列表
     * @param authorization 认证信息
     */
    getSubGraphList(authorization: string): Promise<{
        success: boolean;
        code: number;
        data: any;
    }>;
    /**
     * 查询指定子图中节点和边的数量
     * @param graphName 子图名称
     * @param authorization 认证信息
     */
    getVertexEdgeCount(graphName: string, authorization: string): Promise<{
        success: boolean;
        code: number;
        data: any;
    }>;
}
export default TuGraphService;
