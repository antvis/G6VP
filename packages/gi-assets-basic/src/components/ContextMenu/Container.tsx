/* eslint-disable react/require-default-props */
import type { IG6GraphEvent } from '@antv/graphin';
import React, { useEffect, useRef } from 'react';
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

const ContextMenu: React.FunctionComponent<ContextMenuProps> = props => {
  const container = useRef<HTMLDivElement>(null);
  const { children, style, setItem } = props;
  const contextmenu = useContextMenu({
    container,
  });
  const { visible, x, y, id } = contextmenu;

  // 不建议在 useEffect 中处理数据：https://zh-hans.react.dev/learn/you-might-not-need-an-effect
  // useEffect(() => setItem(item), [item]);

  // 建议是在 useContextMenu 中处理x和y的指
  // useEffect(() => {
  //   // 当 tooltip 超出画布高度，调整其位置
  //   if (!visible || !container.current || !graph || graph.get('destroyed')) {
  //     setTop(y);
  //     return;
  //   }
  //   const { width, height } = container.current.getBoundingClientRect();
  //   const { bottom } = graph.getContainer().getBoundingClientRect();
  //   if (y + height > bottom) setTop(bottom - height - 40);
  //   else setTop(y);
  // }, [visible, y]);

  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
  };
  console.log('container........', contextmenu);

  if (typeof children !== 'function') {
    console.error('<ContextMenu /> children should be a function');
    return null;
  }
  useEffect(() => {
    const handlePreventDefault = e => {
      e.preventDefault();
      e.stopPropagation();
    };
    container.current?.addEventListener('contextmenu', handlePreventDefault);
    return () => {
      container.current?.removeEventListener('contextmenu', handlePreventDefault);
    };
  }, []);

  return (
    <div
      ref={container}
      className="graphin-components-contextmenu"
      style={{ ...defaultStyle, ...style, ...positionStyle, visibility: visible ? 'visible' : 'hidden' }}
      key={id}
    >
      {children(contextmenu)}
    </div>
  );
};

export default ContextMenu;
