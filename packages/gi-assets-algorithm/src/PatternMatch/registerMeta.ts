import { extra } from "@alipay/graphinsight";
import { CSSProperties } from 'react';
import info from "./info";

export const SPLITOR = '|SPLITOR|';

export enum ITEM_STATE {
  Active = "active",
  Default = "default",
  Selected = "selected",
  Disable = "disable",
  Highlight = "highlight",
  Inactive = "inactive",
}
export interface PropertyContentProps {
  type: "node" | "edge";
  visible: boolean;
  form;
  properties: string[];
}

export interface PatternMatchProps {
  IconWrapper: React.FC;
  visible: boolean;
  disabled?: boolean;
  style?: CSSProperties,
  setDisabledTools?: (toolKeys: string[]) => void;
  onClose?: () => void;
  onOpen?: () => void;
  options?: {
    exportButton?: {
      text: string,
      style: CSSProperties,
    },
    // 模式匹配算法应用时的回调
    onApply?: (params: object) => void;
    // 开启/关闭配置面板时的回调
    onVisibleChange?: (visible: boolean) => void;
    // 开启/关闭图编辑器时的回调
    onGraphEditorVisibleChange?: (visible: boolean) => void;
    // 保存模式
    exportPattern?: (pattern: object) => void;
    // 进入/退出选择模式的回调函数
    onExtractModeChange?: (isExtractMode: boolean) => void;
  };
}

const { GIAC_CONTENT_METAS, deepClone } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = info.name;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = info.icon;

export default () => {
  return {
    ...metas,
  };
};
