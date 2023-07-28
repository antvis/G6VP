import { extra } from '@antv/gi-sdk';
import { TIME_GRANULARITY_LIST } from './constant';
import { playbackSpeedList } from './control/animation/constants';
import info from './info';
import type { FieldType } from './types';
import $i18n from '../i18n';

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
      title: $i18n.get({ id: 'scene.src.Timebar.registerMeta.TimeField', dm: '时间字段' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        {
          label: $i18n.get({ id: 'scene.src.Timebar.registerMeta.Node', dm: '节点' }),
          options: getProperties('nodes'),
        },
        { label: $i18n.get({ id: 'scene.src.Timebar.registerMeta.Edge', dm: '边' }), options: getProperties('edges') },
      ],
    },
    yField: {
      title: $i18n.get({ id: 'scene.src.Timebar.registerMeta.IndicatorField', dm: '指标字段' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        {
          label: $i18n.get({ id: 'scene.src.Timebar.registerMeta.Node', dm: '节点' }),
          options: getProperties('nodes'),
        },
        { label: $i18n.get({ id: 'scene.src.Timebar.registerMeta.Edge', dm: '边' }), options: getProperties('edges') },
      ],

      'x-decorator-props': {
        tooltip: $i18n.get({
          id: 'scene.src.Timebar.registerMeta.OnlyAggregateCountsAreSupported',
          dm: '非数值类型仅支持聚合计数\n确保和时间字段同属于节点或边',
        }),
      },
    },
    aggregation: {
      title: $i18n.get({ id: 'scene.src.Timebar.registerMeta.Aggregation', dm: '聚合' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        { label: $i18n.get({ id: 'scene.src.Timebar.registerMeta.Count', dm: '计数' }), value: 'count' },
        { label: $i18n.get({ id: 'scene.src.Timebar.registerMeta.Maximum', dm: '最大值' }), value: 'max' },
        { label: $i18n.get({ id: 'scene.src.Timebar.registerMeta.Mean', dm: '均值' }), value: 'mean' },
        { label: $i18n.get({ id: 'scene.src.Timebar.registerMeta.MinimumValue', dm: '最小值' }), value: 'min' },
        { label: $i18n.get({ id: 'scene.src.Timebar.registerMeta.Median', dm: '中位数' }), value: 'median' },
        { label: $i18n.get({ id: 'scene.src.Timebar.registerMeta.Summation', dm: '求和' }), value: 'sum' },
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
      title: $i18n.get({ id: 'scene.src.Timebar.registerMeta.TimeGranularity', dm: '时间粒度' }),
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
      title: $i18n.get({ id: 'scene.src.Timebar.registerMeta.PlaybackSpeed', dm: '播放速度' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: playbackSpeedList,
      default: 1,
    },
    playMode: {
      title: '播放模式',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        { label: '过滤', value: 'filter' },
        { label: '高亮', value: 'highlight' },
      ],
      default: 'filter',
    },
    ...metas,
  };

  return schema;
};

export default registerMeta;
