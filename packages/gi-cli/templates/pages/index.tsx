// import GISDK from "@alipay/graphinsight"; （预计7月份开放）
import React from "react";
import { Counter } from "../components";
import { ClusterNode } from "../elements";
import {
  GI_LOCAL_DATA,
  GI_PROJECT_CONFIG,
  GI_SERVICES_OPTIONS,
} from "./GI_EXPORT_FILES";
import { getCombinedAssets, getServicesByConfig } from "./utils";

interface AppProps { }

/** 生产资产 */
const assets = getCombinedAssets();
/** 生成配置 */
const config = GI_PROJECT_CONFIG;
/** 生成服务 */
const services = getServicesByConfig(GI_SERVICES_OPTIONS, GI_LOCAL_DATA);

/** 更新资产 */
assets.components["Counter"] = Counter;

assets.elements["ClusterNode"] = ClusterNode;
/** 更新配置 */
//@ts-ignore
config.components.push({
  id: "Counter",
  //@ts-ignore
  props: {},
});

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

const App: React.FunctionComponent<AppProps> = (props) => {
  return (
    <div>
      <div style={{ height: "100vh" }}>
        {/** @ts-ignore */}
        <window.GISDK.default
          config={config}
          assets={assets}
          services={MyServices}
        />
      </div>
    </div>
  );
};

export default App;
