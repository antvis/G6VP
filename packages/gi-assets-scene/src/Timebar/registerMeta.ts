import { extra } from '@antv/gi-sdk';
import { playbackSpeedList } from './control/animation/constants';
import { TIME_GRANULARITY_LIST } from './constant';
// import { getTimeRange } from './TimelineControl/utils';
import info from './info';

const { deepClone, GIAC_CONTENT_METAS } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = info.name;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = info.icon;

const registerMeta = ({ schemaData }) => {
  const getProperties = (type: 'nodes' | 'edges', dataType?: string) => {
    return Object.entries<string>(
      schemaData[type].reduce((acc, cur) => {
        return {
          ...acc,
          ...cur.properties,
        };
      }, {})
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
        { label: '节点', options: getProperties('nodes', 'number') },
        { label: '边', options: getProperties('edges', 'number') },
      ],
      'x-decorator-props': {
        tooltip: '数值类型，且与时间字段同属于节点或边',
      },
    },
    aggregation: {
      title: '聚合',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        { label: '数值', value: 'value' },
        { label: '计数', value: 'count' },
        { label: '均值', value: 'mean' },
      ],
      'x-decorator-props': {
        tooltip: '选择数值或类型时需指定指标字段',
      },
      default: 'value',
    },
    timeRange: {
      title: '时间范围',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'DatePicker.RangePicker',
      'x-component-props': {
        showTime: true,
      },
    },
    defaultTimeRange: {
      title: '默认时间范围',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'DatePicker.RangePicker',
    },
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
    defaultPlay: {
      title: '默认播放',
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: false,
    },
    ...metas,
  };

  return schema;
};

export default registerMeta;
