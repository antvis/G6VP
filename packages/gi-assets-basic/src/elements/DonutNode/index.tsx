import registerMeta from './registerMeta';
import registerShape from './registerShape';
import registerTransform from './registerTransform';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'DonutNode',
  name: '甜甜圈',
  type: 'NODE',
  category: 'node',
  icon: 'icon-piechart',
  desc: '甜甜圈组件，用于数据有分布的情况',
  cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*dqQ0RrldWTAAAAAAAAAAAAAAARQnAQ',
};

export default {
  info,
  registerShape,
  registerMeta,
  registerTransform,
};
