import React from 'react';

const useFreeLayoutStyle = (leftWidth, rightWidth, bottomHeight, GISDK_ID) => {
  const container = document.getElementById(`${GISDK_ID}-container`) as HTMLDivElement;
  React.useEffect(() => {
    const leftContainer = document.createElement('div');
    const rightContainer = document.createElement('div');
    const bottomContainer = document.createElement('div');

    leftContainer.id = `${GISDK_ID}-free-layout-left`;
    rightContainer.id = `${GISDK_ID}-free-layout-right`;
    bottomContainer.id = `${GISDK_ID}-free-layout-bottom`;

    leftContainer.className = 'graphinsight-free-layout-left graphinsight-free-layout';
    rightContainer.className = 'graphinsight-free-layout-right graphinsight-free-layout';
    bottomContainer.className = 'graphinsight-free-layout-bottom graphinsight-free-layout';

    leftContainer.style.width = leftWidth;
    rightContainer.style.width = rightWidth;

    bottomContainer.style.left = leftWidth;
    bottomContainer.style.right = rightWidth;
    bottomContainer.style.height = bottomHeight;

    container.appendChild(leftContainer);
    container.appendChild(rightContainer);
    container.appendChild(bottomContainer);

    return () => {
      container.removeChild(leftContainer);
      container.removeChild(rightContainer);
      container.removeChild(bottomContainer);
    };
  }, [leftWidth, rightWidth, bottomHeight, GISDK_ID, container.clientWidth]);
};

export default useFreeLayoutStyle;
