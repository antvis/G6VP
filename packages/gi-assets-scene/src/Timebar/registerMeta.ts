import { extra } from '@antv/gi-sdk';
import { TIME_GRANULARITY_LIST } from './constant';
import { playbackSpeedList } from './control/animation/constants';
import info from './info';
import type { FieldType } from './types';

const { deepClone, GIAC_CONTENT_METAS } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = info.name;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = info.icon;

const registerMeta = ({ schemaData }) => {
  const getProperties = (type: FieldType, dataType?: string) => {
    return Object.entries<string>(
      schemaData[type].reduce((acc, cur) => {
        return {
          ...acc,
          ...cur.properties,
        };
      }, {}),
    )
      .filter(([, v]) => (dataType ? [dataType].includes(v) : true))
      .map(([k]) => ({ label: k, value: `${type}:${k}` }));
  };

  const schema = {
    timeField: {
      title: '时间字段',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        { label: '节点', options: getProperties('nodes') },
        { label: '边', options: getProperties('edges') },
      ],
    },
    yField: {
      title: '指标字段',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        { label: '节点', options: getProperties('nodes') },
        { label: '边', options: getProperties('edges') },
      ],
      'x-decorator-props': {
        tooltip: '非数值类型仅支持聚合计数\n确保和时间字段同属于节点或边',
      },
    },
    aggregation: {
      title: '聚合',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        { label: '计数', value: 'count' },
        { label: '最大值', value: 'max' },
        { label: '均值', value: 'mean' },
        { label: '最小值', value: 'min' },
        { label: '中位数', value: 'median' },
        { label: '求和', value: 'sum' },
      ],
      default: 'count',
    },
    // datepicker 有问题
    // timeRange: {
    //   title: '时间范围',
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'DatePicker.RangePicker',
    //   'x-component-props': {
    //     showTime: true,
    //   },
    // },
    // defaultTimeRange: {
    //   title: '默认时间范围',
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'DatePicker.RangePicker',
    //   'x-component-props': {
    //     showTime: true,
    //   },
    // },
    timeGranularity: {
      title: '时间粒度',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: TIME_GRANULARITY_LIST,
      'x-linkages': [
        {
          type: 'value:schema',
          target: 'timeRange',
          condition: "{{ $self === 'year' }}",
          schema: {
            'x-component-props': {
              picker: 'year',
            },
          },
        },
        {
          type: 'value:schema',
          target: 'timeRange',
          condition: "{{ $self === 'quarter' }}",
          schema: {
            'x-component-props': {
              picker: 'quarter',
            },
          },
        },
        {
          type: 'value:schema',
          target: 'timeRange',
          condition: "{{ $self === 'month' }}",
          schema: {
            'x-component-props': {
              picker: 'month',
            },
          },
        },
        {
          type: 'value:schema',
          target: 'timeRange',
          condition: "{{ $self === 'week' }}",
          schema: {
            'x-component-props': {
              picker: 'week',
            },
          },
        },
      ],
      default: 'day',
    },
    speed: {
      title: '播放速度',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: playbackSpeedList,
      default: 1,
    },
    ...metas,
  };

  return schema;
};

export default registerMeta;
