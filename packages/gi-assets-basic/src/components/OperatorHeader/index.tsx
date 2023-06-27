import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */ import $i18n from '../../i18n';
const info = {
  id: 'OperatorHeader',
  name: $i18n.get({ id: 'basic.components.OperatorHeader.OperationHeaderBar', dm: '操作头栏' }),
  desc: $i18n.get({ id: 'basic.components.OperatorHeader.OperationHeaderBar', dm: '操作头栏' }),
  cover: 'http://xxxx.jpg',
  category: 'container-components',
  type: 'GICC',
};

export default {
  info,
  component: Component,
  registerMeta,
};
