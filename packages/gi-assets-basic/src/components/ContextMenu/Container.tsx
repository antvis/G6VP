/* eslint-disable react/require-default-props */
import type { IG6GraphEvent } from '@antv/graphin';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import useContextMenu, { State } from './useContextMenu';
import { useContext } from '@antv/gi-sdk';

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

const ContextMenu: React.FunctionComponent<ContextMenuProps> = props => {
  const container = useRef<HTMLDivElement>(null);
  const { graph } = useContext();
  const { children, style, setItem } = props;
  const contextmenu = useContextMenu({
    container,
  });
  const { visible, x, y, item } = contextmenu;
  const [top, setTop] = useState(y);
  useEffect(() => setItem(item), [item]);

  useEffect(() => {
    // 当 tooltip 超出画布高度，调整其位置
    if (!visible || !container.current || !graph || graph.get('destroyed')) {
      setTop(y);
      return;
    }
    const { width, height } = container.current.getBoundingClientRect();
    const { bottom } = graph.getContainer().getBoundingClientRect();
    if (y + height > bottom) setTop(bottom - height - 40);
    else setTop(y);
  }, [visible, y]);

  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    left: x,
    top,
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
