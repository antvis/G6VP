import $i18n from '../../i18n'; /**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'ContentContainer',
  name: $i18n.get({ id: 'basic.components.ContentContainer.info.ContentContainer', dm: '内容容器' }),
  desc: $i18n.get({ id: 'basic.components.ContentContainer.info.CombinedContentContainer', dm: '组合内容容器' }),
  icon: 'icon-sidebar',
  cover: 'http://xxxx.jpg',
  category: 'container-components',
  type: 'GIAC_CONTENT',
};
export default info;
