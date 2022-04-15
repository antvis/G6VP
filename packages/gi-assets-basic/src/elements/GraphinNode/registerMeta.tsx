import { extractDefault } from '@ali/react-datav-gui-utils';

const registerMeta = context => {
  const { data, keys = ['id', 'type'] } = context;
  const options = keys.map(c => {
    return {
      value: c,
      label: c,
    };
  });

  return {
    color: {
      name: '颜色',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        colorMapping: {
          name: '填充颜色',
          type: 'colorMapping',
          fixedComponents: ['flat'],
          valuePath: 'color',
          default: {
            mapping: false,
            fixed: '#3056E3',
            scale: {
              type: 'ordinal',
              scheme: 'cat-1',
              custom: true,
              range: [
                '#3056E3',
                '#CB6EF8',
                '#82E6C7',
                '#F6D87B',
                '#F69F7F',
                '#E96075',
                '#F58CCB',
                '#795AE1',
                '#622CD8',
                '#85C98E',
                '#3E34E5',
                '#2959C1',
                '#4D92DE',
                '#5CB5D4',
                '#B9D569',
              ],
              domain: [],
              excepted: '#666',
              abnormal: '#f31200',
              pin: [false, true],
            },
          },
        },
        keyMapping: {
          name: '映射字段',
          type: 'select',
          useFont: true,
          default: 'type',
          showInPanel: {
            conditions: [
              ['color.scale.custom', '$eq', true],
              ['color.mapping', '$eq', true],
            ],
            logicalType: '$and',
          },
          valuePath: 'color.key',
          options,
        },
        opacity: {
          name: '透明度',
          type: 'stepper',
          default: 0.3,
          step: 1,
          min: 0,
          max: 1,
          suffix: '',
        },
      },
    },
    size: {
      name: '大小',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        sizeMapping: {
          name: '半径',
          type: 'sizeMapping',
          min: 0,
          max: 100,
          step: 1,
          suffix: 'px',
          valuePath: 'size',
          default: {
            mapping: false,
            fixed: 26,
            scale: {
              custom: false, // 是否采取自定义映射
              range: [3, 30], // 值域
              domain: [0, 1000], // 定义域
              abnormal: 1,
            },
          },
        },
        keyMapping: {
          name: '映射字段',
          type: 'select',
          useFont: true,
          default: 'amount',
          options,
          showInPanel: {
            conditions: [['size.mapping', '$eq', true]],
          },
          valuePath: 'size.key',
        },
      },
    },

    label: {
      name: '标签',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        enable: {
          name: '开关',
          type: 'switch',
          default: true,
          statusText: true,
        },
        key: {
          name: '映射字段',
          type: 'select',
          useFont: true,
          default: 'type',
          showInPanel: {
            conditions: [['.enable', '$eq', true]],
          },
          options,
        },
        color: {
          name: '颜色',
          type: 'fill',
          default: '#000',
          valuePath: 'label.color',
          showInPanel: {
            conditions: [['.enable', '$eq', true]],
          },
        },
      },
    },
    icon: {
      name: '图标',
      type: 'group',
      enableHide: false,
      fold: true,
      children: {
        enable: {
          type: 'switch',
          name: '开关',
          statusText: true,
          default: false,
        },
        type: {
          name: '类型',
          type: 'buttonRadio',
          useFont: true,
          default: 'text',
          showInPanel: {
            conditions: [['.enable', '$eq', true]],
          },
          options: [
            {
              value: 'text',
              label: '文本',
            },
            {
              value: 'image',
              label: '图片',
            },
            {
              value: 'font',
              label: '字体图标',
            },
          ],
        },
        key: {
          name: '映射字段',
          type: 'select',
          default: 'id',
          options,
          showInPanel: {
            conditions: [['.enable', '$eq', true]],
          },
        },
      },
    },
    halo: {
      name: '光晕',
      type: 'group',
      enableHide: false,
      fold: true,
      children: {
        enable: {
          name: '开关',
          type: 'switch',
          default: true,
          statusText: true,
        },
        lineWidth: {
          name: '宽度',
          type: 'stepper',
          default: 0,
          step: 1,
          min: 0,
          max: 15,
          suffix: 'px',
          showInPanel: {
            conditions: [['.enable', '$eq', true]],
          },
        },
        opacity: {
          name: '透明度',
          type: 'stepper',
          default: 0.1,
          step: 1,
          min: 0,
          max: 15,
          suffix: '',
          showInPanel: {
            conditions: [['.enable', '$eq', true]],
          },
        },
      },
    },
    badges: {
      name: '辉标',
      type: 'group',
      enableHide: false,
      fold: true,
      children: {
        enable: {
          name: '开关',
          type: 'switch',
          default: false,
          statusText: true,
        },
        key: {
          name: '映射字段',
          type: 'select',
          default: 'badges',
          options,
          showInPanel: {
            conditions: [['.enable', '$eq', true]],
          },
        },
        fill: {
          name: '填充色',
          type: 'fill',
          default: '#ddd',
          showInPanel: {
            conditions: [['.enable', '$eq', true]],
          },
        },
        color: {
          name: '文本色',
          type: 'color',
          default: '#fff',
          showInPanel: {
            conditions: [['.enable', '$eq', true]],
          },
        },
        size: {
          name: '尺寸',
          type: 'stepper',
          default: 10,
          showInPanel: {
            conditions: [['.enable', '$eq', true]],
          },
        },
      },
    },
  };
};

const configObj = registerMeta({ data: {}, keys: ['id'] });
/** 默认的配置值 */
export const defaultProps = extractDefault({ config: configObj, value: {} });

export default registerMeta;
