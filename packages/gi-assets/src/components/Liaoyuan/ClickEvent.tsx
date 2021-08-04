import { GraphinContext } from '@antv/graphin';
import React from 'react';
import { clearAllStates, getSourcesByNode, highlightNodeById, traverseTargetsByNode, uniqueElementsBy } from './utils';
const getEntityByEventNode = eventNode => {
  /** 递归遍历下游节点 */
  const targets = traverseTargetsByNode(eventNode);
  /** 遍历上游一度节点 */
  const sources = getSourcesByNode(eventNode, source => {
    return source.data.type === 'ENTITY';
  });
  return [...sources, ...targets];
};

const ClickEventNode = props => {
  const { graph } = React.useContext(GraphinContext);
  //@ts-ignore
  const { services, dispatch } = GraphinContext;
  const { serviceId } = props;

  React.useEffect(() => {
    const handleClick = (e: any) => {
      if (e.item.getModel().data.type === 'EVENT') {
        clearAllStates(graph);
        graph.setItemState(e.item, 'selected', true);
        const { id } = e.item.getModel();

        const entities = getEntityByEventNode(e.item);
        const entityIds = entities.map(node => {
          return node.getModel().id;
        });

        //@TODO
        const { service } = services.find(sr => sr.id === serviceId);

        services.getSubGraphData(entityIds).then(res => {
          const ids = res.nodes.map(node => {
            return node.id;
          });
          //  如果不清除之前的图，逻辑如下
          // const { nodes, edges } = graph.save() as {
          //   nodes: any[];
          //   edges: any[];
          // };

          services.getGraphData().then(r => {
            const { nodes, edges } = r;
            /** 修改数据 */
            dispatch.changeData({
              nodes: uniqueElementsBy([...nodes, ...res.nodes], (a, b) => {
                return a.id === b.id;
              }),
              edges: uniqueElementsBy([...edges, ...res.edges], (a, b) => {
                return a.source === b.source && a.target === b.target;
              }),
            });
            /** 高亮节点 */
            highlightNodeById(graph)([...ids, id, ...entityIds]);
          });
        });
      }
    };
    graph.on('node:click', handleClick);
    return () => {
      graph.off('node:click', handleClick);
    };
  }, [graph]);
  return null;
};

export default ClickEventNode;
