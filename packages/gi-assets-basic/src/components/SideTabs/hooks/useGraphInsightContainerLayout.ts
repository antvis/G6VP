import React from 'react';
export interface Options {
  placement: 'LT' | 'LB' | 'RT' | 'RB';
  offset: number[];
  width: string;
  height: string;
  visible: boolean;
}

/**
 *
 * @param props
 */
const useGraphInsightContainerLayout = (GISDK_ID: string, outSideFromCanvas: boolean, options: Options) => {
  const { width, height, placement, visible } = options;
  React.useEffect(() => {
    const container = document.getElementById(`${GISDK_ID}-container`) as HTMLDivElement;
    const componentsContainer = document.getElementById(`${GISDK_ID}-container-extra`) as HTMLDivElement;
    // hard code
    const tabsNav = document.querySelector('.gi-side-tabs .ant-tabs-nav-list') as HTMLDivElement;

    if (container && componentsContainer) {
      if (outSideFromCanvas) {
        container.className = `graphinsight-container ${placement}`;
        componentsContainer.className = `graphinsight-container-extra ${placement}`;
        componentsContainer.style.width = visible ? width : `${tabsNav.offsetWidth || 50}px`;
        componentsContainer.style.height = height;
      } else {
        container.className = '';
        componentsContainer.className = '';
        componentsContainer.style.width = 'unset';
        componentsContainer.style.height = 'unset';
      }
    }

    return () => {
      container.className = '';
      componentsContainer.className = '';
      componentsContainer.style.width = 'unset';
      componentsContainer.style.height = 'unset';
    };
  }, [outSideFromCanvas, placement, width, height, visible]);
};

export default useGraphInsightContainerLayout;
