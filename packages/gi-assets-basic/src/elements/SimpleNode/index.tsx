import registerMeta from './registerMeta';
import registerShape from './registerShape';
import registerTransform, { defaultConfig } from './registerTransform';

/**   index.md 中解析得到默认值，也可用户手动修改 */ import $i18n from '../../i18n';
const info = {
  id: 'SimpleNode',
  category: 'node',
  type: 'NODE',
  name: $i18n.get({ id: 'basic.elements.SimpleNode.OfficialNode', dm: '官方节点' }),
  icon: 'icon-smile',
  desc: $i18n.get({ id: 'basic.elements.SimpleNode.OfficialNode', dm: '官方节点' }),
  cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*myb8SrnSy0cAAAAAAAAAAAAAARQnAQ',
  docs: 'https://www.yuque.com/antv/gi/mkrt58kk7m8qi0cu',
};

export default {
  info,
  defaultProps: defaultConfig,
  registerShape,
  registerMeta,
  registerTransform,
};
