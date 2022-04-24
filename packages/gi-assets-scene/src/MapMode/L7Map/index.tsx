import { extra, useContext } from '@alipay/graphinsight';
import type { GIAComponentProps } from '@alipay/graphinsight/lib/components/GIAC';
import { DrawBoxSelect } from '@antv/l7-draw';
import { L7Plot, L7PlotOptions } from '@antv/l7plot';
import * as turf from '@turf/turf';
import * as React from 'react';
import ReactDOM from 'react-dom';
import AnimateContainer from '../AnimateContainer';
import PropertiesPanel from '../PropertiesPanel/Component';
import ToolbarContainer from '../Toolbar';
import './index.less';
const { deepClone } = extra;

export interface MapModeProps {
  GIAC: GIAComponentProps['GIAC'];
  visible?: boolean;
  handleClick: () => any;
  theme: string;
  type: string;
}

const L7Map: React.FunctionComponent<MapModeProps> = props => {
  const { theme, type } = props;
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
      return { ...node, location: [n.longitude, n.latitude] };
    });
  }, [data]);
  if (!isValid) {
    console.warn('%c invalid data', 'color:red', 'nodes should has longitude or latitude field');
    return null;
  }

  React.useEffect(() => {
    const edgesData = graph.getEdges().map(edge => {
      const e = edge.get('model');
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
    const options = {
      map: {
        type: type,
        style: theme,
        center,
        zoom: 15,
        pitch: 0,
        // autoFit: true,
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
            select: { color: 'red', size: 20 },
          },
          size: 10,
          style: {
            opacity: 0.8,
          },
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
    } as L7PlotOptions;

    const map = new L7Plot('map-container', options);

    map.on('loaded', () => {
      const scene = map.getScene();
      const drawbox = new DrawBoxSelect(scene);
      drawbox.on('draw.boxselect', e => {
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
          data.nodes.forEach(node => {
            if (ids.includes(node.id)) {
              graph.setItemState(node.id, 'selected', true);
            } else {
              graph.setItemState(node.id, 'inactive', true);
            }
          });
          data.edges.forEach(edge => {
            const { source, target } = edge;
            if (ids.includes(source) && ids.includes(target)) {
              graph.setItemState(edge.id, 'selected', true);
            } else {
              graph.setItemState(edge.id, 'inactive', true);
            }
          });
        }, 0);
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
    // const plot = map.getPlots()[0];
    // plot.changeData(geoData);

    return () => {
      map.destroy();
    };
  }, [
    // TODO: change geoData
    // graph,
    // geoData,
    type,
    theme,
  ]);
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
