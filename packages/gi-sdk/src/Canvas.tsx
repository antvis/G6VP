import Graphin from '@antv/graphin';
import deepClone from 'lodash-es/cloneDeep';
import React, { useMemo } from 'react';
import { registerContext, useContext } from './Context';
import { getMapperByCfg } from './process/getMapperByCfg';

const initialCanvasStore = {
  apis: {},
  HAS_GRAPH: false,
  data: {
    nodes: [],
    edges: [],
  },
  source: {
    nodes: [],
    edges: [],
  },
  schemaData: {
    nodes: [],
    edges: [],
  },
  nodes: [],
  edges: [],
  layout: {
    id: 'Force2',
    props: {
      type: 'force',
    },
  },
  isLoading: false,
  largeGraphLimit: 1000,
  largeGraphMode: false,
  renderer: 'canvas', //'webgl-3d',
};
registerContext(initialCanvasStore);
interface CanvasProps {}

const Canvas: React.FunctionComponent<CanvasProps> = props => {
  const { context, updateContext, assets, id, updateGraph } = useContext<typeof initialCanvasStore>();
  const { data, nodes, edges, layout, renderer } = context;
  const { elements: ElementAssets } = assets;
  /**
   *  响应 graph 的变化
   */
  const handleGraphInit = ({ graph, apis }) => {
    //@ts-ignore
    window.graph = graph;
    updateGraph(graph);
    updateContext(draft => {
      draft.apis = apis;
      draft.HAS_GRAPH = true;
    });
  };
  const handleUnMount = () => {
    //@ts-ignore
    updateGraph(null);
    updateContext(draft => {
      Object.keys(initialCanvasStore).forEach(key => {
        draft[key] = initialCanvasStore[key];
      });
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
  const nodeMapper = useMemo(() => getMapperByCfg(nodes, ElementAssets, { renderer, reset: true }), [nodes, renderer]);
  /**
   * 响应 config.edges 变化，重新设置节点样式
   */
  //@ts-ignore
  const edgeMapper = useMemo(() => getMapperByCfg(edges, ElementAssets, { renderer, reset: true }), [edges, renderer]);

  return (
    <Graphin
      container={`${id}-graphin-container`}
      style={{ transform: 'scale(1)' }}
      //@ts-ignore
      node={nodeMapper}
      edge={edgeMapper}
      data={data}
      //@ts-ignore
      renderer={renderer}
      //@ts-ignore
      layout={runtime_layout}
      onInit={handleGraphInit}
      unMount={handleUnMount}
    />
  );
};

export default Canvas;
