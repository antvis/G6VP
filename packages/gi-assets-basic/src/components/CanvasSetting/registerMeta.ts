import { extractDefault } from '@ali/react-datav-gui-utils';

const registerMeta = context => {
  const { services } = context;

  return {
    /** 分类信息 */

    styleCanvas: {
      name: '画布样式',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        background: {
          name: '背景色',
          type: 'fill',
          default: '#fff',
        },
        backgroundImage: {
          name: '背景图片',
          type: 'image',
          default: '',
        },
      },
    },
    dragCanvas: {
      name: '拖拽画布',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        disabled: {
          name: '禁用',
          type: 'switch',
          default: false,
          statusText: false,
        },
        direction: {
          name: '方向',
          type: 'select',
          options: [
            {
              label: '自由',
              value: 'both',
            },
            {
              label: 'X方向',
              value: 'x',
            },
            {
              label: 'Y方向',
              value: 'y',
            },
          ],
          default: 'both',
          showInPanel: {
            conditions: [['.disabled', '$eq', false]],
          },
        },
        enableOptimize: {
          name: '优化',
          type: 'switch',
          default: false,
          statusText: false,
          showInPanel: {
            conditions: [['.disabled', '$eq', false]],
          },
        },
      },
    },
    zoomCanvas: {
      name: '缩放画布',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        disabled: {
          name: '禁用',
          type: 'switch',
          default: false,
          statusText: false,
        },
        enableOptimize: {
          name: '优化',
          type: 'switch',
          default: true,
          statusText: true,
          showInPanel: {
            conditions: [['.disabled', '$eq', false]],
          },
        },
      },
    },
    elementInteraction: {
      name: '元素交互',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        enableNodeHover: {
          name: '节点悬停',
          type: 'switch',
          default: true,
          statusText: true,
        },
        enableEdgeHover: {
          name: '边悬停',
          type: 'switch',
          default: false,
          statusText: false,
        },
      },
    },
    highlight: {
      name: '高亮交互',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        enable: {
          name: '是否启用',
          type: 'switch',
          default: true,
          statusText: true,
        },
        trigger: {
          name: '触发方式',
          type: 'radio',
          options: [
            {
              label: '点击',
              value: 'click',
            },
            {
              label: 'Hover',
              value: 'mouseenter',
            },
          ],
          default: 'click',
        },
      },
    },
  };
};

const configObj = registerMeta({ data: {} });
/** 默认的配置值 */
export const defaultProps = extractDefault({ config: configObj, value: {} }) as any;

export default registerMeta;
