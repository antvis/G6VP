import { Space } from 'antd';
import * as React from 'react';
import WrapContainer from '../OperatorHeader/WrapContainer';
import './index.less';
export interface OperatorBarProps {}

const getComponents = (components, assets) => {
  return components
    .sort((a, b) => a.props?.GI_CONTAINER_INDEX - b.props?.GI_CONTAINER_INDEX)
    .map(item => {
      if (!item) {
        return null;
      }

      const { props: itemProps, id: itemId } = item;

      if (!assets[itemId]) {
        console.warn(`assets ${itemId} is undefined`);
        return null;
      }
      const { component: Component } = assets[itemId];
      let WrapComponent = Component;
      if (itemProps.GIAC_CONTENT) {
        WrapComponent = WrapContainer(Component, itemId);
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
  const { assets, ...otherProps } = props;
  const deps = JSON.stringify(otherProps);
  const COMPOENTS = React.useMemo(() => {
    //@ts-ignore
    const { components } = props;
    const COMPOENTS = getComponents(components, assets);
    return COMPOENTS;
  }, [deps]);

  return (
    <div className="gi-operator-bar" style={{ padding: '8px' }}>
      <Space>{COMPOENTS}</Space>
    </div>
  );
};

export default OperatorBar;
