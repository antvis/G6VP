import React from 'react';

const useFreeLayoutStyle = (
  leftWidth,
  rightWidth,
  bottomHeight,
  leftVisible,
  rightVisible,
  bottomVisible,
  GISDK_ID,
) => {
  React.useEffect(() => {
    const container = document.getElementById(`${GISDK_ID}-container`) as HTMLDivElement;
    const canvasContainer = document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLDivElement;
    if (canvasContainer) {
      canvasContainer.style.position = 'absolute';
      canvasContainer.style.width = 'unset';
      canvasContainer.style.height = 'unset';
      canvasContainer.style.top = '0px';
      canvasContainer.style.right = '0px';
      canvasContainer.style.left = '0px';
      canvasContainer.style.bottom = '0px';
    }

    let rightContainer, leftContainer, bottomContainer;

    if (leftVisible) {
      leftContainer = document.createElement('div');
      leftContainer.id = `${GISDK_ID}-free-layout-left`;
      leftContainer.className = 'graphinsight-free-layout-left graphinsight-free-layout';
      leftContainer.style.width = leftWidth;
      container.appendChild(leftContainer);
      canvasContainer.style.left = leftWidth;
    }
    if (rightVisible) {
      rightContainer = document.createElement('div');
      rightContainer.id = `${GISDK_ID}-free-layout-right`;
      rightContainer.className = 'graphinsight-free-layout-right graphinsight-free-layout';
      rightContainer.style.width = rightWidth;
      container.appendChild(rightContainer);
      canvasContainer.style.right = rightWidth;
    }
    if (bottomVisible) {
      bottomContainer = document.createElement('div');
      bottomContainer.id = `${GISDK_ID}-free-layout-bottom`;
      bottomContainer.className = 'graphinsight-free-layout-bottom graphinsight-free-layout';
      bottomContainer.style.left = leftVisible ? leftWidth : '0px';
      bottomContainer.style.right = rightVisible ? rightWidth : '0px';
      bottomContainer.style.height = bottomHeight;
      container.appendChild(bottomContainer);
      canvasContainer.style.bottom = bottomHeight;
    }

    return () => {
      leftContainer && container.removeChild(leftContainer);
      rightContainer && container.removeChild(rightContainer);
      bottomContainer && container.removeChild(bottomContainer);
    };
  }, [GISDK_ID, leftWidth, rightWidth, bottomHeight, leftVisible, rightVisible, bottomVisible]);
};

export default useFreeLayoutStyle;
