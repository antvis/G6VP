import { extractDefault } from '@ali/react-datav-gui-utils';

const registerMeta = context => {
  try {
    const { data, keys } = context;
    const firstNode = data.nodes[0]?.data;
    const numberKeys = Object.keys(firstNode).filter(key => {
      return typeof firstNode[key] === 'number';
    });
    const numberOptions = numberKeys.map(c => {
      return {
        value: c,
        label: c,
      };
    });
    const labelOptions = keys.map(c => {
      return {
        value: c,
        label: c,
      };
    });
    return {
      donut: {
        name: '环展示',
        type: 'group',
        enableHide: false,
        fold: false,
        children: {
          mappingKey: {
            name: '映射字段',
            type: 'checkbox',
            optionCol: 8,
            default: numberKeys,
            options: numberOptions,
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
          mappingKey: {
            name: '映射字段',
            type: 'select',
            useFont: true,
            default: 'type',
            showInPanel: {
              conditions: [['label.showlabel', '$eq', true]],
            },
            options: labelOptions,
          },
        },
      },
    };
  } catch (error) {}
};

const configObj = registerMeta({ data: {}, keys: ['id'] });
/** 默认的配置值 */
export const defaultProps = extractDefault({ config: configObj, value: {} });

export default registerMeta;
