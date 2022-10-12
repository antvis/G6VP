import { Handler } from '@alipay/gi-common-components';
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
    overflow: 'visible',
  };
  const styles = state.visible ? baseStyle : { ...baseStyle, width: '0px', padding: '0' };

  const { children } = props;
  return (
    <div style={styles}>
      <Handler type={placement === 'LB' || placement === 'LT' ? 'left' : 'right'} handleClick={handleToggle} />
      <div
        style={{
          overflowY: 'auto',
          height: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
};
export default CollapseContainer;
