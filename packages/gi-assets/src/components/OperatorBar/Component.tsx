import { Space } from 'antd';
import * as React from 'react';
import WrapContainer from '../OperatorHeader/WrapContainer';
import './index.less';
export interface OperatorBarProps {}

const OperatorBar: React.FunctionComponent<OperatorBarProps> = props => {
  //@ts-ignore
  const { components, assets } = props;

  const sortedComponents = components.sort((a, b) => a.props?.GI_CONTAINER_INDEX - b.props?.GI_CONTAINER_INDEX);

  return (
    <div className="gi-operator-bar" style={{ padding: '8px' }}>
      <Space>
        {sortedComponents.map(item => {
          if (!item) {
            return null;
          }
          const { props: itemProps, id: itemId } = item;
          const { component: Component } = assets[itemId];
          let WrapComponent = Component;
          if (itemProps.GIAC_CONTENT) {
            WrapComponent = WrapContainer(Component, itemId);
          }
          return (
            <span key={itemId}>
              <WrapComponent {...itemProps} />
            </span>
          );
        })}
      </Space>
    </div>
  );
};

export default React.memo(OperatorBar, (preProps: any, nextProps: any) => {
  const { assets: preAssets, ...otherPreProps } = preProps;
  const { assets: nextAssets, ...otherNextProps } = nextProps;
  const isEqual = JSON.stringify(otherPreProps) == JSON.stringify(otherNextProps);

  if (isEqual) {
    return true;
  }
  return false;
});
