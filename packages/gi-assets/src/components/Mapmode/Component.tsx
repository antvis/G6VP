import React, { useState, useEffect, useRef } from 'react';
import { Mapbox } from '@antv/l7-maps';
import { Scene } from '@antv/l7';
import { GraphinContext, Behaviors } from '@antv/graphin';

const { ZoomCanvas, DragCanvas } = Behaviors;

const Mapmode = () => {
  const { GiState, setGiState } = GraphinContext as any;

  const posRef = useRef({ x: 0, y: 0 });

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
    return () => cleanup(scene);
  }, []);
  const cleanup = scene => {
    scene.destroy();
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
    setGiState({
      ...GiState,
      data: {
        nodes: renderNodes,
        edges,
      },
      layout: {
        type: 'preset',
      },
    });
  };

  const transGraph = (ratio, center, trans, canvas) => {
    (canvas as any).style.transform = `translate(${center.x}px, ${
      center.y
    }px)scale(${ratio}, ${ratio})translate(${-center.x}px, ${-center.y}px)translate(${trans.x}px, ${trans.y}px)`;
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
      const z = Math.pow(2, scene.mapService.map.getZoom());
      const c = scene.mapService.map.getCenter();
      const cP = scene.mapService.map.project(center);
      transGraph(
        z / zoom,
        { x: cP.x - centerPos.x, y: cP.y - centerPos.y },
        { x: cP.x - centerPos.x, y: cP.y - centerPos.y },
        graphCanvas,
      );
    });
    scene.mapService.map.on('mousemove', event => {
      posRef.current = { x: event.originalEvent.x, y: event.originalEvent.y };
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
