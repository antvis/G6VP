import request from "umi-request";
import { HTTP_SERVICE_URL } from "./Constants";
export const NeighborsQuery = {
  name: "邻居查询",
  service: async params => {
    const projectId = localStorage.getItem("GI_ACTIVE_PROJECT_ID");
    // const context =  localStorage.getItem("GS_SERVER_CONTEXT");
    const mode =
      localStorage.getItem("GI_CURRENT_QUERY_MODE") === "ODPS" ? 2 : 1;

    const response = await request(
      `${HTTP_SERVICE_URL}/graphcompute/neighbors`,
      {
        method: "post",
        data: {
          ...params,
          projectId,
          mode
        }
      }
    );

    return response;
  }
};
