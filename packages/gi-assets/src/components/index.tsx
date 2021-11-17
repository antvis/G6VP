// import { MiniMap } from '@antv/graphin-components';
// import CanvasClick from './CanvasClick';
// import DrillingOne from './DrillingOne';
import AddNode from './AddNode';
import CanvasSetting from './CanvasSetting';
import ClearCanvas from './ClearCanvas';
import ContextMenu from './ContextMenu';
import DownLoad from './DownLoad';
import Export from './Export';
import FilterPanel from './FilterPanel';
import LassoSelect from './LassoSelect';
import GraphScope from './GraphScope';
// import ContextMenu from './ContextMenu';
import GremlinQuery from './GremlinQuery';
import GremlinTemplateQuery from './GremlinTemplateQuery';
import Mapmode from './Mapmode';
import MiniMap from './MiniMap';
import NodeAttrs from './NodeAttrs';
import NodeExpand from './NodeExpand';
import NodeImportance from './NodeImportance';
import NodeLegend from './NodeLegend';
import NodeToggle from './NodeToggle';
import OperatorBar from './OperatorBar';
import Redo from './Redo';
import SearchBar from './SearchBar';
// import { EdgeTooltip, NodeTooltip } from './Tooltip';
import Timeline from './Timeline';
// import ClickEntity from './Liaoyuan/ClickEntity';
import Toolbar from './Toolbar';
import Tooltip from './Tooltip';
import View from './View';
import Zoom from './Zoom';

export {
  Timeline,
  OperatorBar,
  NodeLegend,
  MiniMap,
  NodeToggle,
  CanvasSetting,
  NodeAttrs,
  GraphScope,
  Toolbar,
  Mapmode,
  FilterPanel,
  AddNode,
  View,
  Zoom,
  DownLoad,
  Redo,
  ContextMenu,
  Tooltip,
  NodeImportance,
  GremlinQuery,
  GremlinTemplateQuery,
  ClearCanvas,
  LassoSelect,
  Export,
  SearchBar,
  NodeExpand,
};

// /**
//  * 组件市场
//  * 当前为临时方案：未来这部分组件的定义，需要存储在服务器端，拆包到 gi-components
//  */
// const getComponentsFromMarket: any = () => {
//   // 这个不应该放在这里，sortKey 默认值为 type
//   // const legendSortKey = getLegendMappingKey(config);
//   // category 分为 analysis behavior materials
//   return {
//     /*** 官方组件 */
//     Legend: {
//       id: 'Legend',
//       label: '图例',
//       category: 'analysis',
//       component: NodeLegend,
//       props: {
//         sortKey: 'type',
//       },
//     },
//     NodeLegend: {
//       id: 'NodeLegend',
//       label: '节点图例',
//       category: 'analysis',
//       component: NodeLegend,
//       props: {
//         sortKey: 'type',
//       },
//     },
//     MiniMap: {
//       id: 'MiniMap',
//       label: 'minimap',
//       category: 'analysis',
//       props: {},
//       component: MiniMap,
//     },
//     NodeTooltip: {
//       id: 'NodeTooltip',
//       label: '节点提示框',
//       category: 'analysis',
//       props: {},
//       component: NodeTooltip,
//     },
//     EdgeTooltip: {
//       id: 'EdgeTooltip',
//       label: '边提示框',
//       category: 'analysis',
//       props: {},
//       component: EdgeTooltip,
//     },
//     NodeContextMenu: {
//       id: 'NodeContextMenu',
//       props: {},
//       category: 'analysis',
//       label: '节点右键菜单',
//       component: NodeContextMenu,
//     },
//     /** 交互组件 */
//     CanvasClick: {
//       id: 'CanvasClick',
//       props: {},
//       category: 'behavior',
//       label: '点击画布',
//       component: CanvasClick,
//     },
//     Toolbar: {
//       id: 'Toolbar',
//       label: '工具栏',
//       category: 'analysis',
//       props: {},
//       component: ToolbarA,
//     },
//     /** 第三方组件 */
//     'Liaoyuan-Click-Entity-Node': {
//       id: 'Liaoyuan-Click-Entity-Node',
//       label: '燎原项目-节点下钻',
//       category: 'behavior',
//       props: {},
//       component: ClickEntity,
//     },
//     'Liaoyuan-Click-Event-Node': {
//       id: 'Liaoyuan-Click-Event-Node',
//       label: '燎原项目-高亮下游',
//       category: 'behavior',
//       props: {},
//       component: ClickEvent,
//     },

//     DrillingOne: {
//       id: 'DrillingOne',
//       label: '一度下钻',
//       category: 'behavior',
//       props: {
//         service: '',
//       },
//       component: DrillingOne,
//     },
//   };
// };

// export default getComponentsFromMarket;
