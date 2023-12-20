import { Handler } from '@antv/gi-common-components';
import { Icon, useContainer, useContext } from '@antv/gi-sdk';
import { Button, Divider, Segmented, Select, Space } from 'antd';
import { Resizable } from 're-resizable';
import React, { memo, useEffect, useState } from 'react';
import $i18n from '../../i18n';
import Header from './Header';
import Toolbar from './Toolbar';
import './index.less';

const URL_SEARCH_KEY = 'ActiveAssetID';
const MIN_WIDTH = 336;
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
  const defaultWidth = localStorage.getItem('GI_RICH_CONTAINER_SIDE_WIDTH') || '330';
  return Number(defaultWidth);
};
const RichContainer = props => {
  const { children, resizable = true, isSheet } = props;
  const context = useContext();
  const { HAS_GRAPH, GISDK_ID } = context;
  const Containers = useContainer(context);
  const [state, setState] = React.useState<RichContainerState>({
    activeKey: localStorage.getItem(URL_SEARCH_KEY) || 'LanguageQuery',
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
      setWidth(defaultWidth >= MIN_WIDTH ? defaultWidth : MIN_WIDTH);
    } else setWidth(0);
  }, [isExpanded]);

  useEffect(() => {
    if (localStorage.getItem(URL_SEARCH_KEY)) {
      setState(preState => {
        return {
          ...preState,
          activeKey: localStorage.getItem(URL_SEARCH_KEY) as string,
        };
      });
    }
  }, [localStorage.getItem(URL_SEARCH_KEY)]);

  const toggleClick = () => {
    setIsExpanded(prev => !prev);
  };
  const [
    NavbarLeftArea,
    NavbarRightArea,
    ViewArea,
    DataArea,
    FilterArea,
    StylingArea,
    CanvasArea,
    ConditionArea,
    TimeBarArea,
  ] = Containers;

  const handleChange = id => {
    localStorage.setItem(URL_SEARCH_KEY, id);

    setState(preState => {
      return {
        ...preState,
        activeKey: id,
      };
    });

    if (!isExpanded) {
      setIsExpanded(true);
    }
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
      const currentWidth = prev + d.width;
      const realWidth = currentWidth >= MIN_WIDTH ? currentWidth : MIN_WIDTH;
      localStorage.setItem('GI_RICH_CONTAINER_SIDE_WIDTH', realWidth);
      return realWidth;
    });
    setIsResizing(false);
  };

  const ViewModeOptions = [
    {
      value: 'GISDK_CANVAS',
      label: (
        <Space>
          <Icon type={ViewArea.icon}></Icon>
          {$i18n.get({ id: 'basic.components.RichContainer.Component.GraphView', dm: '图谱视图' })}
        </Space>
      ),
    },
    ...ViewArea.components.map(item => {
      const { icon, title } = item.props.GIAC_CONTENT;
      return {
        value: item.id,
        label: (
          <Space style={{ color: '#363740' }}>
            <Icon type={icon} style={{ position: 'relative', top: 2, fontSize: 14 }}></Icon>
            {title}
          </Space>
        ),
      };
    }),
  ];

  const ActiveButtonStyle: React.CSSProperties = {
    background: 'var(--background-color)',
    borderColor: 'var(--background-color)',
    color: '#6A6B71',
  };

  return (
    <div className="gi-rich-container">
      <Header leftArea={NavbarLeftArea} rightArea={NavbarRightArea} />
      {isSheet && <div style={{ height: '40px', position: 'relative', display: 'block' }}></div>}
      <div className="gi-rich-container-toolbar">
        <div className="toolbar-item">
          <Select
            bordered={false}
            defaultValue="GISDK_CANVAS"
            style={{ width: 120 }}
            onChange={handleChangeViewMode}
            options={ViewModeOptions}
            suffixIcon={<Icon type="icon-shituxiala" />}
          />
        </div>

        {viewMode === 'JSONMode' && <div className="operator-toolbar-overlay" />}

        <div className="toolbar-item" style={{ opacity: viewMode === 'JSONMode' ? 0.25 : 1 }}>
          <div className="toolbar-item">
            <Divider type="vertical" />
            <span
              style={{
                marginLeft: 6,
                color: '#98989D',
                marginRight: 8,
              }}
            >
              查询过滤
            </span>
            <Button
              type={HAS_QUERY_VIEW ? 'primary' : 'text'}
              icon={<Icon type={DataArea.icon} />}
              className="gi-richcontainer-query-button"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 12,
                ...(HAS_QUERY_VIEW ? ActiveButtonStyle : {}),
              }}
              onClick={() => {
                if (!HAS_QUERY_VIEW) {
                  const localKey = localStorage.getItem(URL_SEARCH_KEY) || '';
                  if (DATA_QUERY_ID.includes(localKey)) {
                    handleChange(localKey);
                  } else {
                    handleChange(DATA_QUERY_ID[0]);
                  }
                }
              }}
            >
              {$i18n.get({ id: 'basic.components.RichContainer.Component.Query', dm: '查询' })}
            </Button>
          </div>
          <div className="toolbar-item">
            <Button
              type={HAS_FILTER_VIEW ? 'primary' : 'text'}
              icon={<Icon type={FilterArea.icon} />}
              className="gi-richcontainer-filter-button"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 12,
                ...(HAS_FILTER_VIEW ? ActiveButtonStyle : {}),
              }}
              onClick={e => {
                if (!HAS_FILTER_VIEW) {
                  const localKey = localStorage.getItem(URL_SEARCH_KEY) || '';
                  if (DATA_FILTER_ID.includes(localKey)) {
                    handleChange(localKey);
                  } else {
                    handleChange(DATA_FILTER_ID[0]);
                  }
                }
              }}
            >
              {$i18n.get({ id: 'basic.components.RichContainer.Component.Filter', dm: '筛选' })}
            </Button>
          </div>

          <Toolbar
            value={activeKey}
            onChange={handleChange}
            title={$i18n.get({ id: 'basic.components.RichContainer.Component.LayoutStyle', dm: '布局样式' })}
            options={StylingArea.components}
            HAS_GRAPH={HAS_GRAPH}
          />

          <Toolbar
            value={activeKey}
            onChange={handleChange}
            title={$i18n.get({ id: 'basic.components.RichContainer.Component.CanvasOperation', dm: '画布操作' })}
            options={CanvasArea.components}
            HAS_GRAPH={HAS_GRAPH}
          />
        </div>
      </div>

      <div className={`gi-rich-container-content ${isSheet ? 'has-sheet' : ''}`}>
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
              className="gi-richcontainer-side"
            >
              <div style={{ overflow: 'hidden' }}>
                {HAS_QUERY_VIEW && (
                  <Segmented block value={activeKey} options={DATA_QUERY_OPTIONS} onChange={handleChange} />
                )}

                {HAS_FILTER_VIEW && (
                  <Segmented block value={activeKey} options={DATA_FILTER_OPTIONS} onChange={handleChange} />
                )}

                {[
                  ...DataArea.components,
                  ...FilterArea.components,
                  ...StylingArea.components,
                  ...ConditionArea.components,
                ].map(item => {
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
                icon={
                  <Icon type="icon-shituxiala" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(-90deg)' }} />
                }
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
            <div
              className="gi-rich-container-timebar"
              style={{ position: 'absolute', bottom: 0, width: `calc(100vw - ${width}px)` }}
            >
              {TimeBarArea.components.map(item => {
                return <item.component key={item.id} {...item.props} />;
              })}
            </div>
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
