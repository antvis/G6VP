import React from 'react';
import './index.less';

const defaultStyle: React.CSSProperties = {
  zIndex: 999,
  background: '#fff',
  marginBlockEnd: '0px',
};

export interface ToolBarItemType {
  name: string | JSX.Element;
  key?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type ToolbarDirectionType = 'vertical' | 'horizontal';

export interface ToolBarProps {
  /**
   * @description 可以放置自定义组件
   */
  children?: React.ReactNode;

  direction?: ToolbarDirectionType;
  /**
   * @description Toolbar的样式，可以指定位置
   * @default {position:"absolute",background:"#fff"} 当 direction 水平方向 {right:0,top:0} ,当 direction 垂直方向，默认放置{left:0,bottom:0}
   */
  style?: React.CSSProperties;
}

const Toolbar: React.FunctionComponent<ToolBarProps> = props => {
  const { children, style = {}, direction = 'horizontal' } = props;

  const isHorizontal = direction === 'horizontal';
  const positionStyle: React.CSSProperties = {
    position: 'absolute',
  };
  // 水平方向，默认在右上角
  if (isHorizontal) {
    positionStyle.right = 0;
    positionStyle.top = 0;
  } else {
    // 垂直方向，默认在左下角
    positionStyle.left = 0;
    positionStyle.bottom = 0;
  }

  return (
    <div
      // @ts-ignore
      style={{ ...defaultStyle, ...positionStyle, ...style }}
      className="graphin-components-toolbar"
    >
      {
        <ul
          className="graphin-components-toolbar-content"
          style={{ display: isHorizontal ? 'flex' : '', marginBlockEnd: '0px' }}
        >
          {children}
        </ul>
      }
    </div>
  );
};

export default Toolbar;
