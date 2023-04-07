import type { GIAssets } from '@antv/gi-sdk';
import { useContext } from '@antv/gi-sdk';
import React from 'react';
import ReactDOM from 'react-dom';
import { useImmer } from 'use-immer';
import { BottomContainer, LeftContainer, RightContainer, TopContainer } from './Containers';
import useComponents from './useComponents';

export interface FreeLayoutProps extends IContainersVisible {
  ComponentCfgMap: object;
  assets: GIAssets;
  GISDK_ID: string;
  containers: any[];
}

interface IContainersVisible {
  leftVisible: boolean;
  rightVisible: boolean;
  bottomVisible: boolean;
  topVisible: boolean;
}

const GrailLayout: React.FC<FreeLayoutProps> = props => {
  const { graph } = useContext();

  const { ComponentCfgMap, assets, GISDK_ID, containers = [], children } = props;

  const {
    GI_CONTAINER: GI_CONTAINER_LEFT,
    display: leftDisplay,
    visible: leftVisible,
    width: leftWidth,
  } = containers.find(container => container.id === 'GI_CONTAINER_LEFT') || {};
  const {
    GI_CONTAINER: GI_CONTAINER_RIGHT,
    display: rightDisplay,
    visible: rightVisible,
    width: rightWidth,
  } = containers.find(container => container.id === 'GI_CONTAINER_RIGHT') || {};
  const {
    GI_CONTAINER: GI_CONTAINER_BOTTOM,
    display: bottomDisplay,
    visible: bottomVisible,
    height: bottomHeight,
  } = containers.find(container => container.id === 'GI_CONTAINER_BOTTOM') || {};
  const {
    GI_CONTAINER: GI_CONTAINER_TOP,
    display: topDisplay,
    visible: topVisible,
    height: topHeight,
  } = containers.find(container => container.id === 'GI_CONTAINER_TOP') || {};

  const [state, updateState] = useImmer<IContainersVisible>({
    leftVisible,
    rightVisible,
    bottomVisible,
    topVisible,
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
    if (graphinContainer) {
      graphinContainer.style.position = 'absolute';
      graphinContainer.style.left = left;
      graphinContainer.style.right = right;

      graphinContainer.style.width = `calc(100% - ${left} - ${right})`;
      graphinContainer.style.height = `calc(100% - ${bottom})`;
    }

    const container = document.getElementById(`${GISDK_ID}-container`) as HTMLDivElement;

    if (container) {
      const clientWidth = container.clientWidth;
      const clientHeight = container.clientHeight;
      try {
        const width = clientWidth - (Number(left.split('px')[0]) + Number(right.split('px')[0]));
        const height = clientHeight - Number(bottom.split('px')[0]);
        const canvas = graph.get('canvas');
        if (canvas) {
          canvas.changeSize(width, height);
          graph.autoPaint();
          graph.fitView();
        }
      } catch (error) {}
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
    // 组件卸载时重置画布和 DOM 样式
    return () => {
      const graphinContainer = document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLDivElement;
      if (graphinContainer) {
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
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      {children}
      <LeftContainer
        width={leftWidth}
        isDisplay={leftDisplay}
        toggleVisible={toggleLeftVisible}
        visible={state.leftVisible}
      >
        {LeftContent}
      </LeftContainer>
      <BottomContainer
        height={bottomHeight}
        isDisplay={bottomDisplay}
        left={state.leftVisible && leftDisplay ? leftWidth : '0px'}
        right={state.rightVisible && rightDisplay ? rightWidth : '0px'}
        toggleVisible={toggleBottomVisible}
        visible={state.bottomVisible}
      >
        {BottomContent}
      </BottomContainer>
      <RightContainer
        width={rightWidth}
        isDisplay={rightDisplay}
        visible={state.rightVisible}
        toggleVisible={toggleRightVisible}
      >
        {RightContent}
      </RightContainer>
      <TopContainer
        height={topHeight}
        isDisplay={topDisplay}
        left={state.leftVisible && leftDisplay ? leftWidth : '0px'}
        right={state.rightVisible && rightDisplay ? rightWidth : '0px'}
        toggleVisible={toggleTopVisible}
        visible={state.topVisible}
      >
        {TopContent}
      </TopContainer>
    </div>
  );
};

export default GrailLayout;
