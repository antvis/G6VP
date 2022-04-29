import { Space } from 'antd';
import * as React from 'react';
import { getPositionStyles } from '../utils';
import './index.less';
import WrapContainer from './WrapContainer';

export interface OperatorBarProps {}

const getComponents = (components, assets, GISDK_ID) => {
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
        WrapComponent = WrapContainer(Component, itemId, GISDK_ID);
      }
      return (
        <div key={itemId}>
          <WrapComponent GISDK_ID={GISDK_ID} {...itemProps} />
        </div>
      );
    })
    .filter(item => {
      return item !== null;
    });
};

const OperatorHeader: React.FunctionComponent<OperatorBarProps> = props => {
  const {
    components,
    rightContainer,
    leftContainer,
    centerContainer,
    offset,
    placement,
    height,
    width,
    gap,
    GISDK_ID,
  } = props as any;
  //@ts-ignore
  const { assets, ...otherProps } = props;
  const deps = JSON.stringify(otherProps);
  const { CENTER_COMPONENTS, LEFT_COMPONENTS, RIGHT_COMPONENTS } = React.useMemo(() => {
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

    const CENTER_COMPONENTS = getComponents(centerComponents, assets, GISDK_ID);
    const LEFT_COMPONENTS = getComponents(leftComponents, assets, GISDK_ID);
    const RIGHT_COMPONENTS = getComponents(rightComponents, assets, GISDK_ID);

    return {
      CENTER_COMPONENTS,
      RIGHT_COMPONENTS,
      LEFT_COMPONENTS,
    };
  }, [deps]);

  const postionStyles = getPositionStyles(placement, offset);

  return (
    <div className="gi-operator-header" style={{ height, width, ...postionStyles }}>
      <div className="gi-operator-header-left">
        <Space align="center" style={{ height, gap }}>
          {LEFT_COMPONENTS}
        </Space>
      </div>
      <div className="gi-operator-header-center">
        <Space align="center" style={{ height, gap }}>
          {CENTER_COMPONENTS}
        </Space>
      </div>
      <div className="gi-operator-header-right">
        <Space align="center" style={{ height, gap }}>
          {RIGHT_COMPONENTS}
        </Space>
      </div>
    </div>
  );
};
export default OperatorHeader;

// export default React.memo(OperatorHeader, (preProps: any, nextProps: any) => {
//   const { assets: preAssets, ...otherPreProps } = preProps;
//   const { assets: nextAssets, ...otherNextProps } = nextProps;
//   const isEqual = JSON.stringify(otherPreProps) == JSON.stringify(otherNextProps);

//   if (isEqual) {
//     return true;
//   }
//   return false;
// });
