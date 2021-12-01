import { Space } from 'antd';
import * as React from 'react';
import { getPositionStyles } from '../utils';
import './index.less';
import WrapContainer from './WrapContainer';
export interface OperatorBarProps {}

const getComponents = (components, assets) => {
  return components
    .sort((a, b) => a.props?.GI_CONTAINER_INDEX - b.props?.GI_CONTAINER_INDEX)
    .map(item => {
      if (!item) {
        return null;
      }
      const { props: itemProps, id: itemId } = item;
      const { component: Component } = assets[itemId];
      let WrapComponent = Component;
      if (itemProps.GI_CONTAINER_ITEM) {
        WrapComponent = WrapContainer(Component);
      }
      return (
        <div key={itemId}>
          <WrapComponent {...itemProps} />
        </div>
      );
    });
};

const OperatorHeader: React.FunctionComponent<OperatorBarProps> = props => {
  //@ts-ignore
  const { components, assets, rightContainer, leftContainer, centerContainer, offset, placement, height, width } =
    props;

  const rightComponents: any[] = [];
  const leftComponents: any[] = [];
  const centerComponents: any[] = [];
  components.forEach((item: any) => {
    if (rightContainer.indexOf(item.id) !== -1) {
      rightComponents.push(item);
    }
    if (leftContainer.indexOf(item.id) !== -1) {
      leftComponents.push(item);
    }
    if (centerContainer.indexOf(item.id) !== -1) {
      centerComponents.push(item);
    }
  });

  const CENTER_COMPONENTS = getComponents(centerComponents, assets);
  const LEFT_COMPONENTS = getComponents(leftComponents, assets);
  const RIGHT_COMPONENTS = getComponents(rightComponents, assets);

  const postionStyles = getPositionStyles(placement, offset);

  return (
    <div className="gi-operator-header" style={{ height, width, ...postionStyles }}>
      <div className="gi-operator-header-left">
        <Space align="center" style={{ height }}>
          {LEFT_COMPONENTS}
        </Space>
      </div>
      <div className="gi-operator-header-center">
        <Space align="center" style={{ height }}>
          {CENTER_COMPONENTS}
        </Space>
      </div>
      <div className="gi-operator-header-right">
        <Space align="center" style={{ height }}>
          {RIGHT_COMPONENTS}
        </Space>
      </div>
    </div>
  );
};

export default OperatorHeader;
