import { MiniMap } from '@antv/graphin-components';
import { NodeContextMenu } from './ContextMenu';
import getLegendMappingKey from './Legend/getLegendMappingKey';
import LegendA from './Legend/LegendA';
import ClickEntity from './Liaoyuan/ClickEntity';
import ClickEvent from './Liaoyuan/ClickEvent';
import { EdgeTooltip, NodeTooltip } from './Tooltip';

/**
 * 组件市场
 * 当前为临时方案：未来这部分组件的定义，需要存储在服务器端，拆包到 gi-components
 */
const getComponentsFromMarket: any = config => {
  const legendSortKey = getLegendMappingKey(config);
  return {
    /*** 官方组件 */
    Legend: {
      id: 'Legend',
      label: '图例',
      category: 'analysis',
      component: LegendA,
      props: {
        sortKey: legendSortKey,
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
    /** 第三方组件 */
    'Liaoyuan-Click-Entity-Node': {
      id: 'Liaoyuan-Click-Entity-Node',
      label: '燎原项目-节点下钻',
      category: 'events',
      props: {},
      component: ClickEntity,
    },
    'Liaoyuan-Click-Event-Node': {
      id: 'Liaoyuan-Click-Event-Node',
      label: '燎原项目-高亮下游',
      category: 'events',
      props: {},
      component: ClickEvent,
    },
  };
};

export default getComponentsFromMarket;
