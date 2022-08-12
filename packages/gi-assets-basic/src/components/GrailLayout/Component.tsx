import { GIAssets } from '@alipay/graphinsight';
import React from 'react';
import ReactDOM from 'react-dom';
import { useImmer } from 'use-immer';
import useComponents from './useComponents';
import { SideContainer, BottomContainer } from './Containers';

export interface FreeLayoutProps {
  GI_CONTAINER_LEFT: string[];
  GI_CONTAINER_RIGHT: string[];
  GI_CONTAINER_BOTTOM: string[];
  leftWidth: string;
  rightWidth: string;
  bottomHeight: string;
  leftDisplay: boolean;
  rightDisplay: boolean;
  bottomDisplay: boolean;
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
    leftDisplay,
    rightDisplay,
    bottomDisplay,
  } = props;

  const LeftContent = useComponents(GI_CONTAINER_LEFT, ComponentCfgMap, assets);

  const RightContent = useComponents(GI_CONTAINER_RIGHT, ComponentCfgMap, assets);

  const BottomContent = useComponents(GI_CONTAINER_BOTTOM, ComponentCfgMap, assets);

  const container = document.getElementById(`${GISDK_ID}-container`) as HTMLDivElement;

  return (
    <div>
      {ReactDOM.createPortal(
        <SideContainer width={leftWidth} isDisplay={leftDisplay} type="left">
          {LeftContent}
        </SideContainer>,
        container,
      )}
      {ReactDOM.createPortal(
        <BottomContainer
          height={bottomHeight}
          isDisplay={bottomDisplay}
          left={leftDisplay ? leftWidth : '0px'}
          right={rightDisplay ? rightWidth : '0px'}
        >
          {BottomContent}
        </BottomContainer>,
        container,
      )}
      {ReactDOM.createPortal(
        <SideContainer width={rightWidth} isDisplay={rightDisplay} type="right">
          {RightContent}
        </SideContainer>,
        container,
      )}
    </div>
  );
};

export default FreeLayout;
