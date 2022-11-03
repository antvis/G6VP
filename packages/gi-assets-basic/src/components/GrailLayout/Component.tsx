import type { GIAssets } from '@antv/gi-sdk';
import { useContext } from '@antv/gi-sdk';
import React from 'react';
import ReactDOM from 'react-dom';
import { useImmer } from 'use-immer';
import { BottomContainer, LeftContainer, RightContainer, TopContainer } from './Containers';
import useComponents from './useComponents';

export interface FreeLayoutProps {
  GI_CONTAINER_LEFT: string[];
  GI_CONTAINER_RIGHT: string[];
  GI_CONTAINER_BOTTOM: string[];
  GI_CONTAINER_TOP: string[];
  leftWidth: string;
  rightWidth: string;
  bottomHeight: string;
  topHeight: string;
  leftDisplay: boolean;
  rightDisplay: boolean;
  bottomDisplay: boolean;
  topDisplay: boolean;
  ComponentCfgMap: object;
  assets: GIAssets;
  GISDK_ID: string;
}

interface IState {
  leftVisible: boolean;
  rightVisible: boolean;
  bottomVisible: boolean;
  topVisible: boolean;
}

const FreeLayout: React.FC<FreeLayoutProps> = props => {
  const { graph } = useContext();

  const {
    ComponentCfgMap,
    assets,
    GISDK_ID,
    GI_CONTAINER_LEFT = [],
    GI_CONTAINER_RIGHT = [],
    GI_CONTAINER_BOTTOM = [],
    GI_CONTAINER_TOP = [],
    leftWidth,
    rightWidth,
    bottomHeight,
    topHeight,
    leftDisplay,
    rightDisplay,
    bottomDisplay,
    topDisplay,
  } = props;

  const [state, updateState] = useImmer<IState>({
    leftVisible: true,
    rightVisible: true,
    bottomVisible: true,
    topVisible: true,
  });

  const LeftContent = useComponents(GI_CONTAINER_LEFT, ComponentCfgMap, assets, state.leftVisible);

  const RightContent = useComponents(GI_CONTAINER_RIGHT, ComponentCfgMap, assets, state.rightVisible);

  const BottomContent = useComponents(GI_CONTAINER_BOTTOM, ComponentCfgMap, assets, state.bottomVisible);

  const TopContent = useComponents(GI_CONTAINER_TOP, ComponentCfgMap, assets, state.topVisible);

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

  const toggleBottomVisible = () => {
    updateState(draft => {
      draft.bottomVisible = !draft.bottomVisible;
    });
  };

  const toggleTopVisible = () => {
    updateState(draft => {
      draft.topVisible = !draft.topVisible;
    });
  };

  React.useEffect(() => {
    const graphinContainer = document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLDivElement;
    const left = state.leftVisible && leftDisplay ? leftWidth : '0px';
    const right = state.rightVisible && rightDisplay ? rightWidth : '0px';
    const bottom = state.bottomVisible && bottomDisplay ? bottomHeight : '0px';
    graphinContainer.style.position = 'absolute';
    graphinContainer.style.left = left;
    graphinContainer.style.right = right;
    graphinContainer.style.width = `calc(100% - ${left} - ${right})`;
    graphinContainer.style.height = `calc(100% - ${bottom})`;

    const clientWidth = graphinContainer.clientWidth;
    const clientHeight = graphinContainer.clientHeight;
    const canvas = graph.get('canvas');
    if (canvas) {
      canvas.changeSize(clientWidth, clientHeight);
      graph.autoPaint();
    }
  }, [
    leftDisplay,
    state.leftVisible,
    leftWidth,
    rightDisplay,
    state.rightVisible,
    rightWidth,
    bottomDisplay,
    state.bottomVisible,
    bottomHeight,
  ]);

  React.useEffect(() => {
    const graphinContainer = document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLDivElement;

    // 组件卸载时重置画布和 DOM 样式
    return () => {
      graphinContainer.style.position = 'relative';
      graphinContainer.style.left = '0';
      graphinContainer.style.right = '0';
      graphinContainer.style.width = '100%';
      graphinContainer.style.height = '100%';

      const clientWidth = graphinContainer.clientWidth;
      const clientHeight = graphinContainer.clientHeight;
      const canvas = graph.get('canvas');
      if (canvas) {
        canvas.changeSize(clientWidth, clientHeight);
        graph.autoPaint();
      }
    };
  }, []);

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
          toggleVisible={toggleBottomVisible}
          visible={state.bottomVisible}
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
      {ReactDOM.createPortal(
        <TopContainer
          height={topHeight}
          isDisplay={topDisplay}
          left={state.leftVisible && leftDisplay ? leftWidth : '0px'}
          right={state.rightVisible && rightDisplay ? rightWidth : '0px'}
          toggleVisible={toggleTopVisible}
          visible={state.topVisible}
        >
          {TopContent}
        </TopContainer>,
        container,
      )}
    </div>
  );
};

export default FreeLayout;
