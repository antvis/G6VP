import { extra } from '@antv/gi-sdk';

const { GIAC_CONTENT_METAS } = extra;

const registerMeta = context => {
  return {
    /** 分类信息 */
    ...GIAC_CONTENT_METAS,
    // visible: {
    //   name: '默认显示',
    //   type: 'switch',
    //   default: false,
    // },
    // placement: {
    //   name: '组件位置',
    //   type: 'select',
    //   default: 'LT',
    //   options: [
    //     {
    //       value: 'LT',
    //       label: '左上',
    //     },
    //     {
    //       value: 'RT',
    //       label: '右上',
    //     },
    //     {
    //       value: 'LB',
    //       label: '左下',
    //     },
    //     {
    //       value: 'RB',
    //       label: '右下',
    //     },
    //   ],
    //   showInPanel: {
    //     conditions: [['.visible', '$eq', true]],
    //   },
    // },
    // offset: {
    //   name: '偏移距离',
    //   type: 'Offset',
    //   min: 0,
    //   max: 400,
    //   default: [0, 0],
    //   showInPanel: {
    //     conditions: [['.visible', '$eq', true]],
    //   },
    // },
    // /** GI原子组件 */
    // GI_CONTAINER_INDEX: {
    //   name: '容器索引',
    //   type: 'stepper',
    //   default: 0,
    //   showInPanel: {
    //     conditions: [['.visible', '$eq', false]],
    //   },
    // },
    // hasDivider: {
    //   name: '分隔符',
    //   type: 'switch',
    //   default: false,
    //   showInPanel: {
    //     conditions: [['.visible', '$eq', false]],
    //   },
    // },
    // color: {
    //   name: '提示颜色',
    //   type: 'fill',
    //   default: '#87d068',
    //   showInPanel: {
    //     conditions: [['.visible', '$eq', false]],
    //   },
    // },
  };
};

export default registerMeta;
