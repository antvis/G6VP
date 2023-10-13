import { IGraph, Specification } from '@antv/g6';
import React, { forwardRef, memo, useEffect, useRef, useState } from 'react';
import ExtendGraph from './ExtendGraph';
import Compatible from './compatible';
import { edgeStyleTransform } from './styling/edge-style-transform';
import { nodeStyleTransform } from './styling/node-style-transform';
import { GraphinContext } from './useGraphin';

interface GraphinProps extends Specification<{}, {}> {
  container?: string;
  style?: React.CSSProperties;
  /** 兼容的props  */
  fitView?: boolean;
  onInit?: (graph: any) => void;
  children?: React.ReactNode[];
  /** 是否兼容V2 */
  compatibility?: boolean;
  node?: any;
  edge?: any;
}

const Graphin: React.FunctionComponent<GraphinProps> = forwardRef((props, ref) => {
  const {
    style,
    children,
    compatibility,
    data,
    layout,
    container = `graphin-container-${Math.random()}`,
    onInit,
    node = nodeStyleTransform,
    edge = edgeStyleTransform,
    renderer = 'canvas',
    ...options
  } = props;

  console.log('%c GRAPHIN RENDER....', 'color:rgba(48,86,227,0.8)', ExtendGraph);
  const dataRef = useRef(data);
  const layoutRef = useRef(layout);

  const constantRef = useRef({
    AFTER_RENDER_NODE_MAPPER: false,
    AFTER_RENDER_EDGE_MAPPER: false,
  });

  const [state, setState] = useState<{
    isReady: boolean;
    graph: IGraph;
  }>({
    isReady: false,
    //@ts-ignore
    graph: null,
  });
  const { isReady, graph } = state;

  if (dataRef.current !== data) {
    console.log('%c GRAPHIN DATA CHANGE....', 'color:rgba(48,86,227,0.8)', dataRef.current, data);
    console.time('GRAPHIN_CHANGE_DATA_COST');
    //@ts-ignore
    graph && graph.changeData(data, 'replace');
    //@ts-ignore
    dataRef.current = data;
    console.timeEnd('GRAPHIN_CHANGE_DATA_COST');
  }
  if (layoutRef.current !== layout) {
    console.log('%c GRAPHIN LAYOUT CHANGE....', 'color:rgba(48,86,227,0.8)');
    console.time('GRAPHIN_CHANGE_LAYOUT_COST');
    //@ts-ignore
    graph && graph.layout(layout);
    //@ts-ignore
    layoutRef.current = layout;
    console.timeEnd('GRAPHIN_CHANGE_LAYOUT_COST');
  }
  useEffect(() => {
    if (graph) {
      if (constantRef.current.AFTER_RENDER_EDGE_MAPPER) {
        graph.updateMapper('edge', edge);
      } else {
        graph.once('afterrender', e => {
          constantRef.current.AFTER_RENDER_EDGE_MAPPER = true;
          setTimeout(() => {
            graph.updateMapper('edge', edge);
          }, 0);
        });
      }
    }
  }, [edge, graph]);
  useEffect(() => {
    if (graph) {
      if (constantRef.current.AFTER_RENDER_NODE_MAPPER) {
        graph.updateMapper('node', node);
      } else {
        graph.once('afterrender', e => {
          console.log('afterrender.....node.....');
          constantRef.current.AFTER_RENDER_NODE_MAPPER = true;
          setTimeout(() => {
            graph.updateMapper('node', node);
          }, 0);
        });
      }
    }
  }, [node, graph]);

  useEffect(() => {
    let {
      width,
      height,
      //@ts-ignore
      node,
      //@ts-ignore
      edge,
      // behaviors
      modes = { default: [], lasso: [] },
    } = options;
    const ContainerDOM = document.getElementById(container);

    const { clientWidth, clientHeight } = ContainerDOM as HTMLDivElement;
    width = Number(width) || clientWidth || 500;
    height = Number(height) || clientHeight || 500;

    const instance = new ExtendGraph({
      container,
      width,
      height,
      modes,
      data,
      layout,
      renderer,
      node,
      edge,
      transforms: ['transform-graphin-data'],
    });

    /** @ts-ignore 做兼容性处理 */
    Compatible.graph(instance);

    if (ref) {
      //@ts-ignore
      ref.current = instance;
    }

    onInit && onInit(instance);

    //@ts-ignore
    setState(preState => {
      return {
        ...preState,
        graph: instance,
        isReady: true,
      };
    });

    return () => {
      console.log('%c GRAPHIN DESTORY....', 'color:rgba(48,86,227,1)');
      instance.destroy();
    };
  }, []);

  const containerStyle: React.CSSProperties = {
    height: '100%',
    width: '100%',
    minHeight: '500px',
    position: 'relative',
    ...style,
  };

  if (children) {
    return (
      <GraphinContext.Provider value={state}>
        <>
          <div id={container} style={containerStyle}></div>
          {isReady && children}
        </>
      </GraphinContext.Provider>
    );
  }
  return (
    <>
      <div id={container} style={containerStyle}></div>
    </>
  );
});

export default memo(Graphin);
