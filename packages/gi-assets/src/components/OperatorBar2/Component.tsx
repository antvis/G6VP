import { Space } from 'antd';
import * as React from 'react';
import './index.less';
import WrapContainer from './WrapContainer';
export interface OperatorBarProps {}

const OperatorBar2: React.FunctionComponent<OperatorBarProps> = props => {
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
            WrapComponent = WrapContainer(Component);
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

export default OperatorBar2;
