import type { GIConfig } from '@alipay/graphinsight';
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
    id: 'Toolbar',
    props: {
      GI_CONTAINER: [
        'ZoomIn',
        'ZoomOut',
        'FitView',
        'FitCenter',
        'LassoSelect',
        'AddSheetbar',
        'LargeGraph',
        'MapMode',
        'SnapshotGallery',
        'ForceSimulation',
      ],
      direction: 'vertical',
      placement: 'LT',
      offset: [24, 84],
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
      serviceId: 'GI/PropertiesPanel',
      title: '属性面板',
      placement: 'LB',
      width: '356px',
      height: 'calc(100% - 80px)',
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
    id: 'OperatorBar',
    name: '操作栏',
    props: {
      GI_CONTAINER: ['FilterPanel', 'Save', 'NodeImportance'],
      placement: 'LT',
      offset: [0, 0],
      height: '60px',
      width: '100%',
    },
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
        height: '60px',
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
    id: 'AddSheetbar',
    name: '新增页签',
    props: {
      isRelayout: true,
      GI_CONTAINER_INDEX: 2,
      GIAC: {
        visible: false,
        disabled: false,
        isShowTitle: false,
        title: '将选中的节点与边添加到新画布中',
        isShowIcon: true,
        icon: 'icon-plus',
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
    id: 'Sheetbar',
    name: '多画布页签',
    props: {
      placement: 'bottom',
      height: 40,
    },
  },
  {
    id: 'Save',
    name: '保存分享',
    props: {
      serviceId: 'GI/Save',
      GI_CONTAINER_INDEX: 2,
      GIAC_CONTENT: {
        visible: false,
        disabled: false,
        isShowTitle: true,
        title: '保存分享',
        isShowIcon: true,
        icon: 'icon-save',
        isShowTooltip: true,
        tooltip: '保存画布,并分享给其他人',
        tooltipColor: '#3056e3',
        tooltipPlacement: 'top',
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
        height: '60px',
        isVertical: true,
      },
    },
  },
  {
    id: 'MapMode',
    name: '地图模式',
    props: {
      visible: false,
      type: 'mapbox',
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
        height: '60px',
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
        height: '60px',
        isVertical: true,
      },
    },
  },
  {
    id: 'ContextMenu',
    name: '右键菜单',
    props: {
      GI_CONTAINER: ['NeighborsQuery', 'ToggleClusterWithMenu', 'PinNodeWithMenu'],
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
    id: 'NodeImportance',
    name: '节点重要性',
    props: {
      GI_CONTAINER_INDEX: 2,
      GIAC_CONTENT: {
        visible: false,
        disabled: false,
        isShowTitle: true,
        title: '节点重要性',
        isShowIcon: true,
        icon: 'icon-rules',
        isShowTooltip: true,
        tooltip: '可在「资产中心」中添加更多算法分析资产',
        tooltipColor: '#3056e3',
        tooltipPlacement: 'top',
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
        height: '60px',
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
  layouts: ['GraphinForce', 'Concentric', 'Dagre'],
};

export const serviceConfig = [];

export const schemaData = {
  nodes: [],
  edges: [],
};
