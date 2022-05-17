import { utils } from '@alipay/graphinsight';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import * as React from 'react';
import './index.less';
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
  } = props;

  console.log('props', props);
  const styles = utils.getPositionStyles(containerPlacement, offset);
  const ps = POSITION_MAP[containerPlacement];
  const classes = animate ? (visible ? `${ps} open` : `${ps} close`) : '';
  const displayStyle = animate
    ? {}
    : {
        display: visible ? 'block' : 'none',
      };
  return (
    <div
      style={{
        ...styles,
        ...displayStyle,
        width: containerWidth,
        height: containerHeight,
        boxShadow: '6px 0 16px -8px rgb(0 0 0 / 8%), 9px 0 28px 0 rgb(0 0 0 / 5%), 12px 0 48px 16px rgb(0 0 0 / 3%)',
      }}
      className={`gi-panel-div ${classes}`}
    >
      <div className="header">
        <div className="title"> {title}</div>
        <div className="close">
          <Button icon={<CloseOutlined />} type="text" onClick={onClose}></Button>
        </div>
      </div>
      <div className="body">{children}</div>
    </div>
  );
};

export default DivContainer;
