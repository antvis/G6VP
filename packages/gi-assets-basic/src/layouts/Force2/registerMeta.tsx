const registerMeta = context => {
  const { schemaData, keys } = context;
  const nodeProperties = schemaData.nodes.reduce((acc, cur) => {
    return {
      ...acc,
      ...cur.properties,
    };
  }, {});
  const presetOptions = [
    {
      label: '网格布局',
      value: 'grid',
    },
    {
      label: '环形布局',
      value: 'circular',
    },
    {
      label: '同心圆布局',
      value: 'concentric',
    },
    {
      label: '有向分层',
      value: 'dagre',
    },
  ];
  const weightScaleOptions = [
    {
      label: '原始值',
      value: 1,
    },
    {
      label: '开平方',
      value: 'sqrt',
    },
    {
      label: '平方',
      value: 'sqr',
    },
    {
      label: '倒数',
      value: 'reciprocal',
    },
    {
      label: 'log2',
      value: 'log2',
    },
    {
      label: 'log10',
      value: 'log10',
    },
  ];
  const directedWeightOptions = keys.filter(k => nodeProperties[k] === 'number').map(k => ({ label: k, value: k }));

  return {
    edgeStrength: {
      type: 'number',
      title: '边引力系数',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        step: 1,
      },
      default: 200,
    },
    nodeStrength: {
      title: '节点间斥力系数',
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
      default: 0.8,
    },
    animate: {
      title: '启用动画',
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: context.data?.nodes?.length > 800 ? false : true,
    },
    preset: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          title: '前置布局',
          'x-component': 'Select',
          'x-decorator': 'FormItem',
          'x-component-props': {
            options: presetOptions,
          },
          default: 'concentric',
        },
        width: {
          title: '预设布局宽度',
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 800,
        },
        height: {
          title: '预设布局高度',
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 800,
        },
      },
    },
    defSpringLenCfg: {
      type: 'object',
      properties: {
        minLimitDegree: {
          title: '最小界限度数',
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 5,
        },
        maxLimitLength: {
          title: '最大限制边长',
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 500,
        },
        defaultSpring: {
          title: '默认边长',
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 100,
        },
      },
    },
    clusterNodeStrength: {
      title: '节点聚类力强度',
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {},
      default: 35,
    },
    minMovement: {
      title: '迭代停止最小距离',
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {},
      default: context.data?.nodes?.length > 200 ? 10 : 2,
    },
    distanceThresholdMode: {
      title: '迭代停止判断依据',
      type: 'string',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-component-props': {
        options: [
          {
            label: '平均值',
            value: 'mean',
          },
          {
            label: '最小值',
            value: 'min',
          },
          {
            label: '最大值',
            value: 'max',
          },
        ],
      },
      default: 'max',
    },
    maxSpeed: {
      title: '初始速度',
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {},
      default: 1000,
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

    advanceWeight: {
      title: '权重高级配置',
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: false,
      'x-reactions': [
        'edgeWeightField',
        'edgeWeightFieldScale',
        'nodeWeightFromType',
        'nodeWeightField',
        'nodeWeightFieldFromEdge',
        'nodeWeightFieldScale',
        'directed',
        'directedFromType',
        'directedInWeightField',
        'directedOutWeightField',
        'directedAmountFromEdge',
        'directedIsLog',
        'directedMultiple',
      ].map(target => ({
        target,
        fulfill: {
          state: {
            visible: '{{$self.value}}',
          },
        },
      })),
    },
    edgeWeightField: {
      type: 'string',
      title: '引力权重关联',
      'x-decorator': 'FormItem',
      'x-component': 'GroupSelect',
      'x-component-props': {
        mode: 'multiple',
        schemaData: schemaData.edges,
      },
    },
    edgeWeightFieldScale: {
      type: 'string',
      title: '引力权重关联归一',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-component-props': {
        options: weightScaleOptions,
      },
      default: 1,
    },
    nodeWeightFromType: {
      title: '斥力关联类型',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component-props': {},
      'x-component': 'Radio.Group',
      enum: [
        {
          label: '节点属性',
          value: 'node',
        },
        {
          label: '相关边属性加和',
          value: 'edge',
        },
      ],
      default: 'node',
      'x-reactions': [
        {
          target: 'nodeWeightField',
          fulfill: {
            state: {
              visible: '{{$self.value === "node"}}',
            },
          },
        },
        {
          target: 'nodeWeightFieldFromEdge',
          fulfill: {
            state: {
              visible: '{{$self.value === "edge"}}',
            },
          },
        },
      ],
    },
    nodeWeightField: {
      type: 'string',
      title: '斥力权重关联',
      'x-decorator': 'FormItem',
      'x-component': 'GroupSelect',
      'x-component-props': {
        mode: 'multiple',
        schemaData: schemaData.nodes,
      },
      showInPanel: {
        conditions: [['.nodeWeightFromType', '$eq', 'node']],
      },
    },
    nodeWeightFieldFromEdge: {
      type: 'string',
      title: '斥力权重关联',
      'x-decorator': 'FormItem',
      'x-component': 'GroupSelect',
      'x-component-props': {
        mode: 'multiple',
        schemaData: schemaData.edges,
      },
      showInPanel: {
        conditions: [['.nodeWeightFromType', '$eq', 'edge']],
      },
    },
    nodeWeightFieldScale: {
      type: 'string',
      title: '斥力权重关联归一',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-component-props': {
        options: weightScaleOptions,
      },
      default: 1,
    },
    directed: {
      title: '启用有向力',
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: false,
      'x-reactions': [
        {
          target: 'directedFromType',
          fulfill: {
            state: {
              visible: '{{$self.value}}',
            },
          },
        },
        {
          target: 'directedIsLog',
          fulfill: {
            state: {
              visible: '{{$self.value}}',
            },
          },
        },
        {
          target: 'directedMultiple',
          fulfill: {
            state: {
              visible: '{{$self.value}}',
            },
          },
        },
      ],
    },

    directedFromType: {
      title: '资金关联元素',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component-props': {},
      'x-component': 'Radio.Group',
      enum: [
        {
          label: '节点属性',
          value: 'node',
        },
        {
          label: '相关边属性加和',
          value: 'edge',
        },
      ],
      default: 'node',
      'x-reactions': [
        {
          dependencies: ['directed'],
          target: 'directedInWeightField',
          fulfill: {
            state: {
              visible: '{{$deps[0] && $self.value === "node"}}',
            },
          },
        },
        {
          dependencies: ['directed'],
          target: 'directedOutWeightField',
          fulfill: {
            state: {
              visible: '{{$deps[0] && $self.value === "node"}}',
            },
          },
        },
        {
          dependencies: ['directed'],
          target: 'directedAmountFromEdge',
          fulfill: {
            state: {
              visible: '{{$deps[0] && $self.value === "edge"}}',
            },
          },
        },
      ],
    },
    directedInWeightField: {
      title: '入权重字段',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-component-props': {
        mode: 'multiple',
        schemaData: schemaData.edges,
      },
      default: directedWeightOptions[0]?.value,
    },
    directedOutWeightField: {
      title: '出权重字段',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-component-props': {
        mode: 'multiple',
        schemaData: schemaData.edges,
      },
      default: directedWeightOptions[0]?.value,
    },
    directedAmountFromEdge: {
      type: 'string',
      title: '相关边属性',
      'x-decorator': 'FormItem',
      'x-component': 'GroupSelect',
      'x-component-props': {
        mode: 'multiple',
        schemaData: schemaData.edges,
      },
    },
    directedIsLog: {
      title: 'log 映射',
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    directedMultiple: {
      title: '倍数映射',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: '0.1',
    },
  };
};

export default registerMeta;
