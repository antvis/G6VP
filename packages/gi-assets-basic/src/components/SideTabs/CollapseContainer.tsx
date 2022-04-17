import { utils } from '@alipay/graphinsight';
import * as React from 'react';
import type { ContainerProps } from './typing';

const CollapseContainer: React.FunctionComponent<ContainerProps> = props => {
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
    height,
    width,
    backgroundColor: '#fff',
    padding: '8px',
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  };
  const styles = state.visible ? baseStyle : { ...baseStyle, width: '0px' };
  const handerBackStyles = {
    position: 'absolute',
    left: '100%',
    top: '50%',
    height: '80px',
    width: '38px',
    borderStyle: 'solid',
    borderWidth: '20px',
    borderColor: 'transparent transparent transparent #d9d9d9',
  };
  const handlerStyles: React.CSSProperties = {
    position: 'absolute',
    left: 'calc(100% - 1px)',
    top: '50%',
    height: '80px',
    width: '38px',
    cursor: 'pointer',
    borderStyle: 'solid',
    borderWidth: '20px',
    borderColor: 'transparent transparent transparent #fafafa',
  };
  const handlerTextStyles = {
    position: 'absolute',
    left: '-15px',
    top: '8px',
  };

  const { children } = props;
  return (
    <div style={styles} className="gi-side-tabs">
      <div style={handerBackStyles as any}></div>
      <div onClick={handleToggle} style={handlerStyles as any}>
        <span style={handlerTextStyles as any}>||</span>
      </div>
      <div className="gi-side-tabs-content">{children}</div>
    </div>
  );
};
export default CollapseContainer;
