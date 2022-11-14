import request from "umi-request";
import { HTTP_SERVICE_URL, TUGRAPH_DEFAULT_GRAPHNAME } from "./Constants";

export const connectTuGraphDataSource = async (
  username: string,
  password: string,
  serverUrl: string
) => {
  // const token = localStorage.getItem("TUGRAPH_USER_TOKEN") as string;

  const result = await request(`${HTTP_SERVICE_URL}/api/tugraph/connect`, {
    method: "POST",
    data: {
      username,
      password,
      serverUrl,
    },
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Accept: "application/json; charset=UTF-8",
    },
  }).catch((error) => {});

  if (!result || !result.success) {
    return result;
  }

  const { data } = result;
  localStorage.setItem("TUGRAPH_USER_TOKEN", `Bearer ${data.jwt}`);

  return result;
};

export const querySubGraphList = async () => {
  const token = localStorage.getItem("TUGRAPH_USER_TOKEN") as string;

  const result = await request(`${HTTP_SERVICE_URL}/api/tugraph/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: token,
    },
  });

  return result;
};

export const queryVertexLabelCount = async (graphName: string) => {
  const token = localStorage.getItem("TUGRAPH_USER_TOKEN") as string;

  const result = await request(`${HTTP_SERVICE_URL}/api/tugraph/count`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: token,
    },
    params: {
      graphName,
    },
  });

  return result;
};

export const queryGraphSchema = async (params) => {
  let res = {
    nodes: [],
    edges: [],
  };
  const { graphName = TUGRAPH_DEFAULT_GRAPHNAME } = (params as any) || {};

  const token = localStorage.getItem("TUGRAPH_USER_TOKEN") as string;
  if (!token) {
    // 没有登录信息，需要先登录再查询 schema
    return {
      success: false,
      nodes: [],
      edges: [],
      code: 500,
      message: `图模型查询失败: 没有获取到连接 TuGraph 数据库的 Token 信息，请先连接 TuGraph 数据库再进行尝试！`,
    };
  }

  try {
    const result = await request(HTTP_SERVICE_URL + "/api/tugraph/schema", {
      method: "get",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: token,
      },
      params: {
        graphName,
      },
    });
    if (result.success) {
      res = result.data;
    }
    return res;
  } catch (e) {
    return {
      success: false,
      code: 500,
      message: `图模型查询失败: ${e}`,
      nodes: [],
      edges: [],
    };
  }
};
