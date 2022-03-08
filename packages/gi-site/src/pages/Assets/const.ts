/** 需要根据 info.category  与  info.type 自动生成该组件分组 */
const GRAPH = [
  //基础：元素交互，画布交互 都是可以放到toolbar中
  {
    id: 'node-interaction',
    name: '节点交互',
    desc:
      '针对节点的交互，例如 highlight，lock，focus，tag，hover，通常可以集成在右键菜单中单独操作，或者在工具栏中批量操作',
    components: [
      'GeaMakerLockNode', // 锁定节点
      'GeaMakerUnlockNode', // 解锁节点
      'GeaMakerHighlightNode', // 高亮
      'GeaMakerUnhighlightNode', // 取消高亮
      'SuperLink', // 超链接
      'AddLabelMenuItem', //打标-在右键菜单中
      'LockNodeMenuItem', //锁定节点-在右键菜单中
      'HighlightNodeMenuItem', //锁定节点-在右键菜单中
      'GeaMakerNodeLabel', //节点标签
    ],
  },
  {
    id: 'edge-interaction',
    name: '边交互',
    desc:
      '针对边的交互，例如 highlight，lock，focus，tag，hover，通常可以集成在右键菜单中单独操作，或者在工具栏中批量操作',
    components: [],
  },
  {
    id: 'canvas-interaction',
    name: '画布交互',
    desc: '针对画布的交互，例如缩放，平移，全屏，1:1，居中,撤销回退，下载图片,搜索等，通常集成在工具栏中',
    components: [
      'LassoSelect', //圈选画布
      'Redo', // 撤销回退
      'ZoomOut', // 缩小
      'ZoomIn', //放大
      'FitCenter', //居中
      'FitView', //1:1 适配屏幕
      'DownLoad', // 下载画布图片
      'GeaMakerFocus', // 　这个应该是GeaMakerSearch，用Foucs不太合适
    ],
  },

  {
    id: 'system-interaction', // zoom / fullscreen
    name: '系统交互',
    desc: '针对系统的交互，例如 loading',
    components: [
      'MiniMap',
      'Loading', //数据加载动画
      'GeaMakerBack', //返回按钮
      'GeaMakerInitializer', //系统初始化程序
      'GeaNodeTypes', //兼容业务特殊的兼容性组件
    ],
  },

  {
    id: 'container-components', // zoom / fullscreen
    name: '容器组件',
    desc: '能够集成原子组件，使其能够具备统一交互能力',
    components: [
      'OperatorHeader', // 分组操作栏
      'SideTabs', // 侧边栏容器
      'Toolbar', //画布工具栏
      'GeaMakerContextMenu', // 右键菜单
    ],
  },

  {
    id: 'data-query',
    name: '数据查询',
    desc: '数据查询相关的组件，例如关系扩散，邻居查询，GSQL查询，语句查询，通常集成在操作栏或者右键菜单中触发查询逻辑',
    components: [
      'QuickQuery', // 快速查询
      'LanguageQuery', //语句查询
      'TemplateQuery', //模版查询
      'QueryNeighbors', // 邻居查询
    ],
  },
  {
    id: 'data-analysis',
    name: '数据分析',
    desc: '针对图数据，做相关的分析的图组件，例如分组，过滤，画像分析，视图模式，时序分析 等',
    components: [
      'CanvasDetail', // 画像分析
      'NodeTypes', // 图例
      'NodeGroup', // 分组
      'GeaMakerFilter', // 筛选
      'DisplayModeSwitch', // 视图切换
      'GeaMakerNodeEdgeAttrs', // 属性面板
      'CustomQueryNeighbors', //自定义扩散面板
      'AppendNodes', //查找并添加节点
    ],
  },
  {
    id: 'layout-analysis', //
    name: '布局分析',
    desc: '和图布局相关的组件。例如布局切换，子图布局，聚合布局等',
    components: [
      'LayoutSwitch', //布局切换
    ],
  },
  {
    id: 'styling-analysis', //
    name: '样式分析',
    desc: '针对图数据做样式相关的配置，从而达到分析目的，例如饼图分析，样式配置，凸包绘制 等',
    components: [
      'PiePlot', //饼图分析
      'GeaMakerStyleSetting', // 样式配置
      'GeaMakerSaveStyle', //保存样式
      'GeaMakerToggleStyle', //切换样式
    ],
  },
  {
    id: 'algorithm-analysis',
    name: '算法分析',
    desc: '图算法相关分析组件，例如节点重要性，社区发现，最短路径分析等。',
    components: [
      'Analysis', //未来需要将容器组件和原子组件拆分开来，节点重要性 与 最短路径
    ],
  },
  {
    id: 'workbook',
    name: '设置',
    desc: '和工作薄配置相关，例如导出数据，保存分析，保存样式，系统配置，发布管理等。',
    components: [
      'GeaMakerExport', // 导出
      'GeaMakerSave', //保存
      'GeaMakerSetting', // 设置
      'Publisher', //发布
    ],
  },
];
