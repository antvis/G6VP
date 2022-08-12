import { GIAssets } from '@alipay/graphinsight';
import React from 'react';
import ReactDOM from 'react-dom';
import { useImmer } from 'use-immer';
import useComponents from './useComponents';
import { LeftContainer, BottomContainer, RightContainer } from './Containers';

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

interface IState {
  leftVisible: boolean;
  rightVisible: boolean;
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

  const [state, updateState] = useImmer<IState>({
    leftVisible: true,
    rightVisible: true,
  });

  const LeftContent = useComponents(GI_CONTAINER_LEFT, ComponentCfgMap, assets);

  const RightContent = useComponents(GI_CONTAINER_RIGHT, ComponentCfgMap, assets);

  const BottomContent = useComponents(GI_CONTAINER_BOTTOM, ComponentCfgMap, assets);

  const container = document.getElementById(`${GISDK_ID}-container`) as HTMLDivElement;

  const toggleLeftVisible = () => {
    updateState(draft => {
      draft.leftVisible = !draft.leftVisible;
    });
  };

  const toggleRightVisible = () => {
    updateState(draft => {
      draft.rightVisible = !draft.rightVisible;
    });
  };

  return (
    <div>
      {ReactDOM.createPortal(
        <LeftContainer
          width={leftWidth}
          isDisplay={leftDisplay}
          toggleVisible={toggleLeftVisible}
          visible={state.leftVisible}
        >
          {LeftContent}
        </LeftContainer>,
        container,
      )}
      {ReactDOM.createPortal(
        <BottomContainer
          height={bottomHeight}
          isDisplay={bottomDisplay}
          left={state.leftVisible && leftDisplay ? leftWidth : '0px'}
          right={state.rightVisible && rightDisplay ? rightWidth : '0px'}
        >
          {BottomContent}
        </BottomContainer>,
        container,
      )}
      {ReactDOM.createPortal(
        <RightContainer
          width={rightWidth}
          isDisplay={rightDisplay}
          visible={state.rightVisible}
          toggleVisible={toggleRightVisible}
        >
          {RightContent}
        </RightContainer>,
        container,
      )}
    </div>
  );
};

export default FreeLayout;
