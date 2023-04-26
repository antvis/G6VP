import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import React from 'react';

interface IAssetCollapseProps {
  defaultActiveKey;
  children?: any;
}

const { Panel } = Collapse;

const AssetCollapse: React.FC<IAssetCollapseProps & { Panel: any }> = props => {
  const { defaultActiveKey, children } = props;

  return (
    <Collapse
      {...props}
      bordered={false}
      defaultActiveKey={defaultActiveKey}
      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      className="site-collapse-custom-collapse"
    >
      {children}
    </Collapse>
  );
};

const AssetCollapsePanel = props => {
  const { key, header, children } = props;

  return (
    <Panel {...props} header={header} key={key} className="site-collapse-custom-panel">
      {children}
    </Panel>
  );
};

//@ts-ignore
AssetCollapse.Panel = AssetCollapsePanel;

export default AssetCollapse;
