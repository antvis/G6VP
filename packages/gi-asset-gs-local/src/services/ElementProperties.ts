import { HTTP_SERVICE_URL } from "./Constants";
import request from "umi-request";

export const PropertiesPanel = {
  name: "查询元素属性",
  service: async params => {
    const id = params.id;
    const projectId = localStorage.getItem("GI_ACTIVE_PROJECT_ID");
    // const context =  localStorage.getItem("GS_SERVER_CONTEXT");
    const mode =
      localStorage.getItem("GI_CURRENT_QUERY_MODE") === "ODPS" ? 2 : 1;

    const response = await request(
      `${HTTP_SERVICE_URL}/graphcompute/properties`,
      {
        method: "post",
        data: {
          id: [id],
          projectId,
          mode
        }
      }
    );

    return response;
  }
};
