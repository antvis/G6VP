import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { utils } from '@antv/gi-sdk';
import * as React from 'react';

export interface ContainerProps {
  placement: 'LT' | 'LB' | 'RT' | 'RB';
  offset: number[];
  width: string;
  height: string;
  defaultVisible: boolean;
}

const QueryContainer: React.FunctionComponent<ContainerProps> = props => {
  const { placement, offset, width, height, defaultVisible } = props;

  const [state, setState] = React.useState({
    visible: typeof defaultVisible === 'boolean' ? defaultVisible : true,
  });

  const handleToggle = () => {
    setState(preState => {
      return {
        visible: !preState.visible,
      };
    });
  };

  const postionStyles = utils.getPositionStyles(placement, offset);

  const baseStyle = {
    ...postionStyles,
    top: '0px',
    width,
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
    transition: 'all 0.1s ease',
  };
  // 利用1像素尺寸变化监听left值
  const styles = state.visible ? baseStyle : { ...baseStyle, left: '0px', width: '0px' };
  const handerBackStyles = {
    position: 'absolute',
    left: '100%',
    top: '50%',
    height: '80px',
    width: '38px',
    borderStyle: 'solid',
    borderWidth: '16px',
    borderColor: 'transparent transparent transparent var(--background-color-2)',
  };
  const handlerStyles: React.CSSProperties = {
    position: 'absolute',
    left: 'calc(100% - 1px)',
    top: '50%',
    height: '80px',
    width: '38px',
    cursor: 'pointer',
    borderStyle: 'solid',
    borderWidth: '16px',
    borderColor: 'transparent transparent transparent var(--background-color-2)',
  };
  const handlerTextStyles = {
    position: 'absolute',
    left: '-13px',
    top: '14px',
    fontSize: 10,
  };

  const { children } = props;
  return (
    <div style={styles} className="gi-side-select-tabs">
      <div style={handerBackStyles as any}></div>
      <div onClick={handleToggle} style={handlerStyles as any}>
        <span style={handlerTextStyles as any}>{state.visible ? <LeftOutlined /> : <RightOutlined />}</span>
      </div>
      <div className="gi-side-select-tabs-content">{children}</div>
    </div>
  );
};
export default QueryContainer;
