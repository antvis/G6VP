import { extra, utils } from "@alipay/graphinsight";
import info from "./info";
const { GIAC_CONTENT_METAS, deepClone } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = info.icon;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = info.name;

const registerMeta = context => {
  const { services = [] } = context;
  const serviceOptions = utils.getServiceOptions(services, info.services[0]);
  return {
    /** 分类信息 */
    serviceId: {
      title: "数据服务",
      type: "string",
      "x-decorator": "FormItem",
      "x-component": "Select",
      "x-component-props": {
        options: serviceOptions
      },
      default: serviceOptions[0]?.value
    },
    initialValue: {
      title: "初始语句",
      type: "string",
      "x-decorator": "FormItem",
      "x-component": "Input.TextArea",
      default: "MATCH n RETURN LIMIT 100"
    },
    ...metas
  };
};

export default registerMeta;
