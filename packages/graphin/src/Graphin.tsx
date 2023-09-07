import { Extensions, Graph as G6Graph, Specification, extend } from '@antv/g6';
import React, { forwardRef, memo, useEffect, useImperativeHandle, useState } from 'react';
import { GraphinContext } from './useGraphin';

interface GraphinProps extends Specification<{}, {}> {
  container?: string;
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  /** 兼容的props  */
  fitView?: boolean;
}

const Graphin: React.FunctionComponent<GraphinProps> = forwardRef((props, ref) => {
  const { containerStyle, children, container, ...options } = props;

  const { width, height, data, node, edge, modes, layout } = options;
  const [state, setState] = useState({
    graph: null,
    layout: {},
    data: {},
    isReady: false,
  });
  const { graph, isReady } = state;

  useImperativeHandle(
    ref,
    () => {
      return {
        get graph() {
          return graph;
        },
        get isReady() {
          return isReady;
        },
      };
    },
    [graph, isReady],
  );

  useEffect(() => {
    console.log('Extensions', Extensions);
    const Graph = extend(G6Graph, {
      plugins: {
        minimap: Extensions.Minimap,
      },
    });
    const graph = new Graph({
      container,
      width,
      height,
      modes,
      data,
      node,
      edge,
      layout,
    });
    //@ts-ignore
    setState(preState => {
      return {
        ...preState,
        graph,
        isReady: true,
      };
    });
    return () => {
      graph.destroy();
    };
  }, []);
  useEffect(() => {}, []);

  if (!isReady) {
    return null;
  }
  if (children) {
    <GraphinContext.Provider value={state}>
      <div>
        <div
          id={container || 'graphin-container'}
          style={{
            height: '100%',
            width: '100%',
            position: 'relative',
            ...containerStyle,
          }}
        ></div>
        {children}
      </div>
    </GraphinContext.Provider>;
  }
  return <div id={container}></div>;
});

export default memo(Graphin);
