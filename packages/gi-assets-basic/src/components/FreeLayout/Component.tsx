import { GIAssets } from '@alipay/graphinsight';
import React from 'react';
import ReactDOM from 'react-dom';
import useComponents from './useComponents';
import useFreeLayoutStyle from './useFreeLayoutStyle';

export interface FreeLayoutProps {
  GI_CONTAINER_LEFT: string[];
  GI_CONTAINER_RIGHT: string[];
  GI_CONTAINER_BOTTOM: string[];
  leftWidth: string;
  rightWidth: string;
  bottomHeight: string;
  leftVisible: boolean;
  rightVisible: boolean;
  bottomVisible: boolean;
  ComponentCfgMap: object;
  assets: GIAssets;
  GISDK_ID: string;
}

const FreeLayout: React.FC<FreeLayoutProps> = props => {
  const {
    ComponentCfgMap,
    assets,
    GISDK_ID,
    GI_CONTAINER_LEFT = [],
    GI_CONTAINER_RIGHT = [],
    GI_CONTAINER_BOTTOM = [],
    leftWidth,
    rightWidth,
    bottomHeight,
    leftVisible,
    rightVisible,
    bottomVisible,
  } = props;

  const LeftContent = useComponents(GI_CONTAINER_LEFT, ComponentCfgMap, assets);

  const RightContent = useComponents(GI_CONTAINER_RIGHT, ComponentCfgMap, assets);

  const BottomContent = useComponents(GI_CONTAINER_BOTTOM, ComponentCfgMap, assets);

  useFreeLayoutStyle(leftWidth, rightWidth, bottomHeight, leftVisible, rightVisible, bottomVisible, GISDK_ID);

  const leftContainer = document.getElementById(`${GISDK_ID}-free-layout-left`);
  const rightContainer = document.getElementById(`${GISDK_ID}-free-layout-right`);
  const bottomContainer = document.getElementById(`${GISDK_ID}-free-layout-bottom`);

  React.useLayoutEffect(() => {
    return () => {
      const container = document.getElementById(`${GISDK_ID}-container`) as HTMLDivElement;
      const leftContainer = document.getElementById(`${GISDK_ID}-free-layout-left`);
      const rightContainer = document.getElementById(`${GISDK_ID}-free-layout-right`);
      const bottomContainer = document.getElementById(`${GISDK_ID}-free-layout-bottom`);
      const canvasContainer = document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLDivElement;
      leftContainer && container.removeChild(leftContainer);
      rightContainer && container.removeChild(rightContainer);
      bottomContainer && container.removeChild(bottomContainer);
      if (canvasContainer) {
        canvasContainer.style.position = 'absolute';
        canvasContainer.style.width = 'unset';
        canvasContainer.style.height = 'unset';
        canvasContainer.style.top = '0px';
        canvasContainer.style.right = '0px';
        canvasContainer.style.left = '0px';
        canvasContainer.style.bottom = '0px';
      }
    };
  }, []);

  return (
    <div>
      {leftContainer && leftVisible && ReactDOM.createPortal(LeftContent, leftContainer)}
      {rightContainer && rightVisible && ReactDOM.createPortal(RightContent, rightContainer)}
      {bottomContainer && bottomVisible && ReactDOM.createPortal(BottomContent, bottomContainer)}
    </div>
  );
};

export default FreeLayout;
