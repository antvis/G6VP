import $i18n from '../../i18n';
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
      label: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.GridLayout', dm: '网格布局' }),
      value: 'grid',
    },
    {
      label: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.CircularLayout', dm: '环形布局' }),
      value: 'circular',
    },
    {
      label: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.ConcentricCircleLayout', dm: '同心圆布局' }),
      value: 'concentric',
    },
    {
      label: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.DirectedLayering', dm: '有向分层' }),
      value: 'dagre',
    },
  ];

  const weightScaleOptions = [
    {
      label: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.OriginalValue', dm: '原始值' }),
      value: 1,
    },
    {
      label: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.Square', dm: '开平方' }),
      value: 'sqrt',
    },
    {
      label: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.Square.1', dm: '平方' }),
      value: 'sqr',
    },
    {
      label: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.Reciprocal', dm: '倒数' }),
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
      title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.EdgeGravityCoefficient', dm: '边引力系数' }),
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        step: 1,
      },
      default: Math.max(context.data?.nodes?.length, 200),
    },
    nodeStrength: {
      title: $i18n.get({
        id: 'basic.layouts.Force2.registerMeta.RepulsionCoefficientBetweenNodes',
        dm: '节点间斥力系数',
      }),
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {},
      default: 1000,
    },
    damping: {
      title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.DampingCoefficient', dm: '阻尼系数' }),
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
    animated: {
      title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.EnableAnimation', dm: '启用动画' }),
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: false,
    },
    presetLayout: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.FrontLayout', dm: '前置布局' }),
          'x-component': 'Select',
          'x-decorator': 'FormItem',
          'x-component-props': {
            options: presetOptions,
          },
          default: 'dagre',
        },
        width: {
          title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.PresetLayoutWidth', dm: '预设布局宽度' }),
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 800,
        },
        height: {
          title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.PresetLayoutHeight', dm: '预设布局高度' }),
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
          title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.MinimumLimitDegree', dm: '最小界限度数' }),
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 5,
        },
        maxLimitLength: {
          title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.MaximumLimitSideLength', dm: '最大限制边长' }),
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 500,
        },
        defaultSpring: {
          title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.DefaultSideLength', dm: '默认边长' }),
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 100,
        },
      },
    },
    clusterNodeStrength: {
      title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.NodeClusteringStrength', dm: '节点聚类力强度' }),
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {},
      default: 35,
    },
    minMovement: {
      title: $i18n.get({
        id: 'basic.layouts.Force2.registerMeta.MinimumDistanceOfIterationStop',
        dm: '迭代停止最小距离',
      }),
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {},
      default: context.data?.nodes?.length > 2000 ? 10 : 0.5,
    },
    distanceThresholdMode: {
      title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.IterationStopJudgmentBasis', dm: '迭代停止判断依据' }),
      type: 'string',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-component-props': {
        options: [
          {
            label: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.Average', dm: '平均值' }),
            value: 'mean',
          },
          {
            label: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.MinimumValue', dm: '最小值' }),
            value: 'min',
          },
          {
            label: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.Maximum', dm: '最大值' }),
            value: 'max',
          },
        ],
      },
      default: 'max',
    },
    maxSpeed: {
      title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.InitialVelocity', dm: '初始速度' }),
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {},
      default: 2000,
    },
    centripetalOptions: {
      type: 'object',
      properties: {
        leaf: {
          title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.LeafNode', dm: '叶子节点' }),
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 2,
        },
        single: {
          title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.IsolatedNode', dm: '孤立节点' }),
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 2,
        },
        others: {
          title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.OtherNodes', dm: '其他节点' }),
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
      title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.AdvancedWeightConfiguration', dm: '权重高级配置' }),
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
      title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.GravityWeightAssociation', dm: '引力权重关联' }),
      'x-decorator': 'FormItem',
      'x-component': 'GroupSelect',
      'x-component-props': {
        mode: 'multiple',
        schemaData: schemaData.edges,
      },
    },
    edgeWeightFieldScale: {
      type: 'string',
      title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.GravityWeightAssociation.1', dm: '引力权重关联归一' }),
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-component-props': {
        options: weightScaleOptions,
      },
      default: 1,
    },
    nodeWeightFromType: {
      title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.RepulsionAssociationType', dm: '斥力关联类型' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component-props': {},
      'x-component': 'Radio.Group',
      enum: [
        {
          label: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.NodeProperties', dm: '节点属性' }),
          value: 'node',
        },
        {
          label: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.AddAndAddRelatedEdge', dm: '相关边属性加和' }),
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
      title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.RepulsionWeightAssociation', dm: '斥力权重关联' }),
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
      title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.RepulsionWeightAssociation', dm: '斥力权重关联' }),
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
      title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.RepulsiveWeightAssociation', dm: '斥力权重关联归一' }),
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-component-props': {
        options: weightScaleOptions,
      },
      default: 1,
    },
    directed: {
      title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.EnableDirectionalForce', dm: '启用有向力' }),
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
      title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.CapitalAssociationElements', dm: '资金关联元素' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component-props': {},
      'x-component': 'Radio.Group',
      enum: [
        {
          label: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.NodeProperties', dm: '节点属性' }),
          value: 'node',
        },
        {
          label: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.AddAndAddRelatedEdge', dm: '相关边属性加和' }),
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
      title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.EnterWeightField', dm: '入权重字段' }),
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-component-props': {
        mode: 'multiple',
        schemaData: schemaData.edges,
      },
      default: directedWeightOptions[0]?.value,
    },
    directedOutWeightField: {
      title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.OutputWeightField', dm: '出权重字段' }),
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
      title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.RelatedEdgeProperties', dm: '相关边属性' }),
      'x-decorator': 'FormItem',
      'x-component': 'GroupSelect',
      'x-component-props': {
        mode: 'multiple',
        schemaData: schemaData.edges,
      },
    },
    directedIsLog: {
      title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.LogMapping', dm: 'log 映射' }),
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    directedMultiple: {
      title: $i18n.get({ id: 'basic.layouts.Force2.registerMeta.MultipleMapping', dm: '倍数映射' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: '0.1',
    },
  };
};

export default registerMeta;
