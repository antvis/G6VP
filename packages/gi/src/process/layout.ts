import React from 'react';
const useLayout = props => {
  const { GISDK_ID, outSideFromCanvas, options } = props;
  const { flexDirection } = options;
  React.useEffect(() => {
    const container = document.getElementById(`${GISDK_ID}-container`);
    if (outSideFromCanvas && container) {
      container.style.display = 'flex';
      container.style.flexDirection = flexDirection;
    } else if (container) {
      container.style.display = 'block';
    }
  }, [outSideFromCanvas, flexDirection]);
};

export default useLayout;
