import { Behaviors, GraphinContext } from '@antv/graphin';
import { Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import React, { useEffect, useRef, useState } from 'react';

const { ZoomCanvas, DragCanvas } = Behaviors;

const Mapmode = props => {
  const { GiState, setGiState } = GraphinContext as any;
  const { graph } = React.useContext(GraphinContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const scenceRef = useRef({} as Scene);
  const initlayout = useRef({});

  useEffect(() => {
    const scene = new Scene({
      id: document.querySelector('.graphin-core') as HTMLDivElement,
      map: new Mapbox({
        style: props.mapmode.theme,
        pitch: 43,
        center: [113.033, 29.65],
        zoom: 7,
      }),
    });

    scene.on('load', () => {
      onSceneLoaded(scene);
      setIsLoaded(true);
    });

    scenceRef.current = scene;
    initlayout.current = GiState.layout;
    return () => cleanup(scene);
  }, []);

  React.useLayoutEffect(() => {
    if (!isLoaded) return;
    scenceRef.current?.setMapStyle(props.mapmode.style);
  }, [props.mapmode.theme]);

  const cleanup = scene => {
    //画布移动回graphin内部
    const mapCanvas = document.querySelector('.mapboxgl-canvas');
    const graphCanvas = mapCanvas?.parentNode?.lastChild as HTMLElement;
    const container = document.querySelector('#graphin-container') as HTMLElement;
    container.appendChild(graphCanvas);

    scene.destroy();

    const graphContainer = document.querySelector('.graphin-core') as HTMLElement;
    graphContainer.appendChild(graphCanvas);
    //布局还原

    setGiState({
      ...GiState,
      layout: {
        ...initlayout.current,
      },
    });
  };
  const initLayout = (val, lngToContainer) => {
    const { nodes, edges } = val;
    const renderNodes = nodes.map(node => {
      const pos = lngToContainer(node.data.coord || [113.033, 29.65]);

      return {
        ...node,
        x: pos.x,
        y: pos.y,
      };
    });
    // graph.changeData({ nodes: renderNodes, edges });
    setGiState({
      ...GiState,
      data: {
        nodes: renderNodes,
        edges,
      },
      layout: {
        type: 'preset',
      },
      animate: false,
    });
  };
  const onSceneLoaded = scene => {
    // 图画布移动到地图上侧
    const graphCanvas = document.querySelector('.graphin-core canvas') as HTMLElement;
    graphCanvas.style.position = 'relative';
    const mapCanvas = document.querySelector('.mapboxgl-canvas');
    mapCanvas?.parentNode?.appendChild(graphCanvas);

    const zoom = Math.pow(2, scene.mapService.map.getZoom());
    const center = scene.mapService.map.getCenter();

    const centerPos = scene.mapService.map.project(center);

    initLayout(GiState.data, pos => scene.mapService.map.project(pos));

    scene.mapService.map.on('move', () => {
      graph.stopAnimate();
      initLayout(GiState.data, pos => scene.mapService.map.project(pos));
    });
  };
  return (
    <>
      <ZoomCanvas disabled={true} />
      <DragCanvas disabled={true} />
    </>
  );
};

export default Mapmode;
