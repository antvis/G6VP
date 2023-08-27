import { Info } from '@antv/gi-sdk';
import $i18n from '../../i18n';
const info = {
  id: 'ShortcutKeys',
  name: $i18n.get({ id: 'basic.components.ShortcutKeys.info.ShortcutKeys', dm: '快捷键' }),
  desc: $i18n.get({ id: 'basic.components.ShortcutKeys.info.ShortcutKeyDescription', dm: '快捷键说明' }),
  icon: 'icon-shortcut',
  cover: 'http://xxxx.jpg',
  category: 'canvas-interaction',
  type: Info.type.COMPONENT_ACTION,
  docs: 'https://www.yuque.com/antv/gi/wc317ftgwwk3fwny',
};
export default info;
