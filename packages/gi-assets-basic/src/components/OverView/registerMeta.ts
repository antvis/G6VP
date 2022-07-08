import { extra } from '@alipay/graphinsight';
import info from './info';
const { deepClone, GIAC_CONTENT_METAS } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = info.name;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = info.icon;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.containerWidth.default = '400px';

export default () => {
  return {
    limit: {
      title: '限制展示数量（节点）',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 600,
    },
    filterLogic: {
      title: '筛选逻辑',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        { value: 'and', label: 'and' },
        { value: 'or', label: 'or' },
      ],
      default: 'and',
    },
    ...metas,
  };
};
