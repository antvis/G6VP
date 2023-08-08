import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */ import $i18n from '../i18n';
const info = {
  id: 'PatternMatch',
  name: $i18n.get({ id: 'gi-assets-algorithm.src.PatternMatchSimple.PatternMatching', dm: '模式匹配' }),
  category: 'components',
  desc: $i18n.get({ id: 'gi-assets-algorithm.src.PatternMatchSimple.PatternMatching', dm: '模式匹配' }),
  cover: 'http://xxxx.jpg',
  type: 'GI_CONTAINER_INDEX',
};

export default {
  info,
  component: Component,
  registerMeta,
};
