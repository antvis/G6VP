import { formatMessage } from '@antv/gi-sdk';
import locales from './locales'

const info = {
  id: 'FilterPanel',
  name: formatMessage({ id: 'FilterPanel.info.name' }, locales),
  desc: '通过属性筛选画布信息，可自定义',
  icon: 'icon-filter',
  cover: 'http://xxxx.jpg',
  category: 'data-analysis',
  type: 'GIAC_CONTENT',
  docs: 'https://www.yuque.com/antv/gi/gyilm62o426etqpd',
};

export default info;
