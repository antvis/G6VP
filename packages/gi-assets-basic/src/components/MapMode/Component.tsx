import { useContext } from '@alipay/graphinsight';
import { L7Plot } from '@antv/l7plot';
import * as React from 'react';
import ReactDOM from 'react-dom';

export interface MapModeProps {
  visible?: boolean;
}

const MapMode: React.FunctionComponent<MapModeProps> = props => {
  const context = useContext();
  const { data, graph } = context;
  const { visible } = props;
  if (!visible) {
    return null;
  }
  React.useEffect(() => {
    console.log('data', data, graph.getEdges());

    const geoData = data.nodes.map(node => {
      const n = node.data.data;
      return { ...n, location: [n.longitude, n.latitude] };
    });

    const keys = Object.keys(geoData[0]);

    const edgesData = graph.getEdges().map(edge => {
      const e = edge.get('model').data;
      const source = edge.get('source').get('model').data;
      const target = edge.get('target').get('model').data;

      return {
        ...e,
        lnglat: [
          [source.data.longitude, source.data.latitude],
          [target.data.longitude, target.data.latitude],
        ],
      };
    });
    const center = geoData[0].location;
    const Map = new L7Plot('map-container', {
      map: {
        type: 'mapbox',
        style: 'dark',
        center,
        zoom: 15,
        pitch: 0,
      },
      layers: [
        //线的图层
        {
          name: 'worldLine',
          type: 'pathLayer',
          source: {
            data: edgesData,
            parser: {
              type: 'json',
              coordinates: 'lnglat',
            },
          },
          color: '#41fc9d',
          size: 0.5,
          style: {
            opacity: 0.4,
          },
        },
        //点的图层
        {
          name: 'dotPoint',
          type: 'dotLayer',
          shape: 'circle',
          source: {
            data: geoData,
            parser: {
              type: 'json',
              coordinates: 'location',
            },
          },
          color: '#ffed11',
          size: 40,
          style: {
            opacity: 1,
          },
          animate: {
            speed: 0.8,
          },
        },
      ],
    });
  }, []);

  const Map = (
    <div
      id="map-container"
      style={{
        position: 'absolute',
        left: '0px',
        right: '0px',
        bottom: '0px',
        top: '0px',
      }}
    >
      map
    </div>
  );
  const dom = document.getElementById('graphin-container') as HTMLDivElement;
  return <div>{ReactDOM.createPortal(Map, dom)}</div>;
};

export default MapMode;
