import type { GIConfig } from '@antv/gi-sdk';
/**
 *
 * @param
 * @returns ( ) => uuid: string
 */
export const getUid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const getMockData = () => {
  return {
    nodes: [],
    edges: [],
  };
};

/**
 *
 * 默认config
 *
 */

const baseNodesConfig: GIConfig['nodes'] = [
  {
    id: 'SimpleNode',
    name: '官方节点',
    expressions: [],
    groupName: '默认样式',
    props: {
      size: 26,
      color: '#ddd',
      label: [],
    },
  },
];

const baseEdgesConfig: GIConfig['edges'] = [
  {
    id: 'SimpleEdge',
    name: '官方边',
    expressions: [],
    groupName: '默认样式',
    props: {
      size: 1,
      color: '#ddd',
      label: ['source', 'target'],
    },
  },
];

const baseComponentsConfig = [
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
        height: '46px',
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
        height: '46px',
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
        height: '46px',
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
        height: '46px',
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
        height: '46px',
        isVertical: true,
      },
    },
  },
  {
    id: 'PropertiesPanel',
    props: {
      serviceId: 'GI/PropertiesPanel',
      title: '属性面板',
      placement: 'RT',
      width: '356px',
      height: 'calc(100% - 0px)',
      offset: [10, 10],
      animate: false,
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
        backgroundColor: '#fff',
        backgroundImage: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*k9t4QamMuQ4AAAAAAAAAAAAAARQnAQ',
      },
      dragCanvas: {
        disabled: false,
        direction: 'both',
        enableOptimize: true,
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
  {
    id: 'Placeholder',
    name: '画布占位符',
    props: {
      img: 'https://gw.alipayobjects.com/zos/bmw-prod/db278704-6158-432e-99d2-cc5db457585d.svg',
      text: '当前画布为空，请先试试「数据/图数据源/导入/示例数据」',
      width: 380,
    },
  },

  {
    id: 'FilterPanel',
    name: '筛选面板',
    props: {
      histogramColor: '#3056E3',
      isFilterIsolatedNodes: true,
      highlightMode: true,
      filterKeys: [],
      GI_CONTAINER_INDEX: 2,
      GIAC_CONTENT: {
        visible: false,
        disabled: false,
        isShowTitle: true,
        title: '筛选面板',
        isShowIcon: true,
        icon: 'icon-filter',
        isShowTooltip: true,
        tooltip: '通过属性筛选画布信息，可自定义',
        tooltipColor: '#3056e3',
        tooltipPlacement: 'top',
        hasDivider: false,
        height: '46px',
        isVertical: true,
        containerType: 'div',
        containerAnimate: false,
        containerPlacement: 'RT',
        offset: [0, 0],
        containerWidth: '400px',
        containerHeight: 'calc(100% - 100px)',
        contaienrMask: false,
      },
    },
  },
  {
    id: 'LargeGraph',
    name: '3D大图',
    props: {
      visible: false,
      minSize: '50%',
      maxSize: '100%',
      placement: 'RB',
      offset: [0, 0],
      GI_CONTAINER_INDEX: 2,
      GIAC: {
        visible: false,
        disabled: false,
        isShowTitle: false,
        title: '3D大图',
        isShowIcon: true,
        icon: 'icon-3d',
        isShowTooltip: true,
        tooltip: '',
        tooltipColor: '#3056e3',
        tooltipPlacement: 'right',
        hasDivider: false,
        height: '46px',
        isVertical: true,
      },
    },
  },
  {
    id: 'MapMode',
    name: '地图模式',
    props: {
      visible: false,
      type: 'amap',
      theme: 'light',
      minSize: '50%',
      maxSize: '100%',
      placement: 'RB',
      offset: [0, 0],
      longitudeKey: 'longitude',
      latitudeKey: 'latitude',
      GI_CONTAINER_INDEX: 2,
      GIAC: {
        visible: false,
        disabled: false,
        isShowTitle: false,
        title: '地图模式',
        isShowIcon: true,
        icon: 'icon-global',
        isShowTooltip: true,
        tooltip: '',
        tooltipColor: '#3056e3',
        tooltipPlacement: 'right',
        hasDivider: false,
        height: '46px',
        isVertical: true,
      },
    },
  },
  {
    id: 'SnapshotGallery',
    name: '快照画廊',
    props: {
      background: '#fff',
      direction: 'horizontal',
      placement: 'LT',
      offset: [20, 20],
      GI_CONTAINER_INDEX: 2,
      GIAC: {
        visible: false,
        disabled: false,
        isShowTitle: false,
        title: '快照画廊',
        isShowIcon: true,
        icon: 'icon-camera',
        isShowTooltip: true,
        tooltip: '快照画廊(快捷键ctrl+x)',
        tooltipColor: '#3056e3',
        tooltipPlacement: 'right',
        hasDivider: false,
        height: '46px',
        isVertical: true,
      },
    },
  },
  {
    id: 'ContextMenu',
    name: '右键菜单',
    props: {
      GI_CONTAINER: ['NeighborsQuery', 'ToggleClusterWithMenu', 'PinNodeWithMenu'],
      nodeMenuComponents: ['NeighborsQuery', 'ToggleClusterWithMenu', 'PinNodeWithMenu'],
    },
  },
  {
    id: 'ToggleClusterWithMenu',
    name: '展开/收起',
    props: {
      isReLayout: false,
      degree: 1,
    },
  },
  {
    id: 'NeighborsQuery',
    name: '邻居查询',
    props: {
      serviceId: 'GI/NeighborsQuery',
      degree: '1',
      isFocus: true,
    },
  },
  {
    id: 'Copyright',
    name: '版权',
    props: {
      imageUrl: 'https://gw.alipayobjects.com/zos/bmw-prod/c2d4b2f5-2a34-4ae5-86c4-df97f7136105.svg',
      width: 200,
      height: 30,
      placement: 'RB',
      offset: [10, 10],
    },
  },
  {
    id: 'Loading',
    name: '加载动画',
    props: {},
  },
  {
    id: 'PinNodeWithMenu',
    name: '固定节点(MENU)',
    props: {
      color: '#fff',
      fill: '#262626',
    },
  },
  {
    id: 'ForceSimulation',
    name: '力导布局控制器',
    props: {
      autoPin: true,
      dragNodeMass: 10000000,
      GI_CONTAINER_INDEX: 2,
      GIAC: {
        visible: false,
        disabled: false,
        isShowTitle: false,
        title: '力导布局控制器',
        isShowIcon: true,
        icon: 'icon-layout-force',
        isShowTooltip: true,
        tooltip: '',
        tooltipColor: '#3056e3',
        tooltipPlacement: 'right',
        hasDivider: false,
        height: '46px',
        isVertical: true,
      },
    },
  },
  {
    id: 'Initializer',
    name: '初始化器',
    props: {
      serviceId: 'GI/GI_SERVICE_INTIAL_GRAPH',
      schemaServiceId: 'GI/GI_SERVICE_SCHEMA',
      GI_INITIALIZER: true,
    },
  },
  {
    id: 'PropertyGraphInitializer',
    type: 'INITIALIZER_ASSET',
    name: '属性图初始化器',
    props: {},
  },
  {
    id: 'LayoutSwitch',
    name: '布局切换',
    props: {
      GI_CONTAINER_INDEX: 2,
      GIAC: {
        visible: false,
        disabled: false,
        isShowTitle: false,
        title: '布局切换',
        isShowIcon: true,
        icon: 'icon-layout',
        isShowTooltip: false,
        tooltip: '一键切换画布布局',
        tooltipColor: '#3056e3',
        tooltipPlacement: 'right',
        hasDivider: false,
        height: '46px',
        isVertical: true,
      },
    },
  },
  {
    id: 'GrailLayout',
    name: '圣杯布局',
    props: {
      containers: [
        {
          id: 'GI_CONTAINER_LEFT',
          GI_CONTAINER: [],
          display: false,
          width: '400px',
        },
        {
          id: 'GI_CONTAINER_RIGHT',
          GI_CONTAINER: [],
          display: true,
          width: '350px',
        },
        {
          id: 'GI_CONTAINER_BOTTOM',
          GI_CONTAINER: [],
          display: false,
          height: '400px',
        },
      ],
    },
  },
  {
    id: 'Toolbar',
    name: '工具栏',
    props: {
      GI_CONTAINER: [
        'ZoomIn',
        'ZoomOut',
        'FitView',
        'FitCenter',
        'LargeGraph',
        'MapMode',
        'ForceSimulation',
        'LayoutSwitch',
        'Export',
      ],
      direction: 'vertical',
      placement: 'LT',
      offset: [24, 64],
    },
  },
  {
    id: 'Export',
    name: '导出',
    props: {
      GI_CONTAINER_INDEX: 2,
      GIAC: {
        visible: false,
        disabled: false,
        isShowTitle: false,
        title: '导出',
        isShowIcon: true,
        icon: 'icon-export',
        isShowTooltip: true,
        tooltip: '导出CSV,PNG,JSON数据',
        tooltipColor: '#3056e3',
        tooltipPlacement: 'right',
        hasDivider: false,
        height: '46px',
        isVertical: true,
      },
    },
  },
  {
    id: 'Overview',
    name: '大图概览',
    props: {
      limit: 600,
      filterLogic: 'and',
      GI_CONTAINER_INDEX: 2,
      GIAC_CONTENT: {
        visible: false,
        disabled: false,
        isShowTitle: true,
        title: '大图概览',
        isShowIcon: true,
        icon: 'icon-dashboard',
        isShowTooltip: true,
        tooltip: '',
        tooltipColor: '#3056e3',
        tooltipPlacement: 'right',
        hasDivider: false,
        height: '46px',
        isVertical: true,
        containerType: 'div',
        containerAnimate: false,
        containerPlacement: 'RT',
        offset: [0, 0],
        containerWidth: '400px',
        containerHeight: 'calc(100% - 100px)',
        contaienrMask: false,
      },
    },
  },
];
const baseLayoutConfig = {
  id: 'GraphinForce',
  props: {
    type: 'graphin-force',
    preset: {
      type: 'concentric',
    },
  },
};

export const baseConfig = {
  nodes: baseNodesConfig,
  edges: baseEdgesConfig,
  layout: baseLayoutConfig,
  components: baseComponentsConfig,
};

export const activeAssetsKeys = {
  elements: [...baseNodesConfig.map(n => n.id), ...baseEdgesConfig.map(e => e.id)],
  components: [...baseComponentsConfig.map(c => c.id)],
  layouts: ['GraphinForce', 'Concentric', 'Dagre', 'FundForce'],
};

const Cypher_Template = [
  {
    id: 'CypherQuery',
    name: 'Cypher 语句查询',
    props: {
      serviceId: 'GI/CypherQuery',
      isShowPublishButton: false,
      saveCypherTemplateServceId: 'GI/PublishTemplate',
      initialValue: 'MATCH n RETURN LIMIT 100',
      GI_CONTAINER_INDEX: 2,
      GIAC_CONTENT: {
        visible: false,
        disabled: false,
        isShowTitle: true,
        title: 'Cypher 语句查询',
        isShowIcon: true,
        icon: 'icon-query',
        isShowTooltip: true,
        tooltip: '',
        tooltipColor: '#3056e3',
        tooltipPlacement: 'right',
        hasDivider: false,
        height: '60px',
        isVertical: true,
        containerType: 'div',
        containerAnimate: false,
        containerPlacement: 'RT',
        offset: [0, 0],
        containerWidth: '350px',
        containerHeight: 'calc(100% - 100px)',
        contaienrMask: false,
      },
    },
  },
];

const Gremlin_Template = [
  {
    id: 'GremlinQuery',
    name: 'Gremlin 查询',
    props: {
      serviceId: 'GraphScope/GremlinQuery',
      isShowPublishButton: false,
      saveTemplateServceId: 'GI/PublishTemplate',
      initialValue: 'g.V().limit(10)',
      height: 200,
      GI_CONTAINER_INDEX: 2,
      GIAC_CONTENT: {
        visible: false,
        disabled: false,
        isShowTitle: true,
        title: 'Gremlin',
        isShowIcon: true,
        icon: 'icon-query',
        isShowTooltip: true,
        tooltip: '',
        tooltipColor: '#3056e3',
        tooltipPlacement: 'right',
        hasDivider: false,
        height: '60px',
        isVertical: true,
        containerType: 'div',
        containerAnimate: false,
        containerPlacement: 'RT',
        offset: [0, 0],
        containerWidth: '350px',
        containerHeight: 'calc(100% - 100px)',
        contaienrMask: false,
      },
    },
  },
];

export const getConfigByEngineId = engineId => {
  let componentConfig = [...baseComponentsConfig];
  if (engineId === 'TuGraph' || engineId === 'Neo4j') {
    //@ts-ignore
    componentConfig = [...componentConfig, ...Cypher_Template];
    componentConfig.forEach(item => {
      if (item.id === 'GrailLayout') {
        const rightContainer = item.props.containers.find(container => container.id === 'GI_CONTAINER_RIGHT');
        rightContainer.GI_CONTAINER = ['FilterPanel', 'CypherQuery'];
      }
    });
  }
  if (engineId === 'GraphScope' || engineId === 'GeaFlow') {
    //@ts-ignore
    componentConfig = [...componentConfig, ...Gremlin_Template];
    componentConfig.forEach(item => {
      if (item.id === 'GrailLayout') {
        const rightContainer = item.props.containers.find(container => container.id === 'GI_CONTAINER_RIGHT');
        rightContainer.GI_CONTAINER = ['FilterPanel', 'CypherQuery'];
      }
    });
  }
  const config = {
    nodes: baseNodesConfig,
    edges: baseEdgesConfig,
    layout: baseLayoutConfig,
    components: componentConfig,
  };
  const activeAssetsKeys = {
    elements: [...baseNodesConfig.map(n => n.id), ...baseEdgesConfig.map(e => e.id)],
    components: [...config.components.map(c => c.id)],
    layouts: ['GraphinForce', 'Concentric', 'Dagre', 'FundForce'],
  };
  return {
    config,
    activeAssetsKeys,
  };
};

export const serviceConfig = [];

export const schemaData = {
  nodes: [],
  edges: [],
};
