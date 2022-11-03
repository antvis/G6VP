import { useContext } from '@antv/gi-sdk';
import React from 'react';
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
  const divRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const container = document.getElementById(`${GISDK_ID}-container`) as HTMLDivElement;
    const canvasContainer = document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLDivElement;
    const tabsContainer = divRef.current;
    if (!tabsContainer) {
      return;
    }
    // hard code
    const tabsNav = document.querySelector('.gi-side-tabs .ant-tabs-nav-list') as HTMLDivElement;
    if (container && tabsContainer && canvasContainer) {
      const TabsWidth = visible ? width : `${tabsNav.offsetWidth || 50}px`;
      const TabsHeight = visible ? height : `${tabsNav.offsetHeight || 350}px`;
      /**
       {
          value: 'LT',
          label: '左上 / top',
        },
        {
          value: 'RT',
          label: '右上 / right',
        },
        {
          value: 'LB',
          label: '左下 / left',
        },
        {
          value: 'RB',
          label: '右下 / bottom',
        },
       */
      if (outSideFromCanvas) {
        //container
        container.style.position = 'relative';
        canvasContainer.style.position = `absolute`;
        canvasContainer.style.transition = 'all 0.3s ease';
        tabsContainer.style.transition = 'all 0.3s ease';
        if (placement === 'LB' || placement === 'RT') {
          //CanvasContainer
          canvasContainer.style.top = '0px';
          canvasContainer.style.bottom = '0px';
          canvasContainer.style.width = 'unset';
          canvasContainer.style.height = 'unset';
          //tabsContainer
          tabsContainer.style.position = 'absolute';
          tabsContainer.style.top = '0px';
          tabsContainer.style.bottom = '0px';
          tabsContainer.style.width = TabsWidth;

          if (placement === 'LB') {
            // SideTabs
            tabsContainer.style.left = '0px';
            //CanvasContainer
            canvasContainer.style.left = TabsWidth;
            canvasContainer.style.right = '0px';
          }
          if (placement === 'RT') {
            // SideTabs
            tabsContainer.style.right = '0px';
            //CanvasContainer
            canvasContainer.style.left = '0px';
            canvasContainer.style.right = TabsWidth;
          }
        }
        if (placement === 'RB' || placement === 'LT') {
          //CanvasContainer
          canvasContainer.style.right = '0px';
          canvasContainer.style.left = '0px';
          canvasContainer.style.width = 'unset';
          canvasContainer.style.height = 'unset';

          //tabsContainer
          tabsContainer.style.position = 'absolute';
          tabsContainer.style.left = '0px';
          tabsContainer.style.right = '0px';
          tabsContainer.style.height = TabsHeight;

          if (placement === 'LT') {
            // SideTabs
            tabsContainer.style.top = '0px';
            //CanvasContainer
            canvasContainer.style.top = TabsHeight;
            canvasContainer.style.bottom = '0px';
          }
          if (placement === 'RB') {
            // SideTabs
            tabsContainer.style.bottom = '0px';
            //CanvasContainer
            canvasContainer.style.top = '0px';
            canvasContainer.style.bottom = TabsHeight;
          }
        }

        const canvas = graph.get('canvas');
        if (canvas) {
          graph.changeSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
          graph.autoPaint();
        }
      } else {
        container.className = '';
        tabsContainer.className = '';
        tabsContainer.style.width = 'unset';
        tabsContainer.style.height = 'unset';
        canvasContainer.style.left = 'unset';
        canvasContainer.style.right = 'unset';
        canvasContainer.style.transition = 'all 0.3s ease';
        tabsContainer.style.transition = 'all 0.3s ease';
      }
    }
    return () => {
      tabsContainer.style.width = 'unset';
      tabsContainer.style.height = 'unset';
      canvasContainer.style.left = 'unset';
      canvasContainer.style.right = 'unset';
      canvasContainer.style.top = 'unset';
      canvasContainer.style.right = 'unset';
      tabsContainer.style.top = 'unset';
      tabsContainer.style.bottom = 'unset';
      tabsContainer.style.right = 'unset';
      tabsContainer.style.left = 'unset';
      tabsContainer.style.background = '#fff';
    };
  }, [graph, visible, outSideFromCanvas, placement]);

  return (
    <div className="gi-side-tabs-container" ref={divRef} style={{ background: '#fff' }}>
      {children}
    </div>
  );
};

export default SideContainer;
