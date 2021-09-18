import { extractDefault } from "@ali/react-datav-gui-utils";

const registerMeta = (context) => {
  /**
   * 基于datav.GUI 的面板配置
   * https://yuque.antfin-inc.com/aandm7/aighig/hrsl6i
   */
  return {
    placement: {
      default: "LB" /** 默认值,即Components.defaultProps */,
      name: "放置位置",
      type: "buttonRadio",
      evenlySplit: true,
      options: [
        {
          value: "LB",
          label: "左下角",
        },
        {
          value: "RB",
          label: "右下角",
        },
      ],
    },
  };
};

/** 默认的配置值 */
const configObj = registerMeta({ data: {} });
export const defaultProps = extractDefault({ config: configObj, value: {} }) as {
  placement: "LB" | "RB";
};
/** 导出GI的Meta配置面板，基于datav.GUI */
export default registerMeta;
