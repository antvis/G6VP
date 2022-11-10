import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { GIComponentAssets, GIComponentConfig } from '@antv/gi-sdk';
import { Button, Tabs, Tooltip } from 'antd';
import * as React from 'react';
import ReactDOM from 'react-dom';
import CollapseContainer from './CollapseContainer';
import './index.less';
import SideContainer from './SideContainer';
import type { ContainerProps } from './typing';
import WrapTab from './WrapTab';
const { TabPane } = Tabs;

export interface SideTabsProps extends ContainerProps {
  GI_CONTAINER: string[];
  components: GIComponentConfig[];
  assets: GIComponentAssets;
  tabPosition: 'left' | 'right' | 'top' | 'bottom';
  /**
   * 是否在画布的外围
   */
  outSideFromCanvas: boolean;
  flexDirection: 'row' | 'column';
  GISDK_ID: string;
}

const SideTabs: React.FunctionComponent<SideTabsProps> = props => {
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
    tabPosition,
  } = props;

  // 独立 DOM 状态下是否可见
  const [visible, setVisible] = React.useState<boolean>(true);

  const sortedComponents = React.useMemo(() => {
    return (
      components
        //@ts-ignore
        .sort((a, b) => a.props.GI_CONTAINER_INDEX - b.props.GI_CONTAINER_INDEX)
        .filter(item => item && item.props && item.props.GIAC_CONTENT)
    );
  }, [components]);

  const panes = React.useMemo(() => {
    return sortedComponents.map((item, index) => {
      if (!item) {
        console.warn(`config not found, index: ${index}`);
        return null;
      }
      const { props: itemProps, id: itemId } = item;
      const asset = assets[itemId];
      if (!asset) {
        console.warn(`asset: ${itemId} not found`);
        return null;
      }

      const { component: Component } = asset;
      return (
        <TabPane key={index} tab={<WrapTab {...itemProps} />}>
          <Component {...itemProps} />
        </TabPane>
      );
    });
  }, [sortedComponents]);

  const toggleVisible = () => {
    setVisible(preState => !preState);
  };

  const tabBarExtraContent = (
    <Tooltip placement="right" title="可展开收起导航栏">
      <Button type="text" icon={visible ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />} onClick={toggleVisible} />
    </Tooltip>
  );

  const Content = (
    <div className="gi-side-tabs">
      <Tabs tabPosition={tabPosition} tabBarExtraContent={outSideFromCanvas ? tabBarExtraContent : null}>
        {panes}
      </Tabs>
    </div>
  );

  if (!outSideFromCanvas) {
    return (
      <CollapseContainer
        width={width}
        height={height}
        defaultVisible={defaultVisible}
        placement={placement}
        offset={offset}
      >
        {Content}
      </CollapseContainer>
    );
  }
  return ReactDOM.createPortal(
    <SideContainer
      visible={visible}
      width={width}
      height={height}
      defaultVisible={defaultVisible}
      placement={placement}
      GISDK_ID={GISDK_ID}
      outSideFromCanvas={outSideFromCanvas}
    >
      {Content}
    </SideContainer>,
    document.getElementById(`${GISDK_ID}-container`) as HTMLElement,
  );
};

export default SideTabs;
