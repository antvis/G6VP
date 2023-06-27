import { AssetInfo } from '@antv/gi-sdk';
import $i18n from '../../i18n';
const info: AssetInfo = {
  id: 'ActivateRelations',
  name: $i18n.get({ id: 'basic.components.ActivateRelations.info.ElementHighlighting', dm: '元素高亮' }),
  desc: $i18n.get({
    id: 'basic.components.ActivateRelations.info.ActivateAssociatedNodesAndEdges',
    dm: '通过交互，激活相关联的节点与边',
  }),
  icon: 'icon-canvas-setting',
  cover: 'http://xxxx.jpg',
  category: 'elements-interaction',
  type: 'AUTO',
  docs: 'https://www.yuque.com/antv/gi/rqq14h0071psf9ks',
  features: [
    $i18n.get({
      id: 'basic.components.ActivateRelations.info.YouCanClickNodesTo',
      dm: '支持点击节点，高亮展示关联节点和边',
    }),
    $i18n.get({
      id: 'basic.components.ActivateRelations.info.YouCanConfigureNodesOr',
      dm: '支持配置节点或者边，悬停高亮效果',
    }),
    $i18n.get({
      id: 'basic.components.ActivateRelations.info.YouCanConfigureTheHighlighting',
      dm: '支持配置节点「上游N度」「下游M度」的高亮效果',
    }),
  ],
};

export default info;
