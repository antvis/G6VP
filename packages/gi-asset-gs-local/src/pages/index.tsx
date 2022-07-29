// import GISDK from "@alipay/graphinsight"; （预计7月份开放）
// 因为没有做 external，避免多个版本react冲突，统一从window对象中获取
import React from "react";

import { cloneDeep } from "lodash";
import { DataLoadPanel } from "../components";
import Navbar from "../components-ui/Navbar";
import {
  GI_LOCAL_DATA,
  GI_PROJECT_CONFIG,
  GI_SCHEMA_DATA,
  GI_SERVICES_OPTIONS,
} from "./constants/GI_EXPORT_FILES";
import * as Utils from "./constants/utils";
import { getDefaultValues } from "./utils";

const { getCombinedAssets, getServicesByConfig } = Utils;

/** 生产资产 */
const assets = getCombinedAssets();
/** 生成配置 */
//hack-start :因为 umi 的热更新，会导致 config 是已经被 immer 包裹后的 config，因此这里通过 hack 方式解决一些 bug
const config = cloneDeep(GI_PROJECT_CONFIG);

/** 生成服务 */
const services = getServicesByConfig(
  GI_SERVICES_OPTIONS,
  GI_LOCAL_DATA,
  GI_SCHEMA_DATA
);

assets.components["DataLoadPanel"] = DataLoadPanel;


/** 更新配置 */
//@ts-ignore
config.components.forEach((c) => {
  if (c.id === "SideTabs") {
    c.props.GI_CONTAINER?.push("DataManage", "ClusterManage", "DeployOverview", 'DataLoadPanel');
  }
  return c;
});

config.components.push(
  {
    id: "DataLoadPanel",
    name: "数据导入",
    //@ts-ignore
    props: getDefaultValues({
      type: "object",
    }),
  },
);
console.log("config", config);
/** 更新服务 */
export const MyServices = services.map((c) => {
  if (c.id === "Mock/PropertiesPanel") {
    return {
      ...c,
      service: (params, localData) => {
        const data = params.data;
        console.log("data", data);
        return new Promise(function (resolve) {
          return resolve({
            ...data,
            desc: "业务可以自定义",
            myName: "pomelo.lcw",
            randomKey: Math.random(),
          });
        });
      },
    };
  }
  return c;
});

const App = (props) => {
  return (
    <div>
      {/** @ts-ignore */}
      <Navbar />
      <div style={{ height: "calc(100vh - 48px)" }}>
        {/** @ts-ignore */}
        <window.GISDK.default
          config={config}
          assets={assets}
          services={services}
        />
      </div>
    </div>
  );
};

export default App;
