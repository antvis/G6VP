import { AssetInfo } from '@antv/gi-sdk';
import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info: AssetInfo = {
  id: 'CanvasSetting',
  name: '画布设置',
  desc: '设置画布的背景，缩放，移动等交互',
  icon: 'icon-canvas-setting',
  cover: 'http://xxxx.jpg',
  category: 'canvas-interaction',
  type: 'AUTO',
  feature: [
    '支持「按住」Shift 框选画布，从而选中节点或者边元素',
    '支持「缩放」画布，「拖拽」平移',
    '支持「设置」画布的背景色和背景图片',
    '支持「双击」画布，将画布中的图调整到正中间',
    '支持「点击」画布，清空所有交互状态',
  ],
};

export default {
  info,
  component: Component,
  registerMeta,
};
