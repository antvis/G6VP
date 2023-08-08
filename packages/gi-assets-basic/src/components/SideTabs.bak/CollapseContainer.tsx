import { Handler } from '@antv/gi-common-components';
import { utils } from '@antv/gi-sdk';
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
    padding: '8px',
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
