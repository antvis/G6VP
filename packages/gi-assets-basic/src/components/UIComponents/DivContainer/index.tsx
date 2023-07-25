import { CloseOutlined } from '@ant-design/icons';
import { utils } from '@antv/gi-sdk';
import { Button, Divider } from 'antd';
import React from 'react';
import Draggable from 'react-draggable';
import './index.less';
import ReactDOM from 'react-dom';

const POSITION_MAP = {
  LT: 'top',
  LB: 'left',
  RT: 'right',
  RB: 'bottom',
};

export interface ContainerTypeProps {
  containerWidth: string;
  containerHeight: string;
  containerPlacement: 'LT' | 'LB' | 'RT' | 'RB';
  children: any;
  visible: boolean;
  offset: number[];
  onClose: () => void;
  title: string;
  animate?: boolean;
  getContainer?: HTMLDivElement;
  draggable?: boolean;
  dragHandle?: 'header' | 'divContainer';
}

const DivContainer: React.FunctionComponent<ContainerTypeProps> = props => {
  const {
    containerWidth = '600px',
    containerHeight = 'calc(100vh - 64px)',
    containerPlacement,
    children,
    visible,
    offset,
    onClose,
    title,
    animate,
    getContainer,
    draggable = false,
    dragHandle = 'header',
  } = props;

  const styles = utils.getPositionStyles(containerPlacement, offset);
  if (containerPlacement === 'RT' || containerPlacement === 'LB') {
    styles.bottom = '4px';
    styles.top = '4px';
    styles.height = 'unset';
  }

  const ps = POSITION_MAP[containerPlacement];
  const classes = animate ? (visible ? `${ps} open` : `${ps} close`) : '';
  const displayStyle = animate
    ? {}
    : {
        display: visible ? 'block' : 'none',
      };
  const nodeRef = React.useRef(null);

  const DivContainer = (
    <div
      ref={nodeRef}
      style={{
        width: containerWidth,
        height: containerHeight,
        boxShadow: '6px 0 16px -8px rgb(0 0 0 / 8%), 9px 0 28px 0 rgb(0 0 0 / 5%), 12px 0 48px 16px rgb(0 0 0 / 3%)',
        cursor: draggable && dragHandle === 'divContainer' ? 'move' : 'default',
        ...styles,
        ...displayStyle,
      }}
      className={`divContainer gi-panel-div ${classes}`}
    >
      <div className="header" style={{ cursor: draggable ? 'move' : 'default' }}>
        <div className="title"> {title}</div>
        <div className="close">
          <Button icon={<CloseOutlined />} type="text" onClick={onClose}></Button>
        </div>
      </div>
      <Divider style={{ margin: 0 }} />
      <div className="body">{children}</div>
    </div>
  );

  if (draggable) {
    return ReactDOM.createPortal(
      <Draggable handle={`.${dragHandle}`} bounds="parent">
        {DivContainer}
      </Draggable>,
      getContainer!,
    );
  }
  return DivContainer;
};

export default DivContainer;
