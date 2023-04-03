import { AssetInfo } from '@antv/gi-sdk';
import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */

const info: AssetInfo = {
  id: 'Sheetbar',
  name: '多画布页签',
  desc: '新建画布页签，辅助动态分析',
  cover: 'http://xxxx.jpg',
  category: 'system-interaction',
  type: 'AUTO',
  icon: 'icon-diff',
  docs: 'https://www.yuque.com/antv/gi/vb6ysnnf1db2pdlf',
};

export default {
  info,
  component: Component,
  registerMeta,
} as any;
