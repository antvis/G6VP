import { useComponents, useContext } from '@antv/gi-sdk';
import * as React from 'react';

import './index.less';
export interface OperatorBarProps {}

const OperatorBar: React.FunctionComponent<OperatorBarProps> = props => {
  //@ts-ignore
  const { assets, GISDK_ID, placement, offset, height, width, GI_CONTAINER } = props;
  const { context } = useContext();

  const { components } = useComponents(GI_CONTAINER, context.components, assets);
  const isLeft = placement === 'LT' || placement === 'LB';
  const isTop = placement === 'LT' || placement === 'RT';
  console.log('components >>>>', components);

  return (
    <div
      className="gi-operator-bar"
      style={{
        top: isTop ? '0px' : 'unset',
        bottom: !isTop ? '0px' : 'unset',
        right: !isLeft ? '0px' : 'unset',
        left: isLeft ? '0px' : 'unset',
        textAlign: isLeft ? 'left' : 'right',
        marginLeft: isLeft ? offset[0] : 'unset',
        marginRight: !isLeft ? offset[0] : 'unset',
        marginTop: isTop ? offset[1] : 'unset',
        marginBottom: !isTop ? offset[1] : 'unset',
        width: width || '100%',
        height: height || 'fit-content',
      }}
    >
      {/* <Space>{COMPOENTS}</Space> */}
    </div>
  );
};

export default OperatorBar;
