import { useContext } from '@antv/gi-sdk';
import React, { useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';
import { ColorMap, LabelMap } from './util';
import Graphin, { Behaviors, GraphinData } from '@antv/graphin';
import './index.less';

const { ClickSelect } = Behaviors;

export interface FlowGraphProps {
  nodeIds: string[];
}

const FlowGraph: React.FC<FlowGraphProps> = props => {
  const graphRef = useRef();
  const { nodeIds } = props;
  const { history } = useContext();
  const [state, updateState] = useImmer({
    graphData: {
      nodes: [],
      edges: [],
    } as GraphinData,
  });

  const { graphData } = state;

  useEffect(() => {
    const edges: any = [];
    const nodes: any = [
      // 开始节点
      {
        id: 'start',
        type: 'circle',
        label: '开始',
        style: {
          fill: '#ccc',
          r: 20,
          lineWidth: 0,
        },
      },
      // 结束节点
      {
        id: 'end',
        label: '+',
        style: {
          lineDash: [5, 5],
          lineWidth: 2,
          stroke: '#ccc',
          fill: '#fff',
        },
        labelCfg: {
          style: {
            fill: '#ccc',
          },
        },
      },
    ];
    if (!history?.length || !nodeIds?.length) {
      updateState(draft => {
        draft.graphData = {
          nodes,
          edges: [{ source: 'start', target: 'end' }],
        };
      });
      return;
    }
    let lastNodeId;
    history.forEach(item => {
      const { id, type, subType, statement, timestamp } = item;
      if (!nodeIds.includes(id)) return;
      const color = ColorMap[type];
      if (lastNodeId) {
        edges.push({
          source: lastNodeId,
          target: id,
        });
      }
      lastNodeId = id;
      nodes.splice(nodes.length - 2, 0, {
        ...item,
        label: `${LabelMap[type]}(${subType})`,
        style: {
          fill: color,
          lineWidth: 0,
        },
        statement: { statement, timestamp },
      });
    });
    edges.push({
      source: 'start',
      target: nodeIds[0],
    });
    edges.push({
      source: nodeIds[nodeIds.length - 1],
      target: 'end',
    });
    updateState(draft => {
      draft.graphData = { nodes, edges };
    });
  }, [history, nodeIds]);

  useEffect(() => {
    const graph = (graphRef?.current as any)?.graph;
    if (graph && !graph.destroyed) {
      graph.on('node:click', handleNodeClick);
    }
    return () => {
      graph.off('node:click', handleNodeClick);
    };
  }, [graphRef]);

  const handleNodeClick = evt => {};

  return (
    <Graphin
      ref={graphRef as any}
      data={graphData}
      height={800}
      style={{ background: 'var(--background-color)' }}
      layout={{
        type: 'dagre',
        ranksep: 10,
      }}
      defaultNode={{
        type: 'rect',
        anchorPoints: [
          [0.5, 0],
          [0.5, 1],
        ],
        labelCfg: {
          style: {
            fill: '#fff',
          },
        },
      }}
    >
      <ClickSelect />
    </Graphin>
  );
};

export default FlowGraph;
