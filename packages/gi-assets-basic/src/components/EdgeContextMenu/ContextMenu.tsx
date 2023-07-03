import React from 'react';
import ContextMenu, { ContextMenuContainerProps } from '../ContextMenu/ContextMenu';

const ContextMenuContainer = (props: ContextMenuContainerProps) => {
  return <ContextMenu {...props} bindTypes={['edge']} />;
};

export default ContextMenuContainer;
