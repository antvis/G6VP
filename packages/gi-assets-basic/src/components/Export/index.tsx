import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */

const info = {
  id: 'Export',
  name: '导出',
  desc: '导出',
  cover: 'http://xxxx.jpg',
  category: 'workbook',
  type: 'GIAC',
};

export default {
  info,
  component: Component,
  registerMeta,
};
