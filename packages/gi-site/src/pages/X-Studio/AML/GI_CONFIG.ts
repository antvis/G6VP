/**  由GI平台自动生成的，请勿修改 start **/

export const GI_SERVICES_OPTIONS = [
  {
    id: 'GI_SERVICE_INTIAL_GRAPH',
    content:
      'export default (localData)=>{\n      return new Promise((resolve)=>{\n        resolve(localData)\n      })\n    }',
    mode: 'MOCK',
    name: '初始化接口',
  },
  {
    id: 'Mock/PropertiesPanel',
    mode: 'MOCK',
    name: 'Mock/PropertiesPanel',
    content:
      'export default function service(params, localData) {\n      var data = params.data;\n      return new Promise(function (resolve) {\n        return resolve(data);\n      });\n    }',
  },
];
export const GI_PROJECT_CONFIG = {
  nodes: [
    {
      id: 'SimpleNode',
      props: {
        size: 26,
        color: '#ddd',
        label: [],
      },
      groupName: '默认样式',
      expressions: [],
      logic: true,
    },
    {
      id: 'SimpleNode',
      props: {
        size: 26,
        color: 'rgba(0,0,0,1)',
        label: [],
        advanced: {
          icon: {
            type: 'font',
            value: 'bank',
            fill: '#fff',
            visible: true,
          },
          keyshape: {
            fillOpacity: 0.8,
          },
          label: {
            visible: true,
            fill: '#000',
            fontSize: 12,
            position: 'bottom',
          },
          badge: {
            visible: false,
          },
        },
      },
      groupName: 'CARD TYPE',
      expressions: [
        {
          name: 'type',
          operator: 'eql',
          value: 'card',
        },
      ],
      logic: true,
    },
    {
      id: 'SimpleNode',
      props: {
        size: 26,
        color: '#3056E3',
        label: ['alipay.id'],
        advanced: {
          icon: {
            type: 'font',
            value: 'alipay',
            fill: '#fff',
            visible: true,
          },
          keyshape: {
            fillOpacity: 0.8,
          },
          label: {
            visible: true,
            fill: '#000',
            fontSize: 12,
            position: 'bottom',
          },
          badge: {
            visible: false,
          },
        },
      },
      groupName: 'ALIPAY TYPE',
      expressions: [
        {
          name: 'type',
          operator: 'eql',
          value: 'alipay',
        },
      ],
      logic: true,
    },
    {
      id: 'SimpleNode',
      props: {
        size: 26,
        color: '#82E6C7',
        label: [],
        advanced: {
          icon: {
            type: 'font',
            value: 'solution',
            fill: '#fff',
            visible: true,
          },
          keyshape: {
            fillOpacity: 0.8,
          },
          label: {
            visible: true,
            fill: '#000',
            fontSize: 12,
            position: 'bottom',
          },
          badge: {
            visible: false,
          },
        },
      },
      groupName: 'YYZZ TYPE',
      expressions: [
        {
          name: 'type',
          operator: 'eql',
          value: 'YYZZ',
        },
      ],
      logic: true,
    },
    {
      id: 'SimpleNode',
      props: {
        size: 26,
        color: '#F6D87B',
        label: ['company.id'],
        advanced: {
          icon: {
            type: 'font',
            value: 'company',
            fill: '#fff',
            visible: true,
          },
          keyshape: {
            fillOpacity: 0.8,
          },
          label: {
            visible: true,
            fill: '#000',
            fontSize: 12,
            position: 'bottom',
          },
          badge: {
            visible: false,
          },
        },
      },
      groupName: 'COMPANY TYPE',
      expressions: [
        {
          name: 'type',
          operator: 'eql',
          value: 'company',
        },
      ],
      logic: true,
    },
  ],
  edges: [
    {
      id: 'SimpleEdge',
      props: {
        size: 1,
        color: 'rgba(201,201,201,1)',
        label: ['UNKNOW.amount'],
        advanced: {
          keyshape: {
            customPoly: false,
            lineDash: [],
            opacity: 1,
          },
          label: {
            visible: true,
            fontSize: 12,
            offset: [0, 0],
            fill: '#ddd',
            backgroundEnable: true,
            backgroundFill: '#fff',
            backgroundStroke: '#fff',
          },
          animate: {
            visible: false,
          },
        },
      },
      groupName: '默认样式',
      expressions: [],
      logic: true,
    },
    {
      id: 'SimpleEdge',
      props: {
        size: 1,
        color: '#3056E3',
        label: ['transfer.amount'],
        advanced: {
          keyshape: {
            customPoly: false,
            lineDash: [],
            opacity: 1,
          },
          label: {
            visible: true,
            fontSize: 12,
            offset: [0, 0],
            fill: '#3056E3',
            backgroundEnable: true,
            backgroundFill: '#fff',
            backgroundStroke: '#fff',
          },
          animate: {
            visible: false,
          },
        },
      },
      groupName: 'TRANSFER TYPE',
      expressions: [
        {
          name: 'type',
          operator: 'eql',
          value: 'transfer',
        },
      ],
      logic: true,
    },
    {
      id: 'SimpleEdge',
      props: {
        size: 1,
        color: 'rgba(245,166,35,1)',
        label: ['owner.type'],
        advanced: {
          keyshape: {
            customPoly: false,
            lineDash: [],
            opacity: 1,
          },
          label: {
            visible: true,
            fontSize: 12,
            offset: [0, 0],
            fill: 'rgba(245,166,35,1)',
            backgroundEnable: true,
            backgroundFill: '#fff',
            backgroundStroke: '#fff',
          },
          animate: {
            visible: false,
          },
        },
      },
      groupName: 'OWNER TYPE',
      expressions: [
        {
          name: 'type',
          operator: 'eql',
          value: 'owner',
        },
      ],
      logic: true,
    },
    {
      id: 'SimpleEdge',
      props: {
        size: 1,
        color: '#82E6C7',
        label: ['faren.type'],
        advanced: {
          keyshape: {
            customPoly: false,
            lineDash: [],
            opacity: 1,
          },
          label: {
            visible: true,
            fontSize: 12,
            offset: [0, 0],
            fill: '#82E6C7',
            backgroundEnable: true,
            backgroundFill: '#fff',
            backgroundStroke: '#fff',
          },
          animate: {
            visible: false,
          },
        },
      },
      groupName: 'FAREN TYPE',
      expressions: [
        {
          name: 'type',
          operator: 'eql',
          value: 'faren',
        },
      ],
      logic: true,
    },
  ],
  layout: {
    info: {
      id: 'Dagre',
      options: {
        type: 'dagre',
      },
      name: '有向分层布局',
      category: 'basic',
      type: 'LAYOUT',
      desc: '节点按照边的流向排布',
      icon: 'icon-layout-dagre',
      cover: 'http://xxxx.jpg',
    },
    version: '2.0.6',
    pkg: '@alipay/gi-assets-basic',
    id: 'Dagre',
    name: '有向分层布局',
    category: 'basic',
    props: {
      rankdir: 'TB',
      align: null,
      nodesep: 40,
      ranksep: 40,
      type: 'dagre',
    },
    meta: {
      rankdir: {
        type: 'select',
        caption: '布局方向',
        default: 'TB',
        options: [
          {
            label: '自上而下',
            value: 'TB',
          },
          {
            label: '自下而上',
            value: 'BT',
          },
          {
            label: '自左而右',
            value: 'LR',
          },
          {
            label: '自右而左',
            value: 'RL',
          },
        ],
      },
      align: {
        type: 'select',
        caption: '对齐方式',
        default: null,
        options: [
          {
            label: '请选择',
            value: null,
          },
          {
            label: 'UL',
            value: 'UL',
          },
          {
            label: 'UR',
            value: 'UR',
          },
          {
            label: 'DL',
            value: 'DL',
          },
          {
            label: 'DR',
            value: 'DR',
          },
        ],
      },
      nodesep: {
        type: 'slider',
        caption: '节点间距',
        default: 10,
        min: 1,
        max: 200,
        step: 1,
      },
      ranksep: {
        type: 'slider',
        caption: '层间距',
        default: 10,
        min: 1,
        max: 200,
        step: 1,
      },
    },
  },
  components: [
    {
      id: 'Toolbar',
      props: {
        GI_CONTAINER: ['ZoomIn', 'ZoomOut', 'FitView', 'FitCenter', 'LassoSelect'],
        direction: 'vertical',
        placement: 'LT',
        offset: [24, 64],
      },
    },
    {
      id: 'ZoomIn',
      props: {
        GI_CONTAINER_INDEX: 2,
        GIAC: {
          visible: false,
          disabled: false,
          isShowTitle: false,
          title: '放大',
          isShowIcon: true,
          icon: 'icon-zoomin',
          isShowTooltip: true,
          tooltip: '',
          tooltipColor: '#3056e3',
          tooltipPlacement: 'right',
          hasDivider: false,
          height: '60px',
          isVertical: true,
        },
      },
    },
    {
      id: 'ZoomOut',
      props: {
        GI_CONTAINER_INDEX: 2,
        GIAC: {
          visible: false,
          disabled: false,
          isShowTitle: false,
          title: '缩小',
          isShowIcon: true,
          icon: 'icon-zoomout',
          isShowTooltip: true,
          tooltip: '',
          tooltipColor: '#3056e3',
          tooltipPlacement: 'right',
          hasDivider: false,
          height: '60px',
          isVertical: true,
        },
      },
    },
    {
      id: 'FitView',
      props: {
        GI_CONTAINER_INDEX: 2,
        GIAC: {
          visible: false,
          disabled: false,
          isShowTitle: false,
          title: '自适应',
          isShowIcon: true,
          icon: 'icon-fit-view',
          isShowTooltip: true,
          tooltip: '',
          tooltipColor: '#3056e3',
          tooltipPlacement: 'right',
          hasDivider: false,
          height: '60px',
          isVertical: true,
        },
      },
    },
    {
      id: 'FitCenter',
      props: {
        GI_CONTAINER_INDEX: 2,
        GIAC: {
          visible: false,
          disabled: false,
          isShowTitle: false,
          title: '视图居中',
          isShowIcon: true,
          icon: 'icon-fit-center',
          isShowTooltip: true,
          tooltip: '',
          tooltipColor: '#3056e3',
          tooltipPlacement: 'right',
          hasDivider: false,
          height: '60px',
          isVertical: true,
        },
      },
    },
    {
      id: 'LassoSelect',
      props: {
        GI_CONTAINER_INDEX: 2,
        GIAC: {
          visible: false,
          disabled: false,
          isShowTitle: false,
          title: '自由圈选',
          isShowIcon: true,
          icon: 'icon-lasso',
          isShowTooltip: true,
          tooltip: '按住Shift，点击画布即可自由圈选',
          tooltipColor: '#3056e3',
          tooltipPlacement: 'right',
          hasDivider: false,
          height: '60px',
          isVertical: true,
        },
      },
    },
    {
      id: 'PropertiesPanel',
      props: {
        serviceId: 'Mock/PropertiesPanel',
      },
    },
    {
      id: 'ActivateRelations',
      props: {
        enableNodeHover: true,
        enableEdgeHover: true,
        enable: true,
        trigger: 'click',
        upstreamDegree: 1,
        downstreamDegree: 1,
      },
    },
    {
      id: 'CanvasSetting',
      props: {
        styleCanvas: {
          background: '#fff',
          backgroundImage: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*k9t4QamMuQ4AAAAAAAAAAAAAARQnAQ',
        },
        dragCanvas: {
          disabled: false,
          direction: 'both',
          enableOptimize: false,
        },
        zoomCanvas: {
          disabled: false,
          enableOptimize: true,
        },
      },
    },
    {
      id: 'NodeLegend',
      props: {
        sortKey: 'type',
        textColor: '#ddd',
        placement: 'LB',
        offset: [100, 20],
      },
    },
  ],
};
export const GI_LOCAL_DATA = {
  nodes: [
    {
      id: '6217****1',
      type: 'card',
      tag: '警方备案，涉黑卡号',
    },
    {
      id: '2088xxx1',
      type: 'alipay',
    },
    {
      id: '2088xxx2',
      type: 'alipay',
    },
    {
      id: '2088xxx0',
      type: 'alipay',
      onwer: '王xx',
      is1688: true,
    },
    {
      id: 'Haag',
      type: 'alipay',
      alipayNo: '66668-8265',
    },
    {
      id: 'Gutkowski',
      type: 'alipay',
      alipayNo: '66660-7345',
    },
    {
      id: 'Rice',
      type: 'alipay',
      alipayNo: '66663-4268',
    },
    {
      id: 'Powlowski',
      type: 'alipay',
      alipayNo: '66664-3142',
    },
    {
      id: 'Keebler',
      type: 'alipay',
      alipayNo: '66665-8064',
    },
    {
      id: 'Luettgen',
      type: 'alipay',
      alipayNo: '66665-6317',
    },
    {
      id: '李xx',
      type: 'alipay',
      alipayNo: '2088xxxxx1',
      tag: '体系内涉黑:2021-09-02,LINK:https://www.xxxx.com',
    },
    {
      id: '张xx',
      type: 'alipay',
      alipayNo: '2088xxxxx2',
    },
    {
      id: '营业执照xxxx',
      type: 'YYZZ',
    },
    {
      id: 'xxxx某',
      type: 'alipay',
      alipayNo: '2088xxxxxxx1',
      longitude: 102.2011,
      latitude: 25.3197,
    },
    {
      id: '娱乐xx春花秋月公司',
      type: 'company',
      longitude: 102.0189,
      latitude: 25.1785,
    },
    {
      id: '娱乐xx天上人间公司',
      type: 'company',
      longitude: 102.2956,
      latitude: 25.3455,
    },
  ],
  edges: [
    {
      source: '6217****1',
      target: '2088xxx1',
      amount: 50000,
      type: 'transfer',
    },
    {
      source: '2088xxx1',
      target: '2088xxx2',
      amount: 10000,
      type: 'transfer',
    },
    {
      source: '2088xxx2',
      target: '2088xxx0',
      amount: 10000,
      type: 'transfer',
    },
    {
      source: 'Haag',
      target: '2088xxx0',
      amount: 100,
      type: 'transfer',
    },
    {
      source: 'Gutkowski',
      target: '2088xxx0',
      amount: 100,
      type: 'transfer',
    },
    {
      source: 'Rice',
      target: '2088xxx0',
      amount: 100,
      type: 'transfer',
    },
    {
      source: 'Powlowski',
      target: '2088xxx0',
      amount: 100,
      type: 'transfer',
    },
    {
      source: 'Keebler',
      target: '2088xxx0',
      amount: 100,
      type: 'transfer',
    },
    {
      source: 'Luettgen',
      target: '2088xxx0',
      amount: 100,
      type: 'transfer',
    },
    {
      source: '李xx',
      target: '张xx',
      amount: 50000,
      type: 'transfer',
    },
    {
      source: '张xx',
      target: '2088xxx0',
      amount: 100,
      type: 'transfer',
    },
    {
      source: '2088xxx0',
      target: '营业执照xxxx',
      type: 'owner',
    },
    {
      source: '营业执照xxxx',
      target: 'xxxx某',
      type: 'faren',
    },
    {
      source: 'xxxx某',
      target: '娱乐xx春花秋月公司',
      type: 'owner',
    },
    {
      source: 'xxxx某',
      target: '娱乐xx天上人间公司',
      type: 'owner',
    },
  ],
};

/**  由GI平台自动生成的，请勿修改 end **/
