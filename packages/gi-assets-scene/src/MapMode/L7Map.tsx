import { extra, useContext } from '@alipay/graphinsight';
import type { GIAComponentProps } from '@alipay/graphinsight/lib/components/GIAC';
import { DrawBoxSelect } from '@antv/l7-draw';
import { L7Plot } from '@antv/l7plot';
import * as turf from '@turf/turf';
import * as React from 'react';
import ReactDOM from 'react-dom';
import AnimateContainer from './AnimateContainer';
import './index.less';
import PropertiesPanel from './PropertiesPanel/Component';
import ToolbarContainer from './Toolbar';
const { deepClone } = extra;

const { GIAComponent } = extra;
export interface MapModeProps {
  GIAC: GIAComponentProps['GIAC'];
  visible?: boolean;
  handleClick: () => any;
}

const L7Map: React.FunctionComponent<MapModeProps> = props => {
  const context = useContext();
  const { data, graph, config, GISDK_ID, apis } = context;

  const { color: NODE_COLOR } = (config.nodes && config.nodes[0].props) || {};

  const [state, setState] = React.useState<{
    isReady: boolean;
    toggle: boolean;
    mapInstance: L7Plot | undefined;
    drawbox: DrawBoxSelect | undefined;
  }>({
    isReady: false,
    mapInstance: undefined,
    toggle: false,
    drawbox: undefined,
  });

  console.log('config', config);
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
    const map = new L7Plot('map-container', {
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
          name: 'edge',
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
          name: 'node',
          type: 'dotLayer',
          shape: 'circle',
          source: {
            data: geoData,
            parser: {
              type: 'json',
              coordinates: 'location',
            },
          },
          color: {
            field: 'type',
            //@ts-ignore
            value: ({ type }) => {
              console.log('type', type);
              return NODE_COLOR;
            },
          },

          state: {
            select: { color: 'red' },
          },
          size: 10,
          style: {
            opacity: 0.8,
          },
          // animate: {
          //   speed: 0.8,
          // },
        },
        {
          name: 'text',
          type: 'textLayer',
          shape: 'text',
          field: 'id',
          source: {
            data: geoData,
            parser: {
              type: 'json',
              coordinates: 'location',
            },
          },
          // minZoom:
          style: {
            fontSize: 20,
            fill: '#000',
            textAnchor: 'bottom',
            textOffset: [0, -20],
          },
        },
      ],
    });

    map.on('loaded', () => {
      const scene = map.getScene();
      const drawbox = new DrawBoxSelect(scene);
      // drawbox.enable();
      drawbox.on('draw.boxselect', e => {
        console.log('select brush...', e);
        const { endPoint, startPoint } = e;
        const poly = turf.bboxPolygon([startPoint.lng, startPoint.lat, endPoint.lng, endPoint.lat]);
        const matchNodes = geoData.filter(node => {
          const pt = turf.point(node.location);
          const isMatch = turf.booleanPointInPolygon(pt, poly);
          return isMatch;
        });
        setState(preState => {
          return {
            ...preState,
            toggle: true,
          };
        });
        //
        setTimeout(() => {
          const ids = matchNodes.map(node => node.id);
          apis.focusNodeById(ids[0] || '');
          apis.highlightNodeById(ids);
          data.nodes.forEach(node => {
            if (ids.includes(node.id)) {
              graph.setItemState(node.id, 'selected', true);
            } else {
              graph.setItemState(node.id, 'inactive', true);
            }
          });
          data.edges.forEach(node => {
            const { source, target } = node;
            if (ids.includes(source) && ids.includes(target)) {
              graph.setItemState(node.id, 'selected', true);
            } else {
              graph.setItemState(node.id, 'inactive', true);
            }
          });
        }, 0);
        console.log('matchNodes', matchNodes);
      });
      setState(preState => {
        return {
          ...preState,
          isReady: true,
          mapInstance: map,
          drawbox,
        };
      });
    });
  }, []);
  const { isReady, mapInstance, toggle } = state;

  const handleToggle = () => {
    setState(preState => {
      return {
        ...preState,
        toggle: !preState.toggle,
      };
    });
  };

  const handleBrush = () => {
    const { drawbox } = state;
    if (drawbox) {
      drawbox.enable();
    }
  };
  const Toggle_GIAC = deepClone(GIAC);
  Toggle_GIAC.icon = 'icon-fullscreen';
  Toggle_GIAC.title = toggle ? '小地图' : '退出小地图';
  Toggle_GIAC.isShowTitle = false;
  Toggle_GIAC.tooltipPlacement = 'RT';

  const Map = (
    <AnimateContainer toggle={toggle}>
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
          <ToolbarContainer
            config={config}
            GIAC={GIAC}
            handleBrush={handleBrush}
            handleSwitchMap={handleClick}
            handleToggleMap={handleToggle}
          />

          {isReady && <PropertiesPanel mapInstance={mapInstance as L7Plot} geoData={geoData} updateState={setState} />}
        </div>
      </div>
    </AnimateContainer>
  );

  const dom = document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLDivElement;
  return <div>{ReactDOM.createPortal(Map, dom)}</div>;
};

export default L7Map;
