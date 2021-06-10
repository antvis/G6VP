import { MiniMap } from '@antv/graphin-components';
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
      component: LegendA,
      props: {
        sortKey: legendSortKey,
      },
    },
    MiniMap: {
      id: 'MiniMap',
      props: {},
      component: MiniMap,
    },
    NodeTooltip: {
      id: 'NodeTooltip',
      props: {},
      component: NodeTooltip,
    },
    EdgeTooltip: {
      id: 'EdgeTooltip',
      props: {},
      component: EdgeTooltip,
    },
    /** 第三方组件 */

    'Liaoyuan-Click-Entity-Node': {
      id: 'Liaoyuan-Click-Entity-Node',
      props: {},
      component: ClickEntity,
    },
    'Liaoyuan-Click-Event-Node': {
      id: 'Liaoyuan-Click-Event-Node',
      props: {},
      component: ClickEvent,
    },
  };
};

export default getComponentsFromMarket;
