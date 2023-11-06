import type { GraphinData, IGraph } from '@antv/graphin';
import Graphin from '@antv/graphin';
import deepClone from 'lodash-es/cloneDeep';
import React, { useMemo } from 'react';
import { getMapperByCfg } from './process/getMapperByCfg';
import type { GIEdgeConfig, GILayoutConfig, GINodeConfig } from './typing';
import { registerContext, useContext } from './useContext';

registerContext({
  graph: null,
  apis: {},
  HAS_GRAPH: false,

  data: {
    nodes: [],
    edges: [],
  },
  schemaData: {
    nodes: [],
    edges: [],
  },
  nodes: [],
  edges: [],
  layout: {},
});
interface CanvasProps {}

export type ICanvas = {
  graph: IGraph;
  apis: any;
  HAS_GRAPH: boolean;
  data: GraphinData;
  nodes: GINodeConfig[];
  edges: GIEdgeConfig[];
  layout: GILayoutConfig;
};

const Canvas: React.FunctionComponent<CanvasProps> = props => {
  const { context, updateContext, assets, id, updateGraph } = useContext<ICanvas>();
  const { data, nodes, edges, layout } = context;
  const { elements: ElementAssets } = assets;
  /**
   *  响应 graph 的变化
   */
  const handleGraphInit = ({ graph, apis }) => {
    //@ts-ignore
    window.graph = graph;
    updateGraph(graph);
    updateContext(draft => {
      // draft.graph = graph;
      draft.apis = apis;
      draft.HAS_GRAPH = true;
    });
  };
  /**
   * 响应 config.layout 变化，重新布局
   */
  const runtime_layout = useMemo(() => {
    return deepClone(layout.props);
  }, [layout]);

  /**
   * 响应 config.nodes 变化，重新设置节点样式
   */
  //@ts-ignore
  const nodeMapper = useMemo(() => getMapperByCfg(nodes, ElementAssets), [nodes]);
  /**
   * 响应 config.edges 变化，重新设置节点样式
   */
  //@ts-ignore
  const edgeMapper = useMemo(() => getMapperByCfg(edges, ElementAssets), [edges]);

  console.log('render...canvas...');

  return (
    <Graphin
      container={`${id}-graphin-container`}
      style={{ transform: 'scale(1)' }}
      //@ts-ignore
      node={nodeMapper}
      edge={edgeMapper}
      data={data}
      //@ts-ignore
      layout={runtime_layout}
      onInit={handleGraphInit}
    />
  );
};

export default Canvas;
