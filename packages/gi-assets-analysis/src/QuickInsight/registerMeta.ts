import { extra } from '@alipay/graphinsight';
import info from './info';
const { GIAC_METAS, deepClone } = extra;
const metas = deepClone(GIAC_METAS);
const aggregate = ['sum', 'avg', 'max', 'min', 'count', 'count_distinct', 'aggregate-none'];
const options = aggregate.map(c => {
  const value = c.toUpperCase();
  return {
    label: value,
    value,
  };
});
metas.GIAC.properties.GIAC.properties.title.default = info.name;
metas.GIAC.properties.GIAC.properties.isShowTitle.default = false;
metas.GIAC.properties.GIAC.properties.icon.default = info.icon;
metas.GIAC.properties.GIAC.properties.isVertical.default = true;
metas.GIAC.properties.GIAC.properties.tooltipPlacement.default = 'right';
export default context => {
  const { keys } = context;
  console.log('keys', keys);

  return {
    visible: {
      title: '默认显示',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: false,
    },
    queryFieldName: {
      title: '字段ID',
      type: 'string',
      'x-decorator': 'FormItem',
      // 'x-component': 'GroupSelect',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
        options: keys.map(c => {
          return { label: c, value: c };
        }),
      },
      default: [],
    },
    aggregateMethod: {
      title: '聚合方式',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
        options: options,
      },
      default: [],
    },
    ...metas,
  };
};
