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
    let leftContainer = document.getElementById(`${GISDK_ID}-free-layout-left`);
    let rightContainer = document.getElementById(`${GISDK_ID}-free-layout-right`);
    let bottomContainer = document.getElementById(`${GISDK_ID}-free-layout-bottom`);

    // let rightContainer, leftContainer, bottomContainer;

    if (!leftContainer) {
      leftContainer = document.createElement('div');
      leftContainer.id = `${GISDK_ID}-free-layout-left`;
      leftContainer.className = 'graphinsight-free-layout-left graphinsight-free-layout';

      container.appendChild(leftContainer);
    }

    if (!rightContainer) {
      rightContainer = document.createElement('div');
      rightContainer.id = `${GISDK_ID}-free-layout-right`;
      rightContainer.className = 'graphinsight-free-layout-right graphinsight-free-layout';

      container.appendChild(rightContainer);
    }

    if (!bottomContainer) {
      bottomContainer = document.createElement('div');
      bottomContainer.id = `${GISDK_ID}-free-layout-bottom`;
      bottomContainer.className = 'graphinsight-free-layout-bottom graphinsight-free-layout';

      container.appendChild(bottomContainer);
    }
    if (leftVisible) {
      canvasContainer.style.left = leftWidth;
      leftContainer.style.width = leftWidth;
    } else {
      leftContainer && container.removeChild(leftContainer);
    }
    if (rightVisible) {
      canvasContainer.style.right = rightWidth;
      rightContainer.style.width = rightWidth;
    } else {
      container.removeChild(rightContainer);
    }
    if (bottomVisible) {
      canvasContainer.style.bottom = bottomHeight;
      bottomContainer.style.left = leftVisible ? leftWidth : '0px';
      bottomContainer.style.right = rightVisible ? rightWidth : '0px';
      bottomContainer.style.height = bottomHeight;
    } else {
      container.removeChild(bottomContainer);
    }
    return () => {
      try {
        !leftVisible && leftContainer && container.removeChild(leftContainer);
        !rightVisible && rightContainer && container.removeChild(rightContainer);
        !bottomVisible && bottomContainer && container.removeChild(bottomContainer);
      } catch (error) {
        console.log('error', error);
      }
    };
  }, [GISDK_ID, leftWidth, rightWidth, bottomHeight, leftVisible, rightVisible, bottomVisible]);

  // React.useEffect(() => {
  //   const canvasContainer = document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLDivElement;
  //   if (canvasContainer) {
  //     canvasContainer.style.position = 'absolute';
  //     canvasContainer.style.width = 'unset';
  //     canvasContainer.style.height = 'unset';
  //     canvasContainer.style.top = '0px';
  //     canvasContainer.style.right = '0px';
  //     canvasContainer.style.left = '0px';
  //     canvasContainer.style.bottom = '0px';
  //   }
  // }, [GISDK_ID]);

  // React.useEffect(() => {
  //   const container = document.getElementById(`${GISDK_ID}-container`) as HTMLDivElement;
  //   const canvasContainer = document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLDivElement;
  //   let leftContainer;
  //   if (leftVisible) {
  //     leftContainer = document.createElement('div');
  //     leftContainer.id = `${GISDK_ID}-free-layout-left`;
  //     leftContainer.className = 'graphinsight-free-layout-left graphinsight-free-layout';
  //     leftContainer.style.width = leftWidth;
  //     container.appendChild(leftContainer);
  //     canvasContainer.style.left = leftWidth;
  //   }
  //   return () => {
  //     leftContainer && container.removeChild(leftContainer);
  //   };
  // }, [GISDK_ID, leftVisible, leftWidth]);

  // React.useEffect(() => {
  //   const container = document.getElementById(`${GISDK_ID}-container`) as HTMLDivElement;
  //   const canvasContainer = document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLDivElement;

  //   let rightContainer;
  //   if (rightVisible) {
  //     rightContainer = document.createElement('div');
  //     rightContainer.id = `${GISDK_ID}-free-layout-right`;
  //     rightContainer.className = 'graphinsight-free-layout-right graphinsight-free-layout';
  //     rightContainer.style.width = rightWidth;
  //     container.appendChild(rightContainer);
  //     canvasContainer.style.right = rightWidth;
  //   }
  //   return () => {
  //     rightContainer && container.removeChild(rightContainer);
  //   };
  // }, [GISDK_ID, rightVisible, rightWidth]);
  // React.useEffect(() => {
  //   const container = document.getElementById(`${GISDK_ID}-container`) as HTMLDivElement;
  //   const canvasContainer = document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLDivElement;
  //   let bottomContainer;
  //   if (bottomVisible) {
  //     bottomContainer = document.createElement('div');
  //     bottomContainer.id = `${GISDK_ID}-free-layout-bottom`;
  //     bottomContainer.className = 'graphinsight-free-layout-bottom graphinsight-free-layout';
  //     bottomContainer.style.left = leftVisible ? leftWidth : '0px';
  //     bottomContainer.style.right = rightVisible ? rightWidth : '0px';
  //     bottomContainer.style.height = bottomHeight;
  //     container.appendChild(bottomContainer);
  //     canvasContainer.style.bottom = bottomHeight;
  //   }
  //   return () => {
  //     bottomContainer && container.removeChild(bottomContainer);
  //   };
  // }, [GISDK_ID, bottomVisible, leftVisible, rightVisible, bottomHeight, rightWidth, leftWidth]);
};

export default useFreeLayoutStyle;
