import { useContainer, useContext } from '@antv/gi-sdk';
import React from 'react';
import './index.less';

const ConciseContainer = props => {
  const { children } = props;
  const context = useContext();
  const { config, assets, HAS_GRAPH } = context;
  const Containers = useContainer(context);

  const [NavbarArea, ViewArea, DataArea, StylingArea, CanvasArea] = Containers;
  console.log('containers', Containers);

  return (
    <div className="gi-rich-container">
      <div className="gi-rich-container-navbar">{NavbarArea.children.map(item => item.component)}</div>
      <div className="gi-rich-container-toolbar">,,,,,,</div>
      <div className="gi-rich-container-content">
        <div className="gi-rich-container-side"></div>
        <div className="gi-rich-container-canvas">{children}</div>
      </div>
    </div>
  );
};

export default ConciseContainer;
