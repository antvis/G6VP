import { extra, useContext } from '@alipay/graphinsight';
import type { GIAComponentProps } from '@alipay/graphinsight/lib/components/GIAC';
import { L7Plot } from '@antv/l7plot';
import * as React from 'react';
import ReactDOM from 'react-dom';
const { GIAComponent } = extra;
export interface MapModeProps {
  GIAC: GIAComponentProps['GIAC'];
  visible?: boolean;
  handleClick: () => any;
}

const L7Map: React.FunctionComponent<MapModeProps> = props => {
  const context = useContext();
  const { data, graph, config } = context;
  const { color: NODE_COLOR } = (config.nodes && config.nodes[0].props) || {};
  // const { color: EDGE_COLOR, size: EDGE_SIZE } = (config.edges && config.edges[0].props) || { size: 1 };
  const { handleClick, GIAC } = props;
  let isValid = true;
  const geoData = React.useMemo(() => {
    return data.nodes.map(node => {
      const n = node.data;
      if (!n.longitude || !n.latitude) {
        console.warn('node without longitude or latitude', n);
        isValid = false;
        return n;
      }
      return { ...n, location: [n.longitude, n.latitude] };
    });
  }, []);
  if (!isValid) {
    console.warn('%c invalid data', 'color:red', 'nodes should has longitude or latitude field');
    return null;
  }

  React.useEffect(() => {
    const edgesData = graph.getEdges().map(edge => {
      const e = edge.get('model').data;
      const source = edge.get('source').get('model');
      const target = edge.get('target').get('model');

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
        style: 'light',
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
          color: '#ddd',
          size: 1,
          style: {
            opacity: 1,
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
          color: NODE_COLOR,
          size: 10,
          style: {
            opacity: 0.8,
          },
          // animate: {
          //   speed: 0.8,
          // },
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
      <div
        style={{
          position: 'absolute',
          left: '0px',
          top: '0px',
          zIndex: 9999,
        }}
      >
        <GIAComponent GIAC={GIAC} onClick={handleClick} />
      </div>
    </div>
  );

  const dom = document.getElementById('graphin-container') as HTMLDivElement;
  return <div>{ReactDOM.createPortal(Map, dom)}</div>;
};

export default L7Map;
