import { Icon, useContainer, useContext, utils } from '@antv/gi-sdk';
import { Select, Space } from 'antd';
import React from 'react';
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
const RichContainer = props => {
  const { children } = props;
  const context = useContext();
  const { HAS_GRAPH } = context;
  const Containers = useContainer(context);
  const [state, setState] = React.useState<RichContainerState>({
    activeKey: utils.searchParamOf(URL_SEARCH_KEY) || 'FilterPanel',
    viewMode: 'GISDK_CANVAS',
  });
  const { activeKey, viewMode } = state;

  const [NavbarLeftArea, NavbarRightArea, ViewArea, DataArea, StylingArea, CanvasArea, AnalysisArea] = Containers;

  const handleChange = id => {
    const { searchParams, path } = utils.getSearchParams(window.location);
    searchParams.set(URL_SEARCH_KEY, id);
    window.location.hash = `${path}?${searchParams.toString()}`;

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

  const ViewModeOptions = [
    {
      value: 'GISDK_CANVAS',
      label: (
        <Space>
          <Icon type="icon-deploymentunit1"></Icon>
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

  return (
    <div className="gi-rich-container">
      <div className="gi-rich-container-navbar">
        <div className="navbar-back">
          {NavbarLeftArea.components.map(item => {
            return <item.component key={item.id} {...item.props} />;
          })}
        </div>
        <div className="navbar-setting">
          {NavbarRightArea.components.map(item => {
            return <item.component key={item.id} {...item.props} />;
          })}
        </div>
      </div>
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
        <Toolbar
          value={activeKey}
          onChange={handleChange}
          title="查询过滤"
          displayText
          options={DataArea.components}
          HAS_GRAPH={HAS_GRAPH}
        />
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
        <div className="toolbar-item"></div>
        <div className="toolbar-item"></div>
      </div>

      <div className="gi-rich-container-content">
        <div style={viewMode === 'GISDK_CANVAS' ? visibleStyle : hiddenStyle}>
          <div className="gi-rich-container-side">
            {[...DataArea.components, ...StylingArea.components].map(item => {
              const isActive = activeKey === item.id;
              return (
                <div key={item.id} style={{ display: isActive ? 'block' : 'none' }}>
                  <item.component key={item.id} {...item.props} />
                </div>
              );
            })}
          </div>
          <div className="gi-rich-container-canvas">{children}</div>
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

export default RichContainer;
