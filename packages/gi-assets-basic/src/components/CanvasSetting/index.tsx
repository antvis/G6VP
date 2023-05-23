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
  docs: 'https://www.yuque.com/antv/gi/aa34nmszaivikxi1',
  features: [
    '支持框选「画布」节点或者边',
    '支持双击「画布」自动自适应居中',
    '支持配置「画布」的背景色',
    '支持配置「画布」的缩放，平移交互',
  ],
};

export default {
  info,
  component: Component,
  registerMeta,
};
