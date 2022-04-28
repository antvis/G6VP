import { AssetInfo } from '@alipay/graphinsight';
import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info: AssetInfo = {
  id: 'CanvasSetting',
  name: '画布设置',
  desc: '画布设置',
  cover: 'http://xxxx.jpg',
  category: 'canvas-interaction',
  type: 'AUTO',
};

export default {
  info,
  component: Component,
  registerMeta,
};
