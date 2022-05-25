import Component from "./Component";
import registerMeta from "./registerMeta";

/**   index.md 中解析得到默认值，也可用户手动修改 */

const info = {
  id: "MyCounter",
  name: "我的计时器",
  category: "components",
  desc: "我的计时器",
  cover: "http://xxxx.jpg",
  type: "",
};

export default {
  info,
  component: Component,
  registerMeta,
};
