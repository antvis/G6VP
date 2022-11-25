import * as GI_ASSETS_BASIC from '@antv/gi-assets-basic';
import { services as GI_ASSETS_BASIC_SERVER } from '@antv/gi-assets-basic';
import GISDK, { utils } from '@antv/gi-sdk';
import ThemeSwitch from '@antv/gi-theme-antd';
import React from 'react';
import { Counter } from '../components';
import { GI_PROJECT_CONFIG, SERVER_ENGINE_CONTEXT, THEME_VALUE } from './GI_EXPORT_FILES';
import update from './update';
/** 资产可按需引入 **/
const {
  ZoomIn,
  ZoomOut,
  FitView,
  FitCenter,
  PropertiesPanel,
  ActivateRelations,
  CanvasSetting,
  FilterPanel,
  ContextMenu,
  ToggleClusterWithMenu,
  Copyright,
  PinNodeWithMenu,
  Initializer,
  LayoutSwitch,
  SideTabs,
  Toolbar,
  Placeholder,
} = GI_ASSETS_BASIC.components;
const { SimpleNode, SimpleEdge } = GI_ASSETS_BASIC.elements;
const { GraphinForce, Concentric, Dagre, FundForce } = GI_ASSETS_BASIC.layouts;

const ASSETS = {
  components: {
    ZoomIn,
    ZoomOut,
    FitView,
    FitCenter,
    PropertiesPanel,
    ActivateRelations,
    CanvasSetting,
    FilterPanel,
    ContextMenu,
    ToggleClusterWithMenu,
    Copyright,
    PinNodeWithMenu,
    Initializer,
    LayoutSwitch,
    SideTabs,
    Toolbar,
    Placeholder,
    //自定义组件
    Counter,
  },
  elements: { SimpleNode, SimpleEdge },
  layouts: { GraphinForce, Concentric, Dagre, FundForce },
};

const SERVER = [GI_ASSETS_BASIC_SERVER];

//@ts-ignore
const config = update(GI_PROJECT_CONFIG);

const { getCombineServices } = utils;
//@ts-ignores
const services = getCombineServices(SERVER);
/** 设置服务引擎 Context **/
window.localStorage.setItem('SERVER_ENGINE_CONTEXT', JSON.stringify(SERVER_ENGINE_CONTEXT));
/** 设置主题 **/
window.localStorage.setItem('@theme', THEME_VALUE);

const MyGraphApp = () => {
  return (
    <div style={{ height: '100vh' }}>
      <ThemeSwitch style={{ visibility: 'hidden' }} />
      {/** @ts-ignore */}
      <GISDK config={config} assets={ASSETS} services={services} />
    </div>
  );
};

export default MyGraphApp;
