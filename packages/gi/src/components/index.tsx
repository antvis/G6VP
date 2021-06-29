import { MiniMap } from '@antv/graphin-components';
import CanvasClick from './CanvasClick';
import { NodeContextMenu } from './ContextMenu';
import NodeLegend from './Legend/NodeLegend';
import ClickEntity from './Liaoyuan/ClickEntity';
import ClickEvent from './Liaoyuan/ClickEvent';
import ToolbarA from './Toolbar';
import { EdgeTooltip, NodeTooltip } from './Tooltip';

/**
 * 组件市场
 * 当前为临时方案：未来这部分组件的定义，需要存储在服务器端，拆包到 gi-components
 */
const getComponentsFromMarket: any = () => {
  // 这个不应该放在这里，sortKey 默认值为 type
  // const legendSortKey = getLegendMappingKey(config);

  // category 分为 analysis behavior materials
  return {
    /*** 官方组件 */
    Legend: {
      id: 'Legend',
      label: '图例',
      category: 'analysis',
      component: NodeLegend,
      props: {
        sortKey: 'type',
      },
    },
    NodeLegend: {
      id: 'NodeLegend',
      label: '节点图例',
      category: 'analysis',
      component: NodeLegend,
      props: {
        sortKey: 'type',
      },
    },
    MiniMap: {
      id: 'MiniMap',
      label: 'minimap',
      category: 'analysis',
      props: {},
      component: MiniMap,
    },
    NodeTooltip: {
      id: 'NodeTooltip',
      label: '节点提示框',
      category: 'analysis',
      props: {},
      component: NodeTooltip,
    },
    EdgeTooltip: {
      id: 'EdgeTooltip',
      label: '边提示框',
      category: 'analysis',
      props: {},
      component: EdgeTooltip,
    },
    NodeContextMenu: {
      id: 'NodeContextMenu',
      props: {},
      category: 'analysis',
      label: '节点右键菜单',
      component: NodeContextMenu,
    },
    /** 交互组件 */
    CanvasClick: {
      id: 'CanvasClick',
      props: {},
      category: 'behavior',
      label: '点击画布',
      component: CanvasClick,
    },
    Toolbar: {
      id: 'Toolbar',
      label: '工具栏',
      category: 'analysis',
      props: {},
      component: ToolbarA,
    },
    /** 第三方组件 */
    'Liaoyuan-Click-Entity-Node': {
      id: 'Liaoyuan-Click-Entity-Node',
      label: '燎原项目-节点下钻',
      category: 'behavior',
      props: {},
      component: ClickEntity,
    },
    'Liaoyuan-Click-Event-Node': {
      id: 'Liaoyuan-Click-Event-Node',
      label: '燎原项目-高亮下游',
      category: 'behavior',
      props: {},
      component: ClickEvent,
    },
    'graphin-node': {
      id: 'graphin-node',
      label: 'Graphin节点',
      category: 'NODE',
      props: {},
      component: 'node',
    },
    'graphin-edge': {
      id: 'graphin-edge',
      label: 'Graphin边',
      category: 'EDGE',
      props: {},
      component: 'edge',
    },
  };
};

export default getComponentsFromMarket;
