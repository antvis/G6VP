import $i18n from '../../i18n';
const registerMeta = context => {
  const presetOptions = [
    {
      label: $i18n.get({ id: 'basic.layouts.GraphinForce.registerMeta.GridLayout', dm: '网格布局' }),
      value: 'grid',
    },
    {
      label: $i18n.get({ id: 'basic.layouts.GraphinForce.registerMeta.CircularLayout', dm: '环形布局' }),
      value: 'circular',
    },
    {
      label: $i18n.get({ id: 'basic.layouts.GraphinForce.registerMeta.ConcentricCircleLayout', dm: '同心圆布局' }),
      value: 'concentric',
    },
    {
      label: $i18n.get({ id: 'basic.layouts.GraphinForce.registerMeta.DirectedLayering', dm: '有向分层' }),
      value: 'dagre',
    },
  ];

  return {
    stiffness: {
      type: 'number',
      title: $i18n.get({
        id: 'basic.layouts.GraphinForce.registerMeta.SpringStiffnessCoefficient',
        dm: '弹簧劲度系数',
      }),
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        step: 1,
      },
      default: 200,
    },
    repulsion: {
      title: $i18n.get({
        id: 'basic.layouts.GraphinForce.registerMeta.CullenConstantKeRepulsion',
        dm: '库伦常量Ke（斥力）',
      }),
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {},
      default: 1000,
    },
    damping: {
      title: $i18n.get({ id: 'basic.layouts.GraphinForce.registerMeta.DampingCoefficient', dm: '阻尼系数' }),
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        step: 0.1,
        min: 0,
        max: 1,
      },
      default: 0.9,
    },
    animation: {
      title: $i18n.get({ id: 'basic.layouts.GraphinForce.registerMeta.EnableAnimation', dm: '启用动画' }),
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    preset: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          title: $i18n.get({ id: 'basic.layouts.GraphinForce.registerMeta.FrontLayout', dm: '前置布局' }),
          'x-component': 'Select',
          'x-decorator': 'FormItem',
          'x-component-props': {
            options: presetOptions,
          },
          default: 'concentric',
        },
      },
    },
    defSpringLenCfg: {
      type: 'object',
      properties: {
        minLimitDegree: {
          title: $i18n.get({ id: 'basic.layouts.GraphinForce.registerMeta.MinimumLimitDegree', dm: '最小界限度数' }),
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 5,
        },
        maxLimitLength: {
          title: $i18n.get({
            id: 'basic.layouts.GraphinForce.registerMeta.MaximumLimitSideLength',
            dm: '最大限制边长',
          }),
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 500,
        },
        defaultSpring: {
          title: $i18n.get({ id: 'basic.layouts.GraphinForce.registerMeta.DefaultSideLength', dm: '默认边长' }),
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 100,
        },
      },
    },
    centripetalOptions: {
      type: 'object',
      properties: {
        leaf: {
          title: $i18n.get({ id: 'basic.layouts.GraphinForce.registerMeta.LeafNode', dm: '叶子节点' }),
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 2,
        },
        single: {
          title: $i18n.get({ id: 'basic.layouts.GraphinForce.registerMeta.IsolatedNode', dm: '孤立节点' }),
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 2,
        },
        others: {
          title: $i18n.get({ id: 'basic.layouts.GraphinForce.registerMeta.OtherNodes', dm: '其他节点' }),
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 1,
        },
        // center: {
        //   title: '中心节点',
        //   type: 'string',
        //   'x-decorator': 'FormItem',
        //   'x-component': 'Input.TextArea',
        //   default: `(_node) => {
        //     return {
        //       x: 400,
        //       y: 200,
        //     };
        //   }`,
        // },
      },
    },
  };
};

export default registerMeta;
