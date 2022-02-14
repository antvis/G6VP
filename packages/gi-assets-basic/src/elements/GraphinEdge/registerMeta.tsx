import { extractDefault } from '@ali/react-datav-gui-utils';
const registerMeta = context => {
  const { data, keys } = context;

  const options = keys.map(c => {
    return {
      value: c,
      label: c,
    };
  });

  return {
    size: {
      name: '边宽',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        sizeMapping: {
          name: '宽度',
          type: 'sizeMapping',
          min: 0,
          max: 50,
          step: 1,
          suffix: 'px',
          valuePath: 'size',
          default: {
            mapping: false,
            fixed: 0.5,
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
            conditions: [
              ['size.scale.custom', '$eq', true],
              ['size.mapping', '$eq', true],
            ],
            logicalType: '$and',
          },
          valuePath: 'size.key',
        },
      },
    },
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
            fixed: '#ddd',
            scale: {
              type: 'ordinal',
              scheme: 'cat-1',
              custom: true,
              range: [
                '#ddd',
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
          options,
          showInPanel: {
            conditions: [['color.mapping', '$eq', true]],
            logicalType: '$and',
          },
          valuePath: 'color.key',
        },
      },
    },
    multilple: {
      name: '多边设置',
      type: 'group',
      enableHide: false,
      fold: true,
      children: {
        enable: {
          name: '是否开启',
          type: 'switch',
          default: true,
          statusText: true,
        },
        poly: {
          name: '曲线间隔',
          type: 'stepper',
          min: 0,
          max: 100,
          default: 50,
          showInPanel: {
            conditions: [['.enable', '$eq', true]],
          },
        },
        loop: {
          name: '自环间隔',
          type: 'stepper',
          min: 0,
          max: 50,
          default: 10,
          showInPanel: {
            conditions: [['.enable', '$eq', true]],
          },
        },
      },
    },

    dash: {
      name: '虚线样式',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        showdash: {
          name: '虚线样式',
          type: 'switch',
          default: false,
          statusText: true,
        },
        dashMapping: {
          name: '虚线长度',
          type: 'sizeMapping',
          min: 0,
          max: 10,
          step: 1,
          suffix: 'px',
          valuePath: 'dash.length',
          default: {
            fixed: 3,
          },
          showInPanel: {
            conditions: [['dash.showdash', '$eq', true]],
          },
        },
      },
    },
    label: {
      name: '标签',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        showlabel: {
          name: '开关',
          type: 'switch',
          default: true,
          statusText: true,
        },
        keyLabel: {
          name: '映射字段',
          type: 'select',
          useFont: true,
          default: 'label',
          valuePath: 'label.key',
          showInPanel: {
            conditions: [['label.showlabel', '$eq', true]],
          },
          options,
        },
        labelColor: {
          name: '颜色',
          valuePath: 'label.fill',
          type: 'colorMapping',
          fixedComponents: ['flat'],
          default: {
            mapping: false,
            fixed: '#d9d9d9',
          },
          showInPanel: {
            conditions: [['label.showlabel', '$eq', true]],
          },
        },
        labelBg: {
          name: '背景色',
          valuePath: 'label.background',
          type: 'colorMapping',
          fixedComponents: ['flat'],
          default: {
            mapping: false,
            fixed: '#fff',
          },
          showInPanel: {
            conditions: [['label.showlabel', '$eq', true]],
          },
        },
        labelBorder: {
          name: '边框',
          valuePath: 'label.border',
          type: 'colorMapping',
          fixedComponents: ['flat'],
          default: {
            mapping: false,
            fixed: '',
          },
          showInPanel: {
            conditions: [['label.showlabel', '$eq', true]],
          },
        },
        labelPos: {
          name: '偏移',
          type: 'sizeMapping',
          min: -10,
          max: 10,
          step: 1,
          suffix: 'px',
          valuePath: 'label.offest',
          default: {
            fixed: 0,
          },
          showInPanel: {
            conditions: [['label.showlabel', '$eq', true]],
          },
        },
      },
    },
    halo: {
      name: '光晕',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        showhalo: {
          name: '开关',
          type: 'switch',
          default: false,
          statusText: true,
        },
      },
    },
  };
};

export default registerMeta;
const configObj = registerMeta({ data: {}, keys: ['source', 'target'] });
/** 默认的配置值 */
export const defaultProps = extractDefault({ config: configObj, value: {} });
