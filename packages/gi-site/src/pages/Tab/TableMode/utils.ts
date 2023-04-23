import { IGraphData } from '@antv/gi-sdk/src/process/schema';
import { GraphinData } from '@antv/graphin';

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
  if (selectItems[type].length !== 0) {
    return selectItems[type].map(item => ({ ...item.data, id: item.id }));
  }
  if (largeGraphData) {
    return largeGraphData[type].map(item => ({ ...item.data, id: item.id }));
  }
  return graphData[type].map(item => ({ ...item.data, id: item.id }));
};
export default getData;
