import registerMeta from './registerMeta';
import registerShape from './registerShape';
import registerTransform from './registerTransform';

/**   index.md 中解析得到默认值，也可用户手动修改 */ import $i18n from '../../i18n';
const info = {
  id: 'DonutNode',
  name: $i18n.get({ id: 'basic.elements.DonutNode.Doughnuts', dm: '甜甜圈' }),
  type: 'NODE',
  category: 'node',
  icon: 'icon-piechart',
  desc: $i18n.get({
    id: 'basic.elements.DonutNode.DonutComponentForDataDistribution',
    dm: '甜甜圈组件，用于数据有分布的情况',
  }),
  cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*dqQ0RrldWTAAAAAAAAAAAAAAARQnAQ',
  docs: 'https://www.yuque.com/antv/gi/dps9iq11zye8o35b',
};

export default {
  info,
  registerShape,
  registerMeta,
  registerTransform,
};
