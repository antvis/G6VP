import getLegendMappingKey from './Legend/getLegendMappingKey';
import LegendA from './Legend/LegendA';
import ClickEntity from './Liaoyuan/ClickEntity';

/**
 * 组件市场
 * 当前为临时方案：未来这部分组件的定义，需要存储在服务器端，拆包到 gi-components
 */
const getComponentsFromMarket: any = config => {
  const legendSortKey = getLegendMappingKey(config);
  return {
    'LEGEND-A': {
      id: 'LEGEND-A',
      component: LegendA,
      props: {
        sortKey: legendSortKey,
      },
    },
    'Liaoyuan-Click-Entity': {
      id: 'Liaoyuan-Click-Entity',
      props: {},
      component: ClickEntity,
    },
  };
};

export default getComponentsFromMarket;
