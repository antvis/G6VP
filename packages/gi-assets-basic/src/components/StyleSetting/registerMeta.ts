import { extra } from '@alipay/graphinsight';
const { GIAC_CONTENT_METAS, deepClone } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);

export const schema = {
  type: 'object',
  properties: {
    size: {
      title: '大小',
      type: 'object',
      properties: {
        r: {
          title: '半径',
          type: 'number',
          widget: 'slider',
        },
      },
    },
    color: {
      title: '颜色',
      type: 'object',
      properties: {
        fill: {
          title: '填充',
          type: 'string',
          format: 'color',
        },
        stroke: {
          title: '边框',
          type: 'string',
          format: 'color',
        },
      },
    },
    label: {
      title: '标签',
      type: 'object',
      properties: {
        visible: {
          title: '是否显示',
          type: 'boolean',
        },
        value: {
          title: '显示文本',
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
        fill: {
          title: '颜色配置',
          type: 'string',
          format: 'color',
        },
        fontSize: {
          title: '文本大小',
          type: 'number',
          min: 12,
          max: 100,
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
      title: '图标',
      type: 'object',
      properties: {
        iconStyle: {
          title: '图标样式',
          type: 'string',
          enum: ['circle', 'rect'],
          enumName: ['圆形', '矩形'],
          widget: 'radio',
        },
      },
    },
    badges: {
      title: '徽标',
      type: 'object',
      properties: {
        value: {
          title: '徽标值',
          type: 'string',
        },
        fill: {
          title: '填充',
          type: 'string',
          format: 'color',
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
