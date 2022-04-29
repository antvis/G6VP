import { AssetInfo } from '@alipay/graphinsight';
import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */

const info: AssetInfo = {
  id: 'Sheetbar',
  name: '多画布页签',
  desc: '多画布页签',
  cover: 'http://xxxx.jpg',
  category: 'system-interaction',
  type: 'GIAC',
};

export default {
  info,
  component: Component,
  registerMeta,
};
