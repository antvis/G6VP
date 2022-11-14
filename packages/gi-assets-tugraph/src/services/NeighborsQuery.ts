import request from "umi-request";
import { HTTP_SERVICE_URL, TUGRAPH_DEFAULT_GRAPHNAME } from "./Constants";
export const NeighborsQuery = {
  name: "邻居查询",
  service: async params => {
    const token = localStorage.getItem("TUGRAPH_USER_TOKEN") as string;
    const { ids, sep, graphName = TUGRAPH_DEFAULT_GRAPHNAME } = params;
    const response = await request(
      `${HTTP_SERVICE_URL}/api/tugraph/neighbors`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Authorization: token
        },
        data: {
          ids,
          sep,
          graphName
        }
      }
    );

    return response.data;
  }
};
