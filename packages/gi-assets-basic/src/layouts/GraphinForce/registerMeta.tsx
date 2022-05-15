const registerMeta = context => {
  return {
    stiffness: {
      type: 'number',
      title: '弹簧劲度系数',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        step: 1,
      },
      default: 200,
    },
    repulsion: {
      title: '库伦常量Ke（斥力）',
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {},
      default: 1000,
    },
    damping: {
      title: '阻尼系数',
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
      title: '启用动画',
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },

    defSpringLen: {
      title: '默认边长',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-component-props': {},
      default: `(_edge, source, target) => {
        /** 默认返回的是 200 的弹簧长度 */
        /** 如果你要想要产生聚类的效果，可以考虑 根据边两边节点的度数来动态设置边的初始化长度：度数越小，则边越短 */
        const defaultSpring = 100;
        const Sdegree = source.data.layout.degree;
        const Tdegree = target.data.layout.degree;
        const MinDegree = Math.min(Sdegree, Tdegree);

        let SpringLength = defaultSpring;
        if (MinDegree < 5) {
          SpringLength = defaultSpring * MinDegree;
        } else {
          SpringLength = 500;
        }
        return SpringLength;
      }`,
    },
    centripetalOptions: {
      type: 'object',
      properties: {
        leaf: {
          title: '叶子节点',
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 2,
        },
        single: {
          title: '孤立节点',
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 2,
        },
        others: {
          title: '其他节点',
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
