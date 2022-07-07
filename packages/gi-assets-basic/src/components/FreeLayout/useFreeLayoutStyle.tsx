import React, { useEffect } from 'react';

const useFreeLayoutStyle = (
  leftWidth,
  rightWidth,
  bottomHeight,
  leftVisible,
  rightVisible,
  bottomVisible,
  GISDK_ID,
) => {
  const container = document.getElementById(`${GISDK_ID}-container`) as HTMLDivElement;


  useEffect(() => {
    let leftContainer;
    if (leftVisible) {
      leftContainer = document.createElement('div');
      leftContainer.id = `${GISDK_ID}-free-layout-left`;
      leftContainer.className = 'graphinsight-free-layout-left graphinsight-free-layout';
      leftContainer.style.width = leftWidth;
      container.appendChild(leftContainer);
    }

    return () => {
      leftContainer && container.removeChild(leftContainer);
    };
  }, [leftVisible, leftWidth, GISDK_ID, container.clientWidth]);

  useEffect(() => {
    let rightContainer;
    if (rightVisible) {
      rightContainer = document.createElement('div');
      rightContainer.id = `${GISDK_ID}-free-layout-right`;
      rightContainer.className = 'graphinsight-free-layout-right graphinsight-free-layout';
      rightContainer.style.width = rightWidth;
      container.appendChild(rightContainer);
    }

    return () => {
      rightContainer && container.removeChild(rightContainer);
    };
  }, [rightVisible, rightWidth, GISDK_ID, container.clientWidth]);

  useEffect(() => {
    let bottomContainer;
    if (bottomVisible) {
      bottomContainer = document.createElement('div');
      bottomContainer.id = `${GISDK_ID}-free-layout-bottom`;
      bottomContainer.className = 'graphinsight-free-layout-bottom graphinsight-free-layout';
      bottomContainer.style.left = leftVisible ? leftWidth : '0px';
      bottomContainer.style.right = rightVisible ? rightWidth : '0px';
      bottomContainer.style.height = bottomHeight;
      container.appendChild(bottomContainer);
    }

    return () => {
      bottomContainer && container.removeChild(bottomContainer);
    };
  }, [leftWidth, rightWidth, bottomHeight, GISDK_ID, container.clientWidth, leftVisible, rightVisible, bottomVisible]);

  // React.useEffect(() => {
  //   const leftContainer = document.createElement('div');
  //   const rightContainer = document.createElement('div');
  //   const bottomContainer = document.createElement('div');

  //   leftContainer.id = `${GISDK_ID}-free-layout-left`;
  //   rightContainer.id = `${GISDK_ID}-free-layout-right`;
  //   bottomContainer.id = `${GISDK_ID}-free-layout-bottom`;

  //   leftContainer.className = 'graphinsight-free-layout-left graphinsight-free-layout';
  //   rightContainer.className = 'graphinsight-free-layout-right graphinsight-free-layout';
  //   bottomContainer.className = 'graphinsight-free-layout-bottom graphinsight-free-layout';

  //   leftContainer.style.width = leftWidth;
  //   rightContainer.style.width = rightWidth;

  //   bottomContainer.style.left = leftVisible ? leftWidth : '0px';
  //   bottomContainer.style.right = rightVisible ? rightWidth : '0px';
  //   bottomContainer.style.height = bottomHeight;

  //   container.appendChild(leftContainer);
  //   container.appendChild(rightContainer);
  //   container.appendChild(bottomContainer);

  //   return () => {
  //     container.removeChild(leftContainer);
  //     container.removeChild(rightContainer);
  //     container.removeChild(bottomContainer);
  //   };
  // }, [leftWidth, rightWidth, bottomHeight, GISDK_ID, container.clientWidth, leftVisible, rightVisible, bottomVisible]);
};

export default useFreeLayoutStyle;
