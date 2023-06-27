import registerMeta from './registerMeta';
import registerShape from './registerShape';
import registerTransform from './registerTransform';

/**   index.md 中解析得到默认值，也可用户手动修改 */ import $i18n from '../../i18n';
const info = {
  id: 'CircleBar',
  category: 'node',
  name: $i18n.get({ id: 'advance.elements.CircleBar.NandinggeerNodes', dm: '南丁格尔节点' }),
  desc: $i18n.get({ id: 'advance.elements.CircleBar.NandinggeerNodes', dm: '南丁格尔节点' }),
  cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*myb8SrnSy0cAAAAAAAAAAAAAARQnAQ',
};

export default {
  info,
  registerShape,
  registerMeta,
  registerTransform,
};
