import React, { useState, useEffect, useRef } from 'react';
import { Mapbox, GaodeMap } from '@antv/l7-maps';
import { Scene, PointLayer } from '@antv/l7';
import { AMapScene } from '@antv/l7-react';
import { GraphinContext } from '@antv/graphin';
import './index.less';

const Mapmode = ({ visible, updateMapLayout, source }) => {
  const [map, setMap] = useState({ lngLatToContainer: d => d });
  const { GiState, dispatch, setGiState } = GraphinContext as any;

  const posRef = useRef({ x: 0, y: 0 });

  // useEffect(() => {
  //   //   updateMapLayout(pos => map?.lngLatToContainer(pos));
  // }, []);
  const initLayout = (val, lngToContainer) => {
    console.log('data', val);
    const { nodes, edges } = val;
    const renderNodes = nodes.map(node => {
      const pos = lngToContainer(node.data.coord);

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
    // dispatch.changeData({ nodes: renderNodes, edges });
  };

  const transGraph = (ratio, center, trans) => {
    const canvas = document.querySelector('.graphin-core canvas');
    (canvas as any).style.transform = `translate(${center.x}px, ${
      center.y
    }px)scale(${ratio}, ${ratio})translate(${-center.x}px, ${-center.y}px)translate(${trans.x}px, ${trans.y}px)`;
  };

  const onSceneLoaded = React.useCallback(
    scene => {
      console.log('init map ', GiState);
      const mapContainer = scene.getContainer().parentNode;
      const graphinContainer = document.querySelector('#graphin-container');
      graphinContainer?.parentNode?.insertBefore(mapContainer, graphinContainer);

      const zoom = Math.pow(2, scene.mapService.map.getZoom());
      const center = scene.mapService.map.getCenter();

      const centerPos = scene.mapService.map.lngLatToContainer(center);
      setMap(scene.mapService.map);

      initLayout(GiState.data, pos => scene.mapService.map.lngLatToContainer(pos));

      scene.mapService.map.on('mapmove', () => {
        const z = Math.pow(2, scene.mapService.map.getZoom());
        const c = scene.mapService.map.getCenter();
        const cP = scene.mapService.map.lngLatToContainer(center);
        transGraph(
          z / zoom,
          { x: cP.x - centerPos.x, y: cP.y - centerPos.y },
          { x: cP.x - centerPos.x, y: cP.y - centerPos.y },
        );
      });
      scene.mapService.map.on('mousemove', event => {
        posRef.current = { x: event.originEvent.x, y: event.originEvent.y };
      });
    },
    [GiState],
  );
  console.log('gistate', GiState);
  if (GiState.data.nodes.length === 0) {
    return null;
  }
  return (
    <AMapScene
      map={{
        center: [110.19382669582967, 31.258134],
        id: 'testtt',
        pitch: 0,
        style: 'dark',
        zoom: 7,
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // visibility: visible ? 'initial' : 'hidden',
      }}
      onSceneLoaded={onSceneLoaded}
    ></AMapScene>
  );
};

export default Mapmode;
