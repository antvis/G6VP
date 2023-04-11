/* eslint-disable react/require-default-props */
import type { IG6GraphEvent } from '@antv/graphin';
import React, { useEffect } from 'react';
import useContextMenu, { State } from './useContextMenu';

export const defaultStyle: React.CSSProperties = {
  width: '120px',
  boxShadow: '0 4px 12px rgb(0 0 0 / 15%)',
};

export interface ContextMenuValue extends State {
  oneShow: (e: IG6GraphEvent) => void;
  onClose: () => void;
  id: string;
}

export interface ContextMenuProps {
  children: (content: ContextMenuValue) => React.ReactNode;
  setItem: (item: any) => void;
  style?: React.CSSProperties;
}

const container = React.createRef() as React.RefObject<HTMLDivElement>;

const ContextMenu: React.FunctionComponent<ContextMenuProps> = props => {
  const { children, style, setItem } = props;
  const contextmenu = useContextMenu({
    container,
  });
  const { visible, x, y, item } = contextmenu;
  useEffect(() => setItem(item), [item]);

  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
  };

  if (typeof children !== 'function') {
    console.error('<ContextMenu /> children should be a function');
    return null;
  }
  const id = (item && !item.destroyed && item.getModel && item.getModel().id) || '';

  return (
    <div
      ref={container}
      className="graphin-components-contextmenu"
      style={{ ...defaultStyle, ...style, ...positionStyle, display: visible ? 'block' : 'none' }}
      key={id}
    >
      {children({
        ...contextmenu,
        id,
      })}
    </div>
  );
};

export default ContextMenu;
