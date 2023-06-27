import { AssetInfo } from '@antv/gi-sdk';
import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */ import $i18n from '../../i18n';
const info: AssetInfo = {
  id: 'CanvasSetting',
  name: $i18n.get({ id: 'basic.components.CanvasSetting.CanvasSettings', dm: '画布设置' }),
  desc: $i18n.get({
    id: 'basic.components.CanvasSetting.SetTheBackgroundOfThe',
    dm: '设置画布的背景，缩放，移动等交互',
  }),
  icon: 'icon-canvas-setting',
  cover: 'http://xxxx.jpg',
  category: 'canvas-interaction',
  type: 'AUTO',
  docs: 'https://www.yuque.com/antv/gi/aa34nmszaivikxi1',
  features: [
    $i18n.get({ id: 'basic.components.CanvasSetting.SelectCanvasNodeOrEdge', dm: '支持框选「画布」节点或者边' }),
    $i18n.get({
      id: 'basic.components.CanvasSetting.SupportsAutomaticAdaptiveCenteringBy',
      dm: '支持双击「画布」自动自适应居中',
    }),
    $i18n.get({ id: 'basic.components.CanvasSetting.YouCanConfigureTheBackground', dm: '支持配置「画布」的背景色' }),
    $i18n.get({
      id: 'basic.components.CanvasSetting.SupportsScalingAndTranslationInteraction',
      dm: '支持配置「画布」的缩放，平移交互',
    }),
  ],
};

export default {
  info,
  component: Component,
  registerMeta,
};
