import { CypherEditor } from "../components";
import DataManage from "../components/DataManage";
import DataManageRegisterMeta from "../components/DataManage/registerMeta";
//@ts-ignore
const { getDefaultValues } = window.GISDK.utils;
export const updateAssets = assets => {
  assets.components["TuGraphDataSource"] = DataManage;
  assets.components["CypherEditor"] = CypherEditor;

  return assets;
};

export const updateConfig = config => {
  config.components.forEach(c => {
    // if (c.id === "SideTabs") {
    //   c.props.GI_CONTAINER?.push("TuGraphDataSource", "CypherEditor");
    // }
    return c;
  });

  config.components.push({
    id: "TuGraphDataSource",
    name: "数据",
    //@ts-ignore
    props: getDefaultValues({
      type: "object",
      properties: DataManageRegisterMeta({})
    })
  });

  config.components.forEach(item => {
    // 修改 GremlinQuery 资产的服务
    if (item.id === "CypherEditor") {
      item.props.serviceId = "TuGraph/LanguageQuery";
    }
    if (item.id === "NeighborsQuery") {
      item.props.serviceId = "TuGraph/NeighborsQuery";
    }
    if (item.id === "Initializer") {
      item.props.serviceId = "TuGraph/GI_SERVICE_INTIAL_GRAPH";
      item.props.schemaServiceId = "TuGraph/GI_SERVICE_SCHEMA";
    }
  });
  return config;
};
