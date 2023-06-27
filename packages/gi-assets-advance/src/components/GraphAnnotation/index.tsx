import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */ import $i18n from '../../i18n';

const info = {
  id: 'GraphAnnotation',
  name: $i18n.get({ id: 'advance.components.GraphAnnotation.Menu', dm: '图标注(MENU)' }),
  category: 'elements-interaction',
  desc: $i18n.get({
    id: 'advance.components.GraphAnnotation.FigureAnnotationOftenIntegratedIn',
    dm: '图标注，常集成在右键菜单中',
  }),
  cover: 'http://xxxx.jpg',
  icon: 'icon-pushpin',
  type: 'GIAC_MENU',
  docs: 'https://www.yuque.com/antv/gi/wefpto855v7x79dd',
};

export default {
  info,
  component: Component,
  registerMeta,
};
