import React from 'react';
export interface Options {
  placement: 'LT' | 'LB' | 'RT' | 'RB';
  offset: number[];
  width: string;
  height: string;
}

/**
 *
 * @param props
 */
const useGraphInsightContainerLayout = (GISDK_ID: string, outSideFromCanvas: boolean, options: Options) => {
  const { width, height, placement } = options;
  React.useEffect(() => {
    console.log('width', width, height, placement);
    const container = document.getElementById(`${GISDK_ID}-container`);
    const componentsContainer = document.getElementById(`${GISDK_ID}-container-extra`);
    if (container && componentsContainer) {
      if (outSideFromCanvas) {
        container.className = `graphinsight-container ${placement}`;
        componentsContainer.className = `graphinsight-container-extra ${placement}`;
        componentsContainer.style.width = width;
        componentsContainer.style.height = height;
      } else {
        container.className = '';
        componentsContainer.className = '';
        componentsContainer.style.width = 'unset';
        componentsContainer.style.height = 'unset';
      }
    }
  }, [outSideFromCanvas, placement, width, height]);
};

export default useGraphInsightContainerLayout;
