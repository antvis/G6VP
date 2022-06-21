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
  {
    id: 'GraphScope/PropertiesPanel',
    mode: 'MOCK',
    name: 'GraphScope/PropertiesPanel',
    content:
      "export default function service(params) {\n      var id = params.id;\n      return fetch(\"http://dev.alipay.net:7001/graphcompute/properties\", {\n        method: 'post',\n        headers: {\n          'Content-Type': 'application/json;charset=utf-8'\n        },\n        body: JSON.stringify({\n          id: [id],\n          gremlinServer: localStorage.getItem('graphScopeGremlinServer')\n        })\n      }).then(function (response) {\n        return response.json();\n      }).then(function (res) {\n        var success = res.success,\n            data = res.data;\n\n        if (success) {\n          return data[id];\n        }\n\n        return res;\n      });\n    }",
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
      groupName: '默认样式',
      expressions: [null],
      logic: true,
    },
    {
      id: 'SimpleNode',
      props: {
        size: 26,
        color: '#3056E3',
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
          name: 'nodeType',
          operator: 'eql',
          value: 'company',
        },
      ],
      logic: true,
    },
    {
      id: 'SimpleNode',
      props: {
        size: 26,
        color: '#ff9d05',
        label: ['person.id'],
        advanced: {
          icon: {
            type: 'font',
            value: 'user',
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
      groupName: 'PERSON TYPE',
      expressions: [
        {
          name: 'nodeType',
          operator: 'eql',
          value: 'person',
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
        label: ['shareHolding.percent', 'shareHolding.edgeType'],
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
        label: ['manager.position'],
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
            fill: '#ff9d05',
            backgroundEnable: true,
            backgroundFill: 'rgba(255,255,255,1)',
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
    id: 'Dagre',
    props: {
      type: 'dagre',
      rankdir: 'LR',
      align: 'UL',
      nodesep: 47,
      ranksep: 29,
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
      id: 'PathAnalysis',
      props: {
        pathNodeLabel: 'id',
        GI_CONTAINER_INDEX: 2,
        GIAC_CONTENT: {
          visible: false,
          disabled: false,
          isShowTitle: true,
          isShowIcon: true,
          icon: 'icon-path-analysis',
          isShowTooltip: true,
          tooltipColor: '#3056e3',
          tooltipPlacement: 'right',
          hasDivider: false,
          height: '60px',
          isVertical: true,
          containerType: 'div',
          containerPlacement: 'LT',
          offset: [0, 78],
          containerWidth: '400px',
          containerHeight: 'calc(100vh - 120px)',
          contaienrMask: false,
          tooltip: '',
          containerAnimate: false,
          title: '路径分析',
        },
      },
    },
    {
      id: 'FitCenter',
      name: '视图居中',
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
      id: 'FitView',
      name: '自适应',
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
      id: 'LassoSelect',
      name: '自由圈选',
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
      id: 'ZoomIn',
      name: '放大',
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
      name: '缩小',
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
      id: 'CanvasSetting',
      name: '画布设置',
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
      id: 'Copyright',
      name: '版权',
      props: {
        imageUrl: 'https://gw.alipayobjects.com/zos/bmw-prod/c2d4b2f5-2a34-4ae5-86c4-df97f7136105.svg',
        width: 200,
        height: 100,
        placement: 'RB',
        offset: [30, 0],
      },
    },
    {
      id: 'Loading',
      name: '加载动画',
      props: {},
    },
    {
      id: 'FilterPanel',
      name: '筛选面板',
      props: {
        histogramColor: '#3056E3',
        isFilterIsolatedNodes: true,
        highlightMode: true,
        GI_CONTAINER_INDEX: 2,
        GIAC_CONTENT: {
          visible: true,
          disabled: false,
          isShowTitle: true,
          isShowIcon: true,
          icon: 'icon-filter',
          isShowTooltip: true,
          tooltip: '通过属性筛选画布信息，可自定义',
          tooltipColor: '#3056e3',
          tooltipPlacement: 'right',
          hasDivider: false,
          height: '60px',
          isVertical: true,
          containerType: 'div',
          containerAnimate: false,
          containerPlacement: 'LT',
          offset: [0, 78],
          containerWidth: '400px',
          containerHeight: 'calc(100vh - 120px)',
          contaienrMask: false,
          title: '筛选面板',
        },
      },
    },
    {
      id: 'Toolbar',
      name: '工具栏',
      props: {
        GI_CONTAINER: ['FitCenter', 'FitView', 'LassoSelect', 'ZoomIn', 'ZoomOut'],
        direction: 'vertical',
        placement: 'RB',
        offset: [24, 84],
      },
    },
    {
      id: 'SideTabs',
      name: '侧边栏',
      props: {
        GI_CONTAINER: ['PathAnalysis', 'FilterPanel'],
        outSideFromCanvas: false,
        tabPosition: 'left',
        placement: 'LB',
        offset: [0, 61],
        height: 'calc(100vh - 120px)',
        width: '450px',
      },
    },
    {
      id: 'Tooltip',
      name: '节点提示框',
      props: {
        mappingKeys: ['id', 'nodeType'],
        placement: 'top',
        width: '200px',
        hasArrow: true,
      },
    },
    {
      id: 'PropertiesPanel',
      name: '属性面板',
      props: {
        serviceId: 'Mock/PropertiesPanel',
        title: '属性面板',
        placement: 'RT',
        width: '356px',
        height: 'calc(100% - 80px)',
        offset: [2, 0],
        animate: false,
      },
    },
    {
      id: 'ActivateRelations',
      name: '元素高亮',
      props: {
        enableNodeHover: true,
        enableEdgeHover: true,
        enable: true,
        trigger: 'click',
        upstreamDegree: 1,
        downstreamDegree: 1,
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
export const GI_SCHEMA_DATA = {
  nodes: [
    {
      nodeType: 'company',
      nodeTypeKeyFromProperties: 'nodeType',
      properties: {
        id: 'string',
        nodeType: 'string',
      },
    },
    {
      nodeType: 'person',
      nodeTypeKeyFromProperties: 'nodeType',
      properties: {
        id: 'string',
        nodeType: 'string',
      },
    },
  ],
  edges: [
    {
      edgeType: 'shareHolding',
      edgeTypeKeyFromProperties: 'edgeType',
      sourceNodeType: 'company',
      targetNodeType: 'company',
      properties: {
        source: 'string',
        target: 'string',
        edgeType: 'string',
        percent: 'string',
      },
    },
    {
      edgeType: 'manager',
      edgeTypeKeyFromProperties: 'edgeType',
      sourceNodeType: 'person',
      targetNodeType: 'company',
      properties: {
        source: 'string',
        target: 'string',
        edgeType: 'string',
        position: 'string',
      },
    },
  ],
};

/**  由GI平台自动生成的，请勿修改 end **/
