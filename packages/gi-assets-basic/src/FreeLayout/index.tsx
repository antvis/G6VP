import Component from "./Component";
import registerMeta from "./registerMeta";

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: "FreeLayout",
  name: "自由布局",
  desc: "对组件进行自由布局，支持左、右、下三个方向布局组件",
  icon: "icon-sidebar",
  cover: "http://xxxx.jpg",
  category: "container-components",
  type: "GICC",
};

export default {
  info,
  component: Component,
  registerMeta,
};
