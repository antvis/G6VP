import { Space, Tabs } from 'antd';
import * as React from 'react';
import './index.less';
const { TabPane } = Tabs;
export interface OperatorBarProps {}

const SideTabs: React.FunctionComponent<OperatorBarProps> = props => {
  //@ts-ignore
  const { components, assets } = props;
  const sortedComponents = components.sort((a, b) => a.props?.GI_CONTAINER_INDEX - b.props?.GI_CONTAINER_INDEX);

  return (
    <div className="gi-operator-bar-11" style={{ padding: '8px' }}>
      <Tabs defaultActiveKey="1">
        {sortedComponents.map((item, index) => {
          if (!item) {
            return null;
          }
          const { props: itemProps, id: itemId } = item;
          const { component: Component } = assets[itemId];

          return (
            <TabPane key={index} tab={itemProps.title}>
              <Component {...itemProps} />
            </TabPane>
          );
        })}
      </Tabs>

      <Space></Space>
    </div>
  );
};

export default SideTabs;
