import { IGraphData } from '@antv/gi-sdk';
import { GraphinData } from '@antv/graphin';
const process = item => {};

const getData = (
  type: 'nodes' | 'edges',
  {
    largeGraphData,
    selectItems,
    graphData,
  }: {
    largeGraphData: IGraphData | undefined;
    selectItems: GraphinData;
    graphData: GraphinData;
  },
) => {
  // 计算数据
  let items = graphData[type];
  if (selectItems[type].length !== 0) {
    items = selectItems[type];
  }
  if (largeGraphData) {
    items = largeGraphData[type];
  }
  // 节点和边的数据处理过程不太一样，边要考虑聚合边
  if (type === 'nodes') {
    return items.map(item => ({ ...item.data, id: item.id }));
  }

  if (type === 'edges') {
    //@ts-ignore
    return items.reduce((acc, curr) => {
      const { aggregate } = curr;
      // 表格模式下，需要将聚合边拆开展示
      if (aggregate && aggregate.length > 0) {
        const aggs = aggregate.map(c => {
          return {
            ...c.data,
            id: c.id,
          };
        });
        return [...acc, ...aggs];
      }
      return [
        ...acc,
        {
          ...curr.data,
          id: curr.id,
        },
      ];
    }, []);
  }
};

export default getData;
