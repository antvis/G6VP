import { GIAssets, GIComponentConfig } from '@alipay/graphinsight';
import { Tabs } from 'antd';
import * as React from 'react';
import ReactDOM from 'react-dom';
import CollapseContainer from './CollapseContainer';
import './index.less';
import type { ContainerProps } from './typing';
const { TabPane } = Tabs;

export interface OperatorBarProps extends ContainerProps {
  GI_CONTAINER: string[];
  components: GIComponentConfig[];
  assets: GIAssets;
  tabPosition: 'left' | 'right' | 'top' | 'bottom';
  /**
   * 是否在画布的外围
   */
  outSideFromCanvas: boolean;
  flexDirection: 'row' | 'column';
  GISDK_ID: string;
}

const SideTabs: React.FunctionComponent<OperatorBarProps> = props => {
  const {
    components,
    assets,
    placement,
    offset,
    width,
    height,
    defaultVisible,
    outSideFromCanvas,
    GISDK_ID,
    flexDirection,
  } = props;

  const sortedComponents = components
    //@ts-ignore
    .sort((a, b) => a.props.GI_CONTAINER_INDEX - b.props.GI_CONTAINER_INDEX)
    .filter(item => item.props?.GIAC_CONTENT);

  const content = React.useMemo(() => {
    return sortedComponents.map((item, index) => {
      if (!item) {
        return null;
      }
      const { props: itemProps, id: itemId } = item;
      const { component: Component } = assets[itemId];
      return (
        <TabPane key={index} tab={itemProps.GIAC_CONTENT.title}>
          <Component {...itemProps} />
        </TabPane>
      );
    });
  }, [sortedComponents]);

  React.useEffect(() => {
    const container = document.getElementById(`${GISDK_ID}-container`);
    if (outSideFromCanvas && container) {
      container.style.display = 'flex';
      container.style.flexDirection = flexDirection;
    } else if (container) {
      container.style.display = 'block';
    }
  }, [outSideFromCanvas, flexDirection]);

  console.log('sortedComponents', sortedComponents, GISDK_ID);

  if (!outSideFromCanvas) {
    return (
      <CollapseContainer
        width={width}
        height={height}
        defaultVisible={defaultVisible}
        placement={placement}
        offset={offset}
      >
        <Tabs defaultActiveKey="1">{content}</Tabs>
      </CollapseContainer>
    );
  }
  return ReactDOM.createPortal(
    <Tabs defaultActiveKey="1">{content}</Tabs>,
    document.getElementById(`${GISDK_ID}-container-extra`) as HTMLElement,
  );
};

export default SideTabs;
