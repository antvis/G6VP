import { useContext, useSourceDataMap, utils } from '@antv/gi-sdk';
import Graphin, { GraphinData } from '@antv/graphin';
import React, { memo, useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';
import $i18n from '../../i18n';

const StructAnalysis = () => {
  const { context } = useContext();
  const { data, source, edges: edgesConfig, nodes: nodesConfig } = context;
  const sourceDataMap = useSourceDataMap(source);

  const { nodesConfigMap, edgesConfigMap } = React.useMemo(() => {
    const nodesConfigMap = new Map();
    const edgesConfigMap = new Map();

    nodesConfig!.forEach(c => {
      const key = JSON.stringify(c.expressions);
      nodesConfigMap.set(key, c);
    });
    edgesConfig!.forEach(c => {
      const key = JSON.stringify(c.expressions);
      edgesConfigMap.set(key, c);
    });

    return {
      nodesConfigMap,
      edgesConfigMap,
    };
  }, [edgesConfig, nodesConfig]);

  const [state, updateState] = useImmer<{
    graphStruct: GraphinData;
  }>({
    graphStruct: {
      nodes: [],
      edges: [],
    },
  });

  const nodeMapRef = useRef<Map<string, Set<string>>>(new Map());
  const edgeMapRef = useRef<Map<string, Set<string>>>(new Map());

  useEffect(() => {
    const outDegreeMap = new Map();
    const inDegreeMap = new Map();
    data.edges.forEach(edge => {
      const { source, target } = edge;
      outDegreeMap.set(source, outDegreeMap.has(source) ? outDegreeMap.get(source) + 1 : 1);
      inDegreeMap.set(target, inDegreeMap.has(target) ? inDegreeMap.get(target) + 1 : 1);
    });

    // 入度为 0 的点为起点
    const startNodes: string[] = data.nodes.filter(node => !inDegreeMap.has(node.id)).map(node => node.id);

    // 出度为 0 的点为终点
    const endNodes: string[] = data.nodes.filter(node => !outDegreeMap.has(node.id)).map(node => node.id);

    const graphStruct: GraphinData = { nodes: [], edges: [] };

    const nodeMap = nodeMapRef.current;
    const edgeMap = edgeMapRef.current;

    startNodes.forEach(start => {
      endNodes.forEach(end => {
        const { allNodePath, allEdgePath } = utils.findAllPath(data, start, end, true);

        for (let i = 0; i < allNodePath.length; i++) {
          const nodePath = allNodePath[i];
          const edgePath = allEdgePath[i];
          //const key = getPathKey(nodePath, edgePath, sourceDataMap);
          for (let j = 0; j < nodePath.length; j++) {
            const nodeId = nodePath[j];
            const nodeType = sourceDataMap.nodes[nodeId].nodeType;
            const key = nodeType + j;
            const nodeTypeKeyFromProperties = sourceDataMap.nodes[nodeId].nodeTypeKeyFromProperties;
            const expressions = [
              {
                name: nodeTypeKeyFromProperties,
                operator: 'eql',
                value: nodeType,
              },
            ];

            const exkey = JSON.stringify(expressions);
            const prev = nodesConfigMap.get(exkey);
            const color = (prev && prev.props && prev.props.color) || '#ddd';

            graphStruct.nodes.push({
              id: key,
              style: {
                keyshape: {
                  size: 20,
                  fill: color,
                  fillOpacity: 1,
                },
                label: {
                  value: nodeType,
                },
              },
            });

            const set = nodeMap.has(key) ? nodeMap.get(key) : new Set<string>();
            set!.add(nodeId);
            nodeMap.set(key, set!);
          }

          for (let j = 0; j < edgePath.length; j++) {
            const edgeId = edgePath[j];
            const edgeType = sourceDataMap.edges[edgeId].edgeType;
            const source = nodePath[j];
            const target = nodePath[j + 1];
            const sourceNodeType = sourceDataMap.nodes[source].nodeType + j;
            const targetNodeType = sourceDataMap.nodes[target].nodeType + (j + 1);
            const key = sourceNodeType + '-' + targetNodeType + j;

            const edgeTypeKeyFromProperties = sourceDataMap.edges[edgeId].edgeTypeKeyFromProperties;

            const expressions = [
              {
                name: edgeTypeKeyFromProperties,
                operator: 'eql',
                value: edgeType,
              },
            ];

            const exkey = JSON.stringify(expressions);
            const prev = edgesConfigMap.get(exkey);
            const color = (prev && prev.props && prev.props.color) || '#ddd';

            graphStruct.edges.push({
              source: sourceNodeType,
              target: targetNodeType,
              id: key,
              style: {
                keyshape: {
                  stroke: color,
                },
                label: {
                  value: edgeType,
                  fill: color,
                  fontSize: 12,
                },
              },
            });

            const set = edgeMap.has(key) ? edgeMap.get(key) : new Set<string>();
            set!.add(edgeId);
            edgeMap.set(key, set!);
          }
        }
      });
    });

    graphStruct.nodes = utils.uniqueElementsBy(graphStruct.nodes, (a, b) => a.id === b.id);
    graphStruct.edges = utils.uniqueElementsBy(graphStruct.edges, (a, b) => a.id === b.id);

    // icon 设置为源节点数
    graphStruct.nodes = graphStruct.nodes.map(node => {
      return {
        ...node,
        style: {
          ...node.style,
          icon: {
            type: 'text',
            value: String(nodeMap.get(node.id)?.size || 0),
            stroke: '#fff',
            fill: '#fff',
          },
        },
      };
    });

    updateState(draft => {
      draft.graphStruct = graphStruct;
    });
  }, [data, sourceDataMap]);

  return (
    <>
      <div style={{ margin: '8px 0', textAlign: 'center' }}>
        {$i18n.get({
          id: 'advance.components.StructAnalysis.Component.AnalyzeTheSchemaAbstractionStructure',
          dm: '分析当前画布中所有路径的 Schema 抽象结构，即路径中节点与边的类型组合',
        })}
      </div>
      <Graphin
        data={state.graphStruct}
        style={{ background: 'var(--background-color)' }}
        layout={{
          type: 'dagre',
        }}
      ></Graphin>
    </>
  );
};

export default memo(StructAnalysis);
