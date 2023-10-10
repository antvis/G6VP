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

  const dataRef = useRef(data);
  const layoutRef = useRef(layout);
  const nodeMapperRef = useRef(node);
  const edgeMapperRef = useRef(edge);

  const [state, setState] = useState<{
    isReady: boolean;
    graph: null | IGraph;
  }>(() => ({
    isReady: false,
    graph: null,
  }));
  const { isReady, graph } = state;
  console.log('%c GRAPHIN RENDER....', 'color:rgba(48,86,227,1)', nodeMapperRef.current, node);
  useEffect(() => {
    if (nodeMapperRef.current !== node) {
      console.log('%c GRAPHIN NODE MAPPER CHANGE....', 'color:rgba(48,86,227,0.8)', node, graph);
      //@ts-ignore
      graph && graph.updateMapper('node', node);
      nodeMapperRef.current = node;
    }
    if (edgeMapperRef.current !== edge) {
      console.log('%c GRAPHIN EDGE MAPPER CHANGE....', 'color:rgba(48,86,227,0.8)');
      //@ts-ignore
      graph && graph.updateMapper('edge', edge);
      edgeMapperRef.current = edge;
    }
    if (dataRef.current !== data) {
      // console.log('%c GRAPHIN DATA CHANGE....', 'color:rgba(48,86,227,0.8)', dataRef.current, data);
      console.time('GRAPHIN_CHANGE_DATA_COST');
      //@ts-ignore
      graph && graph.changeData(data, 'replace');
      //@ts-ignore
      dataRef.current = data;
      console.timeEnd('GRAPHIN_CHANGE_DATA_COST');
    }
    if (layoutRef.current !== layout) {
      // console.log('%c GRAPHIN LAYOUT CHANGE....', 'color:rgba(48,86,227,0.8)');
      console.time('GRAPHIN_CHANGE_LAYOUT_COST');
      //@ts-ignore
      graph && graph.layout(layout);
      //@ts-ignore
      layoutRef.current = layout;
      console.timeEnd('GRAPHIN_CHANGE_LAYOUT_COST');
    }
  }, [data, layout, node, edge]);

  useEffect(() => {
    let {
      width,
      height,
      // node = nodeStyleTransform,
      // edge = edgeStyleTransform,
      // behaviors
      modes = { default: ['zoom-canvas', 'drag-canvas', 'drag-node'] },
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
      // //@ts-ignore
      // node,
      // // //@ts-ignore
      // edge,
      layout,
      renderer,
      transforms: ['transform-graphin-data'],
    });
    console.log('init ...', instance, ref);

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

    instance.once('afterrender', e => {
      console.log('afterlayout', nodeMapperRef.current, edgeMapperRef.current);
      //@ts-ignore
      instance.updateMapper('node', nodeMapperRef.current);
      //@ts-ignore
      instance.updateMapper('edge', edgeMapperRef.current);
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
  return <div id={container} style={containerStyle}></div>;
});

export default memo(Graphin);
