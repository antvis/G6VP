import { useContext } from '@alipay/graphinsight';
import React, { useEffect } from 'react';
export interface SideContainerProps {
  width: string;
  height: string;
  children: any;
  visible: boolean;
  GISDK_ID: string;
  outSideFromCanvas: boolean;
  placement: string;
  defaultVisible: boolean;
}

const SideContainer: React.FC<SideContainerProps> = props => {
  const { children, width, visible, GISDK_ID, outSideFromCanvas, placement, height } = props;
  const { graph } = useContext();
  useEffect(() => {
    const container = document.getElementById(`${GISDK_ID}-container`) as HTMLDivElement;
    const canvasContainer = document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLDivElement;
    const componentsContainer = document.getElementById(`${GISDK_ID}-container-extra`) as HTMLDivElement;
    // hard code
    const tabsNav = document.querySelector('.gi-side-tabs .ant-tabs-nav-list') as HTMLDivElement;
    if (container && componentsContainer && canvasContainer) {
      const TabsWidth = visible ? width : `${tabsNav.offsetWidth || 50}px`;
      if (outSideFromCanvas) {
        //container
        container.style.position = 'relative';
        //CanvasContainer
        canvasContainer.style.position = `absolute`;
        canvasContainer.style.left = TabsWidth;
        canvasContainer.style.top = '0px';
        canvasContainer.style.bottom = '0px';
        canvasContainer.style.right = '0px';
        canvasContainer.style.width = 'unset';
        canvasContainer.style.height = 'unset';
        canvasContainer.style.transition = 'all 0.3s ease';
        // SideTabs
        componentsContainer.className = `graphinsight-container-extra ${placement}`;
        componentsContainer.style.width = TabsWidth;
        componentsContainer.style.position = 'absolute';
        componentsContainer.style.top = '0px';
        componentsContainer.style.bottom = '0px';
        componentsContainer.style.left = '0px';
        componentsContainer.style.transition = 'all 0.3s ease';
        const canvas = graph.get('canvas');
        if (canvas) {
          graph.changeSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
          graph.autoPaint();
        }
      } else {
        container.className = '';
        componentsContainer.className = '';
        componentsContainer.style.width = 'unset';
        componentsContainer.style.height = 'unset';
        canvasContainer.style.left = '0px';
      }
    }
    return () => {
      container.className = '';
      componentsContainer.className = '';
      componentsContainer.style.width = 'unset';
      componentsContainer.style.height = 'unset';
      canvasContainer.style.left = '0px';
    };
  }, [graph, visible, outSideFromCanvas]);

  return <>{children}</>;
};

export default SideContainer;
