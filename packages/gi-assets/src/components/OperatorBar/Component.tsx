import { Space } from 'antd';
import * as React from 'react';
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
          const { props, id } = item;
          const { component: Component } = assets[id];
          return (
            <span key={id}>
              <Component {...props} />
            </span>
          );
        })}
      </Space>
    </div>
  );
};

export default OperatorBar;
