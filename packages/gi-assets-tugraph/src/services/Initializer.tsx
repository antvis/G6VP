import request from "umi-request";
import { message } from "antd";
import { HTTP_SERVICE_URL, TUGRAPH_DEFAULT_GRAPHNAME } from "./Constants";
export const GI_SERVICE_INTIAL_GRAPH = {
  name: "初始化查询",
  service: async () => {
    return new Promise(resolve => {
      resolve({
        nodes: [],
        edges: []
      });
    });
  }
};

export const GI_SERVICE_SCHEMA = {
  name: "查询图模型",
  service: async params => {
    let res = {
      nodes: [],
      edges: []
    };
    let { graphName = TUGRAPH_DEFAULT_GRAPHNAME } = (params as any) || {};

    const token = localStorage.getItem("TUGRAPH_USER_TOKEN") as string;
    if (!token) {
      // 没有登录信息，需要先登录再查询 schema
      message.error(
        `TuGraph 数据源连接失败: 没有获取到连接 TuGraph 数据库的 Token 信息，请先连接 TuGraph 数据库再进行尝试！`
      );
      return;
    }

    if (!graphName) {
      // 不存在GraphName，则查询子图列表，默认取第一个
      const subGraphResult = await request(
        `${HTTP_SERVICE_URL}/api/tugraph/list`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Authorization: token
          }
        }
      );

      if (subGraphResult) {
        if (!subGraphResult.success) {
          message.error(`查询子图列表失败：${subGraphResult.message}`);
          return;
        }

        const subGraphList = subGraphResult.data;
        if (subGraphList && subGraphList.length > 0) {
          graphName = subGraphList[0].value;
          localStorage.setItem("CURRENT_TUGRAPH_SUBGRAPH", graphName);
        }
      }
    }

    if (!graphName) {
      message.error(`连接的 TuGraph 图数据库中不存在子图，请先创建子图`);
      return;
    }

    try {
      const result = await request(HTTP_SERVICE_URL + "/api/tugraph/schema", {
        method: "get",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Authorization: token
        },
        params: {
          graphName
        }
      });
      if (result.success) {
        res = result.data;
      }
      return res;
    } catch (e) {
      message.error(`图模型查询失败: ${e}`);
    }
    return res;
  }
};
