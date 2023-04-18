import { utils } from '@antv/gi-sdk';
import { message } from 'antd';
import { formatterSchemaData } from './ServerComponent/utils'
import request from 'umi-request';

export const GI_SERVICE_INTIAL_GRAPH = {
    name: '初始化查询',
    service: async () => {
        return new Promise(resolve => {
            resolve({
                nodes: [],
                edges: [],
            });
        });
    },
};

export const GI_SERVICE_SCHEMA = {
    name: '查询图模型',
    service: async params => {
        const { GALAXYBASE_USER_TOKEN, HTTP_SERVICE_URL, CURRENT_GALAXYBASE_SUBGRAPH } =
            utils.getServerEngineContext();
        let res = {
            nodes: [],
            edges: [],
        };

        if (!GALAXYBASE_USER_TOKEN) {
            // 没有登录信息，需要先登录再查询 schema
            message.error(
                `Galaxybase 数据源连接失败: 没有获取到连接 Galaxybase 数据库的 Token 信息，请先连接 Galaxybase 数据库再进行尝试！`,
            );
            return;
        }

        try {
            const result = await request(HTTP_SERVICE_URL + '/api/buildGraph/getSchema', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    Authorization: GALAXYBASE_USER_TOKEN,
                },
                params: {
                    graphName: CURRENT_GALAXYBASE_SUBGRAPH,
                },
            });
            const { success, data } = result;
            // if (success) {
            //   res = data;
            // }
            // if (data.code === 401) {
            //   notification.error({
            //     message: '认证失败：Unauthorized',
            //     description: data.data.error_message,
            //   });
            //   res = {
            //     nodes: [],
            //     edges: [],
            //   };
            // }
            if (success) {
                let { nodes, edges } = formatterSchemaData(data)
                return {
                    nodes,
                    edges,
                };
            }
            return {
                nodes: [],
                edges: [],
            };
        } catch (error) {
            console.error('error', error);
            return {
                nodes: [],
                edges: [],
            };
        }
    },
};
