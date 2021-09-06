import { extractDefault } from '@ali/react-datav-gui-utils';

const registerMeta = context => {
  const { services } = context;

  return {
    /** 分类信息 */
    dragCanvas: {
      name: '拖拽画布',
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
        direction: {
          name: '方向',
          type: 'select',
          useFont: true,
          default: 'both',
          showInPanel: {
            conditions: [['.enable', '$eq', true]],
          },
        },
        enableOptimize: {
          name: '优化',
          type: 'switch',
          default: true,
          statusText: true,
          showInPanel: {
            conditions: [['.enable', '$eq', true]],
          },
        },
      },
    },
    styleCanvas: {
      name: '画布样式',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        background: {
          name: '背景色',
          type: 'fill',
          default: '#f8f9fb',
        },
        backgroundImage: {
          name: '背景图片',
          type: 'image',
          default: '',
        },
      },
    },
  };
};

const configObj = registerMeta({ data: {} });
/** 默认的配置值 */
export const defaultProps = extractDefault({ config: configObj, value: {} }) as {
  dragCanvas: {
    enable: boolean;
    direction: string;
    enableOptimize: boolean;
  };
  styleCanvas: {
    background: string;
    backgroundImage: string;
  };
};

export default registerMeta;
