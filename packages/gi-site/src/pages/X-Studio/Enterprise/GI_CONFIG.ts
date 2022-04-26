/**  由GI平台自动生成的，请勿修改 start **/

export const GI_SERVICES_OPTIONS = [
  {
    id: 'GI_SERVICE_INTIAL_GRAPH',
    content:
      'export default (localData)=>{\n      return new Promise((resolve)=>{\n        resolve(localData)\n      })\n    }',
    mode: 'MOCK',
    name: '初始化接口',
  },
];
export const GI_PROJECT_CONFIG = {
  nodes: [
    {
      id: 'SimpleNode',
      props: {
        size: 26,
        color: '#ddd',
        label: ['id'],
      },
      name: '官方节点',
      order: -1,
      expressions: [null],
      logic: true,
      groupName: '默认样式',
    },
    {
      id: 'SimpleNode',
      props: {
        size: 26,
        color: '#3056E3',
        label: ['id'],
      },
      name: '官方节点',
      expressions: [
        {
          name: 'nodeType',
          operator: 'eql',
          value: 'company',
        },
      ],
      order: 0,
      logic: true,
      groupName: 'COMPANY TYPE',
    },
    {
      id: 'SimpleNode',
      props: {
        size: 26,
        color: '#ff9d05',
        label: ['id'],
      },
      name: '官方节点',
      expressions: [
        {
          name: 'nodeType',
          operator: 'eql',
          value: 'person',
        },
      ],
      order: 1,
      logic: true,
      groupName: 'PERSON TYPE',
    },
  ],
  edges: [
    {
      id: 'SimpleEdge',
      props: {
        size: 1,
        color: '#ddd',
        label: [],
      },
      groupName: '默认样式',
      expressions: [null],
      logic: true,
    },
    {
      id: 'SimpleEdge',
      props: {
        size: 1,
        color: '#3056E3',
        label: ['percent'],
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
            fill: 'rgba(0,0,0,1)',
            backgroundEnable: false,
            backgroundFill: '#ddd',
            backgroundStroke: '#fff',
          },
          animate: {
            visible: false,
          },
        },
      },
      groupName: 'SHAREHOLDING TYPE',
      expressions: [
        {
          name: 'edgeType',
          operator: 'eql',
          value: 'shareHolding',
        },
      ],
      logic: true,
    },
    {
      id: 'SimpleEdge',
      props: {
        size: 1,
        color: '#ff9d05',
        label: ['position'],
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
            fill: 'rgba(0,0,0,1)',
            backgroundEnable: false,
            backgroundFill: '#ddd',
            backgroundStroke: '#fff',
          },
          animate: {
            visible: false,
          },
        },
      },
      groupName: 'MANAGER TYPE',
      expressions: [
        {
          name: 'edgeType',
          operator: 'eql',
          value: 'manager',
        },
      ],
      logic: true,
    },
  ],
  layout: {
    id: 'GraphinForce',
    props: {
      type: 'graphin-force',
      preset: {
        type: 'concentric',
      },
    },
  },
  components: [
    {
      id: 'NodeLegend',
      props: {
        sortKey: 'type',
        textColor: '#ddd',
        placement: 'LB',
        offset: [100, 20],
      },
    },
    {
      id: 'SideTabs',
      props: {
        GI_CONTAINER: ['PathAnalysis'],
        outSideFromCanvas: true,
        tabPosition: 'left',
        placement: 'LB',
        offset: [0, 61],
        height: 'calc(100vh - 120px)',
        width: '450px',
      },
    },
    {
      id: 'PathAnalysis',
      props: {
        pathNodeLabel: 'id',
        GI_CONTAINER_INDEX: 2,
        GIAC_CONTENT: {
          visible: false,
          disabled: false,
          isShowTitle: true,
          title: '路径分析',
          isShowIcon: true,
          icon: 'icon-star',
          isShowTooltip: true,
          tooltipColor: '#3056e3',
          tooltipPlacement: 'top',
          hasDivider: false,
          height: '60px',
          isVertical: true,
          containerType: 'drawer',
          containerPlacement: 'RT',
          offset: [10, 60],
          containerWidth: '400px',
          containerHeight: 'calc(100vh - 120px)',
          contaienrMask: false,
        },
      },
    },
  ],
};
export const GI_LOCAL_DATA = {
  nodes: [
    {
      id: '淘宝控股公司',
      nodeType: 'company',
      nodeTypeKeyFromProperties: 'nodeType',
      data: {
        id: '淘宝控股公司',
        nodeType: 'company',
      },
    },
    {
      id: '淘宝中国控股公司',
      nodeType: 'company',
      nodeTypeKeyFromProperties: 'nodeType',
      data: {
        id: '淘宝中国控股公司',
        nodeType: 'company',
      },
    },
    {
      id: '淘宝(中国)软件有限公司',
      nodeType: 'company',
      nodeTypeKeyFromProperties: 'nodeType',
      data: {
        id: '淘宝(中国)软件有限公司',
        nodeType: 'company',
      },
    },
    {
      id: '杭州阿里巴巴网络科技有限公司',
      nodeType: 'company',
      nodeTypeKeyFromProperties: 'nodeType',
      data: {
        id: '杭州阿里巴巴网络科技有限公司',
        nodeType: 'company',
      },
    },
    {
      id: '阿里巴巴集团控股有限公司',
      nodeType: 'company',
      nodeTypeKeyFromProperties: 'nodeType',
      data: {
        id: '阿里巴巴集团控股有限公司',
        nodeType: 'company',
      },
    },
    {
      id: '蚂蚁科技集团股份有限公司',
      nodeType: 'company',
      nodeTypeKeyFromProperties: 'nodeType',
      data: {
        id: '蚂蚁科技集团股份有限公司',
        nodeType: 'company',
      },
    },
    {
      id: '张勇',
      nodeType: 'person',
      nodeTypeKeyFromProperties: 'nodeType',
      data: {
        id: '张勇',
        nodeType: 'person',
      },
    },
    {
      id: '武卫',
      nodeType: 'person',
      nodeTypeKeyFromProperties: 'nodeType',
      data: {
        id: '武卫',
        nodeType: 'person',
      },
    },
    {
      id: '蒋芳',
      nodeType: 'person',
      nodeTypeKeyFromProperties: 'nodeType',
      data: {
        id: '蒋芳',
        nodeType: 'person',
      },
    },
    {
      id: '马云',
      nodeType: 'person',
      nodeTypeKeyFromProperties: 'nodeType',
      data: {
        id: '马云',
        nodeType: 'person',
      },
    },
    {
      id: '蔡崇信',
      nodeType: 'person',
      nodeTypeKeyFromProperties: 'nodeType',
      data: {
        id: '蔡崇信',
        nodeType: 'person',
      },
    },
  ],
  edges: [
    {
      source: '淘宝控股公司',
      target: '淘宝中国控股公司',
      edgeType: 'shareHolding',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '淘宝控股公司',
        target: '淘宝中国控股公司',
        edgeType: 'shareHolding',
        percent: '100%',
      },
    },
    {
      source: '淘宝中国控股公司',
      target: '淘宝(中国)软件有限公司',
      edgeType: 'shareHolding',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '淘宝中国控股公司',
        target: '淘宝(中国)软件有限公司',
        edgeType: 'shareHolding',
        percent: '100%',
      },
    },
    {
      source: '淘宝(中国)软件有限公司',
      target: '杭州阿里巴巴网络科技有限公司',
      edgeType: 'shareHolding',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '淘宝(中国)软件有限公司',
        target: '杭州阿里巴巴网络科技有限公司',
        edgeType: 'shareHolding',
        percent: '100%',
      },
    },
    {
      source: '杭州阿里巴巴网络科技有限公司',
      target: '蚂蚁科技集团股份有限公司',
      edgeType: 'shareHolding',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '杭州阿里巴巴网络科技有限公司',
        target: '蚂蚁科技集团股份有限公司',
        edgeType: 'shareHolding',
        percent: '32.65',
      },
    },
    {
      source: '马云',
      target: '阿里巴巴集团控股有限公司',
      edgeType: 'manager',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '马云',
        target: '阿里巴巴集团控股有限公司',
        edgeType: 'manager',
        position: '实际控制人(疑似)',
      },
    },
    {
      source: '马云',
      target: '蚂蚁科技集团股份有限公司',
      edgeType: 'manager',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '马云',
        target: '蚂蚁科技集团股份有限公司',
        edgeType: 'manager',
        position: '实际控制人',
      },
    },
    {
      source: '蔡崇信',
      target: '蚂蚁科技集团股份有限公司',
      edgeType: 'manager',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '蔡崇信',
        target: '蚂蚁科技集团股份有限公司',
        edgeType: 'manager',
        position: '执行董事',
      },
    },
    {
      source: '蔡崇信',
      target: '阿里巴巴集团控股有限公司',
      edgeType: 'manager',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '蔡崇信',
        target: '阿里巴巴集团控股有限公司',
        edgeType: 'manager',
        position: '执行董事',
      },
    },
    {
      source: '张勇',
      target: '阿里巴巴集团控股有限公司',
      edgeType: 'manager',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '张勇',
        target: '阿里巴巴集团控股有限公司',
        edgeType: 'manager',
        position: 'CEO',
      },
    },
    {
      source: '张勇',
      target: '淘宝(中国)软件有限公司',
      edgeType: 'manager',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '张勇',
        target: '淘宝(中国)软件有限公司',
        edgeType: 'manager',
        position: '总经理',
      },
    },
    {
      source: '张勇',
      target: '杭州阿里巴巴网络科技有限公司',
      edgeType: 'manager',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '张勇',
        target: '杭州阿里巴巴网络科技有限公司',
        edgeType: 'manager',
        position: '总经理',
      },
    },
    {
      source: '武卫',
      target: '杭州阿里巴巴网络科技有限公司',
      edgeType: 'manager',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '武卫',
        target: '杭州阿里巴巴网络科技有限公司',
        edgeType: 'manager',
        position: '董事',
      },
    },
    {
      source: '蒋芳',
      target: '杭州阿里巴巴网络科技有限公司',
      edgeType: 'manager',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '蒋芳',
        target: '杭州阿里巴巴网络科技有限公司',
        edgeType: 'manager',
        position: '非执行董事',
      },
    },
    {
      source: '蒋芳',
      target: '淘宝(中国)软件有限公司',
      edgeType: 'manager',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '蒋芳',
        target: '淘宝(中国)软件有限公司',
        edgeType: 'manager',
        position: '董事',
      },
    },
    {
      source: '蒋芳',
      target: '杭州阿里巴巴网络科技有限公司',
      edgeType: 'manager',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '蒋芳',
        target: '杭州阿里巴巴网络科技有限公司',
        edgeType: 'manager',
        position: '董事',
      },
    },
    {
      source: '阿里巴巴集团控股有限公司',
      target: '淘宝控股公司',
      edgeType: 'shareHolding',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '阿里巴巴集团控股有限公司',
        target: '淘宝控股公司',
        edgeType: 'shareHolding',
        percent: '100%',
      },
    },
  ],
};
/**  由GI平台自动生成的，请勿修改 end **/
