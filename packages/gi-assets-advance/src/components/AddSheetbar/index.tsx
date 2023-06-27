import { AssetInfo } from '@antv/gi-sdk';
import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */ import $i18n from '../../i18n';

const info: AssetInfo = {
  id: 'AddSheetbar',
  name: $i18n.get({ id: 'advance.components.AddSheetbar.AddATab', dm: '新增页签' }),
  desc: $i18n.get({ id: 'advance.components.AddSheetbar.AddATab', dm: '新增页签' }),
  cover: 'http://xxxx.jpg',
  category: 'system-interaction',
  icon: 'icon-plus',
  type: 'GIAC',
  docs: 'https://www.yuque.com/antv/gi/wwzhrmtem0m2g09p',
};

export default {
  info,
  component: Component,
  registerMeta,
};
