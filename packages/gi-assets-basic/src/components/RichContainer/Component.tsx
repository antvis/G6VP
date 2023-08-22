import { Handler } from '@antv/gi-common-components';
import { Icon, useContainer, useContext, utils } from '@antv/gi-sdk';
import { Button, Divider, Segmented, Select, Space } from 'antd';
import { Resizable } from 're-resizable';
import React, { memo, useEffect, useState } from 'react';
import Header from './Header';
import Toolbar from './Toolbar';
import './index.less';
const URL_SEARCH_KEY = 'ActiveAssetID';
const visibleStyle: React.CSSProperties = {
  visibility: 'visible',
  width: '100%',
};
const hiddenStyle: React.CSSProperties = {
  visibility: 'hidden',
  position: 'absolute',
  bottom: '-800px',
};

export interface RichContainerState {
  /** 当前激活的面板 */
  activeKey: string;
  /** 当前的模式 */
  viewMode: string;
}
const getDefaultSideWidth = () => {
  const defaultWidth = localStorage.getItem('GI_RICH_CONTAINER_SIDE_WIDTH') || '320';
  return Number(defaultWidth);
};
const RichContainer = props => {
  const { children, resizable = true } = props;
  const context = useContext();
  const { HAS_GRAPH, GISDK_ID } = context;
  const Containers = useContainer(context);
  const [state, setState] = React.useState<RichContainerState>({
    activeKey: utils.searchParamOf(URL_SEARCH_KEY) || 'FilterPanel',
    viewMode: 'GISDK_CANVAS',
  });
  const { activeKey, viewMode } = state;
  const [isExpanded, setIsExpanded] = useState(true);
  const defaultWidth = getDefaultSideWidth();
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const enable = {
    top: false,
    right: resizable ? true : false,
    bottom: false,
    left: false,
    topRight: false,
    bottomRight: false,
    bottomLeft: false,
    topLeft: false,
  };

  useEffect(() => {
    if (isExpanded) {
      const defaultWidth = getDefaultSideWidth();
      setWidth(defaultWidth);
    } else setWidth(0);
  }, [isExpanded]);

  const toggleClick = () => {
    setIsExpanded(prev => !prev);
  };
  const [NavbarLeftArea, NavbarRightArea, ViewArea, DataArea, FilterArea, StylingArea, CanvasArea] = Containers;

  const handleChange = id => {
    const { searchParams, path } = utils.getSearchParams(window.location);
    searchParams.set(URL_SEARCH_KEY, id);
    // window.location.hash = `${path}?${searchParams.toString()}`;

    setState(preState => {
      return {
        ...preState,
        activeKey: id,
      };
    });
  };

  const handleChangeViewMode = id => {
    setState(preState => {
      return {
        ...preState,
        viewMode: id,
      };
    });
  };
  const DATA_QUERY_ID = DataArea.components.map(item => item.id);
  const DATA_FILTER_ID = FilterArea.components.map(item => item.id);
  const DATA_QUERY_OPTIONS = DataArea.components.map(item => {
    //@ts-ignore
    return { label: item.info.name, value: item.id };
  });
  const DATA_FILTER_OPTIONS = FilterArea.components.map(item => {
    //@ts-ignore
    return { label: item.info.name, value: item.id };
  });
  const HAS_QUERY_VIEW = DATA_QUERY_ID.indexOf(activeKey) !== -1;
  const HAS_FILTER_VIEW = DATA_FILTER_ID.indexOf(activeKey) !== -1;

  const onResizeStart = () => {
    setIsResizing(true);
  };
  const onResizeStop = (e, direction, ref, d) => {
    setWidth(prev => {
      localStorage.setItem('GI_RICH_CONTAINER_SIDE_WIDTH', prev + d.width);
      return prev + d.width;
    });
    setIsResizing(false);
  };

  const ViewModeOptions = [
    {
      value: 'GISDK_CANVAS',
      label: (
        <Space>
          <Icon type={ViewArea.icon}></Icon>
          图谱视图
        </Space>
      ),
    },
    ...ViewArea.components.map(item => {
      const { icon, title } = item.props.GIAC_CONTENT;
      return {
        value: item.id,
        label: (
          <Space>
            <Icon type={icon}></Icon>
            {title}
          </Space>
        ),
      };
    }),
  ];

  console.log('render.....', Containers, HAS_GRAPH, ViewModeOptions, viewMode);
  const ActiveButtonStyle: React.CSSProperties = {
    background: 'var(--background-color)',
    borderColor: 'var(--background-color)',
    color: 'var(--text-color)',
  };

  return (
    <div className="gi-rich-container">
      <Header leftArea={NavbarLeftArea} rightArea={NavbarRightArea} />
      <div id={`${GISDK_ID}-sheetbar-container`}></div>
      <div className="gi-rich-container-toolbar">
        <div className="toolbar-item">
          <Select
            bordered={false}
            defaultValue="GISDK_CANVAS"
            style={{ width: 120 }}
            onChange={handleChangeViewMode}
            options={ViewModeOptions}
          />
        </div>
        <div className="toolbar-item">
          <Divider type="vertical" />
          <Button
            type={HAS_QUERY_VIEW ? 'primary' : 'text'}
            icon={<Icon type={DataArea.icon} />}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              ...(HAS_QUERY_VIEW ? ActiveButtonStyle : {}),
            }}
            onClick={() => {
              if (!HAS_QUERY_VIEW) {
                handleChange(DATA_QUERY_ID[0]);
              }
            }}
          >
            查询
          </Button>
        </div>
        <div className="toolbar-item">
          <Button
            type={HAS_FILTER_VIEW ? 'primary' : 'text'}
            icon={<Icon type={FilterArea.icon} />}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              ...(HAS_FILTER_VIEW ? ActiveButtonStyle : {}),
            }}
            onClick={() => {
              if (!HAS_FILTER_VIEW) {
                handleChange(DATA_FILTER_ID[0]);
              }
            }}
          >
            筛选
          </Button>
        </div>

        <Toolbar
          value={activeKey}
          onChange={handleChange}
          title="布局样式"
          options={StylingArea.components}
          HAS_GRAPH={HAS_GRAPH}
        />
        <Toolbar
          value={activeKey}
          onChange={handleChange}
          title="画布操作"
          options={CanvasArea.components}
          HAS_GRAPH={HAS_GRAPH}
        />
      </div>

      <div className="gi-rich-container-content">
        <div style={viewMode === 'GISDK_CANVAS' ? visibleStyle : hiddenStyle}>
          <div className="gi-rich-container-side">
            <Resizable
              // @ts-ignore
              defaultSize={{ width }}
              style={{
                pointerEvents: 'all',
                backgroundColor: '#f3f5f9',
                // transition: 'width 5.3s ease 0s',
                zIndex: 10,
                padding: '12px',
              }}
              // @ts-ignore
              size={{ width, height: '100%' }}
              enable={enable}
              onResizeStart={onResizeStart}
              onResizeStop={onResizeStop}
            >
              <div style={{ overflow: 'hidden' }}>
                {HAS_QUERY_VIEW && (
                  <Segmented block value={activeKey} options={DATA_QUERY_OPTIONS} onChange={handleChange} />
                )}
                {HAS_FILTER_VIEW && (
                  <Segmented block value={activeKey} options={DATA_FILTER_OPTIONS} onChange={handleChange} />
                )}
                {[...DataArea.components, ...FilterArea.components, ...StylingArea.components].map(item => {
                  const isActive = activeKey === item.id;
                  return (
                    <div key={item.id} style={{ display: isActive ? 'block' : 'none' }}>
                      <item.component key={item.id} {...item.props} />
                    </div>
                  );
                })}
              </div>
              <Handler
                type="left"
                handleClick={toggleClick}
                style={{
                  borderColor: 'transparent transparent transparent #f3f5f9',
                }}
              />
            </Resizable>
          </div>
          <div
            className="gi-rich-container-canvas"
            style={{
              left: width,
              //  transition: 'width 5.3s ease 0s'
            }}
          >
            {children}
          </div>
        </div>
        {ViewArea.components.map(item => {
          const isActive = item.id === viewMode;
          const viewStyle = isActive ? visibleStyle : hiddenStyle;
          return (
            <div key={item.id} style={{ ...viewStyle, background: 'var(--background-color)' }}>
              {HAS_GRAPH && <item.component key={item.id} {...item.props} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(RichContainer);
