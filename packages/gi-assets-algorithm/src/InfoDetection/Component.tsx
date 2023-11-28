import { detectAllCycles } from '@antv/algorithm';

import { useContext } from '@antv/gi-sdk';
import { NodeConfig } from '@antv/graphin';
import { List } from 'antd';
import React, { memo, useState } from 'react';
import $i18n from '../i18n';
import DegreeScatter from './DegreeScatter';
import './index.less';

type INode = any;

const InfoDetection = () => {
  const { context, graph } = useContext();
  const { data } = context;
  console.log('InfoDetection HAS GRAPH', graph && !graph.destroyed);

  const [isolateNodes, setIsolateNodes] = useState<NodeConfig[]>([]);
  const [circles, setCircles] = useState<object[]>([]);
  const [selectedIsolate, setSelectedIsolate] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState(false);
  const [inDegree, setInDegree] = useState<Map<number, number>>(new Map());
  const [outDegree, setOutDegree] = useState<Map<number, number>>(new Map());
  const [totalDegree, setTotalDegree] = useState<Map<number, number>>(new Map());

  React.useEffect(() => {
    const isolateNodes = data.nodes.filter(item => {
      const edges = graph.getRelatedEdgesData(item.id, 'both');
      return edges.length === 0;
    });

    const circles = detectAllCycles(data, false);

    // const pageRankRes = pageRank(data);
    // const totalPageRank = Object.keys(pageRankRes).reduce((acc, cur) => {
    //     return acc + pageRankRes[cur]
    // }, 0)
    // const avgPageRank = totalPageRank / Object.keys(pageRankRes).length;

    // const avgDegree = data.edges.length * 2 / data.nodes.length;

    const inDegreeCalc = new Map();
    const outDegreeCalc = new Map();
    const totalDegreeCalc = new Map();
    data.nodes.forEach(node => {
      const edges = graph.getRelatedEdgesData(node.id);
      // 总度数为节点相连的边的数量
      const total = edges.length;
      let inD = 0;
      let outD = 0;
      edges.forEach(edge => {
        const { source } = edge;
        if (source === node.id) {
          outD++;
        } else {
          inD++;
        }
      });
      inDegreeCalc.set(inD, inDegreeCalc.has(inD) ? inDegreeCalc.get(inD) + 1 : 1);
      outDegreeCalc.set(outD, outDegreeCalc.has(outD) ? outDegreeCalc.get(outD) + 1 : 1);
      totalDegreeCalc.set(total, totalDegreeCalc.has(total) ? totalDegreeCalc.get(total) + 1 : 1);
    });

    setIsolateNodes(isolateNodes);
    setCircles(circles);
    setInDegree(inDegreeCalc);
    setOutDegree(outDegreeCalc);
    setTotalDegree(totalDegreeCalc);
  }, [data]);

  React.useEffect(() => {
    data.nodes.forEach(item => {
      graph.getNodeData(item.id) && graph.setItemState(item.id, 'active', false);
    });

    data.edges.forEach(item => {
      graph.getEdgeData(item.id) && graph.setItemState(item.id, 'active', false);
    });

    if (selectedIsolate) {
      isolateNodes.forEach(node => {
        graph.getNodeData(node.id) && graph.setItemState(node.id, 'active', true);
      });
    }

    if (selectedCircle) {
      circles.forEach(circle => {
        const start = Object.keys(circle)[0];
        // 遍历环 高亮环上所有的节点和边
        let cur = start;
        do {
          graph.setItemState(cur, 'active', true);
          const next = circle[cur].id;

          const edges = graph.getRelatedEdgesData(cur);
          edges.forEach(edge => {
            const { source, target, id } = edge;
            if ((source === cur && target == next) || (source == next && target === cur)) {
              graph.setItemState(id, 'active', true);
            }
          });
          cur = next;
        } while (cur !== start);
      });
    }
  }, [selectedIsolate, selectedCircle]);

  return (
    <div className="gi-info-detection">
      <List>
        <List.Item
          key="isolate"
          extra={<div>{isolateNodes.length}</div>}
          onClick={() => setSelectedIsolate(old => !old)}
          style={{
            border: selectedIsolate ? 'solid blue 1px' : 'none',
          }}
        >
          {$i18n.get({ id: 'gi-assets-algorithm.src.InfoDetection.Component.IsolatedPoint', dm: '孤立点' })}
        </List.Item>
        <List.Item
          key="circle"
          extra={<div>{circles.length}</div>}
          onClick={() => setSelectedCircle(old => !old)}
          style={{
            border: selectedCircle ? 'solid blue 1px' : 'none',
          }}
        >
          {$i18n.get({ id: 'gi-assets-algorithm.src.InfoDetection.Component.Ring', dm: '环' })}
        </List.Item>
      </List>
      <DegreeScatter degree={{ inDegree, outDegree, totalDegree }}></DegreeScatter>
    </div>
  );
};

export default memo(InfoDetection);
