import { IGraph, Specification } from '@antv/g6';
import React, { forwardRef, memo, useEffect, useImperativeHandle, useState } from 'react';
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
    ...options
  } = props;

  const [state, setState] = useState<{
    isReady: boolean;
    graph: null | IGraph;
  }>({
    isReady: false,
    graph: null,
  });
  const { isReady, graph } = state;

  useEffect(() => {
    let {
      width,
      height,
      node = nodeStyleTransform,
      edge = edgeStyleTransform,
      // behaviors
      modes = { default: ['zoom-canvas', 'drag-canvas', 'drag-node'] },
    } = options;
    const ContainerDOM = document.getElementById(container);
    console.log('init ...', edge);

    const { clientWidth, clientHeight } = ContainerDOM as HTMLDivElement;
    width = Number(width) || clientWidth || 500;
    height = Number(height) || clientHeight || 500;

    const instance = new ExtendGraph({
      container,
      width,
      height,
      modes,
      data,
      //@ts-ignore
      node,
      //@ts-ignore
      edge,
      layout,
      transforms: ['transform-graphin-data'],
    });

    /** @ts-ignore 做兼容性处理 */
    Compatible.graph(instance);

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

  useImperativeHandle(
    ref,
    () => {
      return {
        get graph() {
          return graph;
        },
      };
    },
    [isReady],
  );

  useEffect(() => {
    if (graph) {
      console.log('%c GRAPHIN DATA CHANGE....', 'color:rgba(48,86,227,0.8)');
      //@ts-ignore
      graph.changeData(data, 'replace');
    }
  }, [data]);
  useEffect(() => {
    if (graph) {
      console.log('%c GRAPHIN LAYOUT CHANGE....', 'color:rgba(48,86,227,0.8)');
      //@ts-ignore
      graph.layout(layout);
    }
  }, [layout]);

  const containerStyle: React.CSSProperties = {
    height: '100%',
    width: '100%',
    minHeight: '500px',
    position: 'relative',
    ...style,
  };

  console.log('%c GRAPHIN RENDER....', 'color:rgba(48,86,227,1)');

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
