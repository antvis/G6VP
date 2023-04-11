import { Space } from 'antd';
import * as React from 'react';
import WrapContainer from '../OperatorHeader/WrapContainer';
import './index.less';
export interface OperatorBarProps {}

const getComponents = (components, assets, GISDK_ID) => {
  return components
    .sort((a, b) => a.props?.GI_CONTAINER_INDEX - b.props?.GI_CONTAINER_INDEX)
    .map(item => {
      if (!item) {
        console.warn(`component config not found`);
        return null;
      }
      const { props: itemProps, id: itemId } = item;
      const asset = assets[itemId];
      if (!asset) {
        console.warn(`asset: ${itemId} not found`);
        return null;
      }
      const { component: Component } = assets[itemId];
      let WrapComponent = Component;
      if (itemProps.GIAC_CONTENT) {
        WrapComponent = WrapContainer(Component, itemId, GISDK_ID);
      }
      return (
        <div key={itemId}>
          <WrapComponent {...itemProps} />
        </div>
      );
    })
    .filter(item => {
      return item !== null;
    });
};

const OperatorBar: React.FunctionComponent<OperatorBarProps> = props => {
  //@ts-ignore
  const { assets, GISDK_ID, placement, offset, height, width, ...otherProps } = props;
  const deps = JSON.stringify(otherProps);
  const COMPOENTS = React.useMemo(() => {
    //@ts-ignore
    const { components } = props;
    const COMPOENTS = getComponents(components, assets, GISDK_ID);
    return COMPOENTS;
  }, [deps]);

  const isLeft = placement === 'LT' || placement === 'LB';
  const isTop = placement === 'LT' || placement === 'RT';

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
      <Space>{COMPOENTS}</Space>
    </div>
  );
};

export default OperatorBar;
