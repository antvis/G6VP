import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'GremlinTemplateQuery',
  name: 'Gremlin 模板语句查询面板',
  category: 'components',
  desc: '通过 Gremlin 模板语句快速查询图数据',
  cover: 'http://xxxx.jpg',
  type: 'GIAC_CONTENT',
  docs: 'https://www.yuque.com/antv/gi/yz0xsyvg7kcgkt6g',
};

export default {
  info,
  component: Component,
  registerMeta,
};
