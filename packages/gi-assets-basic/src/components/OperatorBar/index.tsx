import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */ import $i18n from '../../i18n';
const info = {
  id: 'OperatorBar',
  name: $i18n.get({ id: 'basic.components.OperatorBar.ActionBar', dm: '操作栏' }),
  desc: $i18n.get({
    id: 'basic.components.OperatorBar.BusinessActionBarWhichCan',
    dm: '业务操作栏，可集成众多分析组件',
  }),
  icon: 'icon-tabs',
  cover: 'http://xxxx.jpg',
  category: 'container-components',
  type: 'GICC',
  docs: 'https://www.yuque.com/antv/gi/egap0htkd75mo950',
};

export default {
  info,
  component: Component,
  registerMeta,
};
