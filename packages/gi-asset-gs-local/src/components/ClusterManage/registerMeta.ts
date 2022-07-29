import { extra } from "@alipay/graphinsight";
import info from "./info";
const { deepClone, GIAC_CONTENT_METAS } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GI_CONTAINER_INDEX.default = -1;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.isShowTitle.default =
  false;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = info.name;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = info.icon;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.tooltipPlacement.default =
  "right";

export default (context) => {
  return {
    ...metas,
  };
};
