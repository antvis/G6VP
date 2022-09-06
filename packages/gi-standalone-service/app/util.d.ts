export declare const GRAPHSCOPE_SERVICE_URL = "http://11.166.85.48:9527";
export declare const responseData: (ctx: any, resp: any) => void;
interface ICypherResponse {
    elapsed?: number;
    header: {
        [key: string]: string | number;
    }[];
    result: any[];
    size: number;
}
export declare const getNodeIdsByResponseBak: (params: ICypherResponse) => {
    nodeIds: Array<number>;
    edgeIds: Array<string>;
};
export declare const getNodeIdsByResponse: (params: any) => {
    nodeIds: Array<number>;
    edgeIds: Array<string>;
};
export {};
