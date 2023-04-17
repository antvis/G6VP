import { detectAllCycles } from '@antv/algorithm';
import { INode } from '@antv/g6';
import { useContext } from '@antv/gi-sdk';
import { NodeConfig } from '@antv/graphin';
import { List } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';
import DegreeScatter from './DegreeScatter';
import './index.less';
import { IDegreeState } from './type';

interface IState {
  isolateNodes: NodeConfig[];
  circles: object[];
  //   avgPageRank: number;
  //   avgDegree: number;
}

const InfoDetection = () => {
  const { data, graph } = useContext();
  console.log('InfoDetection HAS GRAPH', graph && !graph.destroyed);

  const [state, updateState] = useImmer<IState>({
    isolateNodes: [],
    circles: [],
    // avgPageRank: 0,
    // avgDegree: 0,
  });

  const [selectedItems, setSelectedItems] = useImmer({
    isolate: false,
    circle: false,
  });

  const [degree, updateDegree] = useImmer<IDegreeState>({
    inDegree: new Map(),
    outDegree: new Map(),
    totalDegree: new Map(),
  });

  React.useEffect(() => {
    const isolateNodes = data.nodes.filter(item => {
      const node = graph.findById(item.id) as INode;
      return node.getEdges().length === 0;
    });

    const circles = detectAllCycles(data, false);

    // const pageRankRes = pageRank(data);
    // const totalPageRank = Object.keys(pageRankRes).reduce((acc, cur) => {
    //     return acc + pageRankRes[cur]
    // }, 0)
    // const avgPageRank = totalPageRank / Object.keys(pageRankRes).length;

    // const avgDegree = data.edges.length * 2 / data.nodes.length;

    const inDegree = new Map();
    const outDegree = new Map();
    const totalDegree = new Map();
    data.nodes.forEach(node => {
      const nodeItem = graph.findById(node.id) as INode;
      const edges = nodeItem.getEdges();
      // 总度数为节点相连的边的数量
      const total = edges.length;
      let inD = 0;
      let outD = 0;
      edges.forEach(edge => {
        const { source } = edge.getModel();
        if (source === node.id) {
          outD++;
        } else {
          inD++;
        }
      });
      inDegree.set(inD, inDegree.has(inD) ? inDegree.get(inD) + 1 : 1);
      outDegree.set(outD, outDegree.has(outD) ? outDegree.get(outD) + 1 : 1);
      totalDegree.set(total, totalDegree.has(total) ? totalDegree.get(total) + 1 : 1);
    });

    updateState(draft => {
      draft.isolateNodes = isolateNodes;
      draft.circles = circles;
      // draft.avgPageRank = avgPageRank;
      // draft.avgDegree = avgDegree;
    });

    updateDegree(draft => {
      draft.inDegree = inDegree;
      draft.outDegree = outDegree;
      draft.totalDegree = totalDegree;
    });
  }, [data]);

  React.useEffect(() => {
    data.nodes.forEach(item => {
      graph.findById(item.id) && graph.setItemState(item.id, 'active', false);
    });

    data.edges.forEach(item => {
      graph.findById(item.id) && graph.setItemState(item.id, 'active', false);
    });

    if (selectedItems.isolate) {
      state.isolateNodes.forEach(node => {
        graph.findById(node.id) && graph.setItemState(node.id, 'active', true);
      });
    }

    if (selectedItems.circle) {
      state.circles.forEach(circle => {
        const start = Object.keys(circle)[0];
        // 遍历环 高亮环上所有的节点和边
        let cur = start;
        do {
          graph.setItemState(cur, 'active', true);
          const next = circle[cur].id;
          const item = graph.findById(cur) as INode;
          const edges = item.getEdges();
          edges.forEach(edge => {
            const { source, target, id } = edge.getModel();
            if ((source === cur && target == next) || (source == next && target === cur)) {
              graph.setItemState(edge.getID(), 'active', true);
            }
          });
          cur = next;
        } while (cur !== start);
      });
    }
  }, [selectedItems]);

  return (
    <div className="gi-info-detection">
      <List>
        <List.Item
          key="isolate"
          extra={<div>{state.isolateNodes.length}</div>}
          onClick={() =>
            setSelectedItems(draft => {
              draft.isolate = !draft.isolate;
            })
          }
          style={{
            border: selectedItems.isolate ? 'solid blue 1px' : 'none',
          }}
        >
          孤立点
        </List.Item>
        <List.Item
          key="circle"
          extra={<div>{state.circles.length}</div>}
          onClick={() =>
            setSelectedItems(draft => {
              draft.circle = !draft.circle;
            })
          }
          style={{
            border: selectedItems.circle ? 'solid blue 1px' : 'none',
          }}
        >
          环
        </List.Item>
      </List>
      <DegreeScatter degree={degree}></DegreeScatter>
    </div>
  );
};

export default InfoDetection;
