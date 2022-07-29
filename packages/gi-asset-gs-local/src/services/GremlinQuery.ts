import { HTTP_SERVICE_URL } from "./Constants";
import request from "umi-request";
export const GremlinQuery = {
  name: "Gremlin 查询",
  service: async (params = {}) => {
    const { value } = params as any;
    const projectId = localStorage.getItem("GI_ACTIVE_PROJECT_ID");
    // const context =  localStorage.getItem("GS_SERVER_CONTEXT");
    const mode =
      localStorage.getItem("GI_CURRENT_QUERY_MODE") === "ODPS" ? 2 : 1;

    const response = await request(
      `${HTTP_SERVICE_URL}/graphcompute/gremlinQuery`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        },
        data: {
          value,
          projectId,
          mode
        }
      }
    );
    return response;
  }
};
