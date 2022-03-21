import { extra } from '@alipay/graphinsight';
const { GIAC_CONTENT_METAS, deepClone } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);

export const schema = {
  type: 'object',
  properties: {
    size: {
      title: '大小',
      type: 'number',
      widget: 'slider',
    },
    color: {
      title: '颜色',
      type: 'string',
      format: 'color',
    },
    label: {
      title: '文本',
      type: 'array',
      //todo: 显示文本属性根据 data 生成
      enum: ['top', 'bottom', 'left', 'right', 'center'],
      enumName: ['顶部', '底部', '左侧', '右侧', '中间'],
      items: {
        type: 'string',
      },
      default: 'bottom',
      widget: 'multiSelect',
    },
    icon: {
      type: 'string',
      title: '图标（选填）',
      widget: 'iconSelector',
    },
    advanced: {
      title: '高级配置',
      type: 'object',
      properties: {
        keyShape: {
          type: 'object',
          title: '主节点',
          properties: {
            stroke: {
              title: '描边',
              type: 'string',
              format: 'color',
            },
          },
        },
        label: {
          type: 'object',
          title: '文本',
          properties: {
            visible: {
              title: '是否显示文本',
              type: 'boolean',
            },
            fill: {
              title: '文本颜色',
              type: 'string',
              format: 'color',
            },
            fontSize: {
              title: '文本大小',
              type: 'number',
            },
            position: {
              title: '展示位置',
              type: 'string',
              enum: ['top', 'bottom', 'left', 'right', 'center'],
              enumName: ['顶部', '底部', '左侧', '右侧', '中间'],
              default: 'bottom',
              widget: 'select',
            },
          },
        },
        icon: {
          type: 'object',
          title: '图标',
          properties: {
            fill: {
              title: '颜色',
              type: 'string',
              format: 'color',
            },
            size: {
              title: '大小',
              type: 'number',
            },
          },
        },
        badge: {
          type: 'object',
          title: '徽标',
          properties: {
            value: {
              title: '徽标值',
              type: 'string',
            },
            color: {
              title: '背景色',
              type: 'string',
              format: 'color',
            },
          },
        },
      },
    },
  },
};

const registerMeta = context => {
  const { services } = context;
  metas.GIAC_CONTENT.name = '样式设置';

  return {
    ...metas,
  };
};

/** 默认的配置值 */
export default registerMeta;
