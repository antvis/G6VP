// devCost: 开发人日
// useProbability：使用的概率
const assets = [
  {
    id: 'LockNodeWithMenu',
    name: '锁定/解锁（右键菜单）',
    category: 'element-interaction',
    devCost: 8,
    useProbability: 0.4,
  },
  {
    id: 'SuperLinkWithMenu',
    name: '超链接（右键菜单）',
    category: 'element-interaction',
    devCost: 10,
    useProbability: 0.1,
  },
  {
    id: 'TagNodeWithMenu',
    category: 'element-interaction',
    name: '打标节点（右键菜单）',
    devCost: 12,
    useProbability: 0.8,
  },
  {
    id: 'ToggleClusterWithMenu',
    category: 'element-interaction',
    name: '展开/收起（右键菜单）',
    devCost: 20,
    useProbability: 0.5,
  },
  {
    id: 'NodeTooltip',
    name: '节点悬停提示框',
    category: 'element-interaction',
    devCost: 6,
    useProbability: 0.5,
  },
  {
    id: 'NodeHighlight',
    name: '节点高亮',
    category: 'element-interaction',
    devCost: 5,
    useProbability: 1,
  },
  {
    id: 'EdgeTooltip',
    name: '边悬停提示框',
    category: 'element-interaction',
    devCost: 5,
    useProbability: 0.2,
  },
  {
    id: 'EdgeHighlight',
    name: '边高亮',
    category: 'element-interaction',
    devCost: 5,
    useProbability: 1,
  },
  {
    id: 'PropertiesPanel',
    name: '属性面板',
    category: 'element-interaction',
    devCost: 10,
    useProbability: 0.9,
  },
  {
    id: 'LassoSelect',
    devCost: 4,
    useProbability: 0.5,
  },
  {
    id: 'Redo',
    devCost: 20,
    useProbability: 0.4,
  },
  {
    id: 'Undo',
    devCost: 20,
    useProbability: 0.4,
  },
  {
    id: 'ZoomOut',
    devCost: 1,
    useProbability: 1,
  },
  {
    id: 'ZoomIn',
    devCost: 1,
    useProbability: 1,
  },
  {
    id: 'FitCenter',
    devCost: 1,
    useProbability: 0.8,
  },
  {
    id: 'FitView',
    devCost: 1,
    useProbability: 0.8,
  },
  {
    id: 'DownLoad',
    devCost: 2,
    useProbability: 0.7,
  },
  {
    id: 'MiniMap',
    devCost: 20,
    useProbability: 0.5,
  },
  {
    id: 'CanvasSetting',
    devCost: 3,
    useProbability: 0.5,
  },
  {
    id: 'Loading',
    devCost: 1,
    useProbability: 0.5,
  },
  {
    id: 'FullScreen',
    devCost: 1,
    useProbability: 0.3,
  },
  {
    id: 'Placeholder',
    devCost: 2,
    useProbability: 0.5,
  },
  {
    id: 'Copyright',
    devCost: 1,
    useProbability: 0.2,
  },
  {
    id: 'NavBack',
    devCost: 1,
    useProbability: 0.1,
  },
  {
    id: 'Initializer',
    devCost: 5,
    useProbability: 1,
  },
  {
    id: 'ViewMode',
    devCost: 8,
    useProbability: 0.4,
  },
  {
    id: 'SnapshotGallery',
    devCost: 40,
    useProbability: 0.4,
  },
  {
    id: 'CypherQuery',
    devCost: 10,
    useProbability: 0.3,
  },
  {
    id: 'InteracticeQuery',
    devCost: 50,
    useProbability: 0.8,
  },
  {
    id: 'GremlinQuery',
    devCost: 14,
    useProbability: 0.5,
  },
  {
    id: 'RelationQuery',
    devCost: 12,
    useProbability: 0.5,
  },
  {
    id: 'NeighborsQuery',
    devCost: 15,
    useProbability: 0.5,
  },
  {
    id: 'NeighborsQueryWithMenu',
    devCost: 10,
    useProbability: 0.7,
  },
  {
    id: 'VertexQuery',
    devCost: 8,
    useProbability: 0.2,
  },
  {
    id: 'Search',
    devCost: 20,
    useProbability: 0.6,
  },
  {
    id: 'ProfileAnalysis',
    devCost: 20,
    useProbability: 0.4,
  },
  {
    id: 'Legend',
    devCost: 7,
    useProbability: 0.7,
  },
  {
    id: 'ComboAnalysis',
    devCost: 30,
    useProbability: 0.2,
  },
  {
    id: 'Filter',
    devCost: 30,
    useProbability: 0.8,
  },
  {
    id: 'LayoutSwitch',
    devCost: 6,
    useProbability: 0.7,
  },
  {
    id: 'LayoutByGroup',
    devCost: 12,
    useProbability: 0.4,
  },
  {
    id: 'PiePlot',
    devCost: 20,
    useProbability: 0.2,
  },
  {
    id: 'NodeGrouping',
    devCost: 35,
    useProbability: 0.2,
  },
  {
    id: 'EdgeGrouping',
    devCost: 12,
    useProbability: 0.2,
  },
  {
    id: 'StyleSetting',
    devCost: 30,
    useProbability: 0.6,
  },
  {
    id: 'SwitchStyle',
    devCost: 5,
    useProbability: 0.2,
  },
  {
    id: 'NodeImportance',
    devCost: 20,
    useProbability: 0.2,
  },
  {
    id: 'CommunityDetection',
    devCost: 20,
    useProbability: 0.2,
  },
  {
    id: 'NodesClustering',
    devCost: 20,
    useProbability: 0.2,
  },
  {
    id: 'ShortestPath',
    devCost: 10,
    useProbability: 0.6,
  },
  // 还差2个
  {
    id: 'PatternMatch',
    devCost: 40,
    useProbability: 0.5,
  },
  {
    id: 'Export',
    devCost: 6,
    useProbability: 0.5,
  },
  {
    id: 'Save',
    devCost: 5,
    useProbability: 0.8,
  },
  {
    id: 'Setting',
    devCost: 12,
    useProbability: 0.2,
  },
  {
    id: 'Publisher',
    devCost: 20,
    useProbability: 0.3,
  },
  {
    id: 'Sheet',
    devCost: 20,
    useProbability: 0.3,
  },
];
