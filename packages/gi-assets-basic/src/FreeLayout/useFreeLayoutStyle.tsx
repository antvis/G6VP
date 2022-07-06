import React from "react";

const useFreeLayoutStyle = (leftWidth, rightWidth, bottomHeight, GISDK_ID) => {
  const container = document.getElementById(
    `${GISDK_ID}-container`
  ) as HTMLDivElement;
  React.useEffect(() => {
    const leftContainer = document.getElementById(
      `${GISDK_ID}-free-layout-left`
    ) as HTMLDivElement;
    const rightContainer = document.getElementById(
      `${GISDK_ID}-free-layout-right`
    ) as HTMLDivElement;
    const bottomContainer = document.getElementById(
      `${GISDK_ID}-free-layout-bottom`
    ) as HTMLDivElement;

    leftContainer.className =
      "graphinsight-free-layout-left graphinsight-free-layout";
    rightContainer.className =
      "graphinsight-free-layout-right graphinsight-free-layout";
    bottomContainer.className =
      "graphinsight-free-layout-bottom graphinsight-free-layout";

    leftContainer.style.width = leftWidth;
    rightContainer.style.width = rightWidth;

    bottomContainer.style.left = leftWidth;
    bottomContainer.style.right = rightWidth;
    bottomContainer.style.height = bottomHeight;

    // 监听拉伸 DOM
    const leftContainerHandler = document.getElementById(`${GISDK_ID}-free-layout-left-handler`) as HTMLDivElement;
    leftContainerHandler.className = "graphinsight-free-layout-left-hanlder"

    return () => {
      leftContainer.style.width = "0";
      rightContainer.style.width = "0";
      leftContainer.className = "";
      rightContainer.className = "";
      bottomContainer.className = "";
    };
  }, [leftWidth, rightWidth, bottomHeight, GISDK_ID, container.clientWidth]);
};

export default useFreeLayoutStyle;
