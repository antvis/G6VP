import { Behaviors, GraphinContext } from '@antv/graphin';
import { Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import React, { useEffect, useRef } from 'react';

const { ZoomCanvas, DragCanvas } = Behaviors;

const Mapmode = () => {
  const { GiState, setGiState } = GraphinContext as any;
  const { graph } = React.useContext(GraphinContext);
  const posRef = useRef({ x: 0, y: 0 });
  const scenceRef = useRef({});

  useEffect(() => {
    const scene = new Scene({
      id: document.querySelector('.graphin-core') as HTMLDivElement,
      map: new Mapbox({
        style: 'dark',
        pitch: 43,
        center: [120.13383079335335, 29.651873105004427],
        zoom: 3,
      }),
    });

    scene.on('load', () => {
      onSceneLoaded(scene);
    });
    scenceRef.current = scene;
    // return () => cleanup(scene);
  }, []);
  const cleanup = scene => {
    //@ts-ignore
    scenceRef.current.destroy();
  };
  const initLayout = (val, lngToContainer) => {
    const { nodes, edges } = val;
    const renderNodes = nodes.map(node => {
      const pos = lngToContainer(node.data.coord || [120.13383079335335, 29.651873105004427]);

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
      <button onClick={cleanup}></button>
    </>
  );
};

export default Mapmode;
