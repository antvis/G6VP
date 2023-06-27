import { extra } from '@antv/gi-sdk';
import info from './info';
import $i18n from '../../i18n';
const { deepClone, GIAC_CONTENT_METAS } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);

metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = info.name;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = info.icon;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.tooltip.default = info.desc;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.containerWidth.default = '400px';

const registerMeta = ({ schemaData }) => {
  const schema = {
    enableCopy: {
      title: $i18n.get({ id: 'advance.components.TableMode.registerMeta.CopySelectedContent', dm: '复制选中内容' }),
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    exportable: {
      title: $i18n.get({ id: 'advance.components.TableMode.registerMeta.SupportsExportingData', dm: '支持导出数据' }),
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    enableTabSplitScreen: {
      title: $i18n.get({ id: 'advance.components.TableMode.registerMeta.SupportTabSplitScreen', dm: '支持页签分屏' }),
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    isSelectedActive: {
      title: $i18n.get({
        id: 'advance.components.TableMode.registerMeta.ElementSelectionHighlight',
        dm: '元素选中高亮',
      }),
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    targetWindowPath: {
      title: $i18n.get({ id: 'advance.components.TableMode.registerMeta.SplitTabRouting', dm: '分屏页签路由' }),
      type: 'string',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      default: '/#/tabs/table',
    },
    ...metas,
  };

  return schema;
};

export default registerMeta;
