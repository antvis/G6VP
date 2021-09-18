import { extractDefault } from "@ali/react-datav-gui-utils";

const registerMeta = (context) => {
  console.log("context", context);
  const { services } = context;
  /**
   * 基于datav.GUI 的面板配置
   * https://yuque.antfin-inc.com/aandm7/aighig/hrsl6i
   */
  return {
    serviceId: {
      default: "" /** 默认值,即Components.defaultProps */,
      name: "数据服务",
      type: "select",
      options: services.map((c) => {
        return { label: c.id, value: c.id };
      }),
    },
  };
};

/** 默认的配置值 */
const configObj = registerMeta({ data: {}, services: [{}] });
export const defaultProps = extractDefault({ config: configObj, value: {} }) as {
  serviceId: string;
};
/** 导出GI的Meta配置面板，基于datav.GUI */
export default registerMeta;
