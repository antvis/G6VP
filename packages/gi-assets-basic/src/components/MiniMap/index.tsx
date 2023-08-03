import registerMeta from './registerMeta';
import $i18n from '../../i18n';
import Component from './Component';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'MiniMap',
  name: $i18n.get({ id: 'basic.components.MiniMap.SmallMap', dm: '小地图' }),
  desc: $i18n.get({ id: 'basic.components.MiniMap.WhenEnabledInformationCanBe', dm: '启用后，可在小地图上展示信息' }),
  icon: 'icon-minimap',
  cover: 'http://xxxx.jpg',
  category: 'system-interaction',
  type: 'AUTO',
  docs: 'https://www.yuque.com/antv/gi/wzzgehef2k3nfm9c',
};

export default {
  info,
  component: Component,
  registerMeta,
} as any;
