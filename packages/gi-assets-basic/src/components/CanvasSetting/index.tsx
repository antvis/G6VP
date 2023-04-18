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
};

export default {
  info,
  component: Component,
  registerMeta,
};
