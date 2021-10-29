import * as React from 'react';
import { Modal, Tabs } from 'antd';
import './index.less';

interface uploadPanel {
  visible: boolean;
}

const { TabPane } = Tabs;
const UploadPanel: React.FunctionComponent<uploadPanel> = props => {
  const { visible } = props;
  return (
    <Modal title="导入数据" visible={visible}>
      <Tabs defaultActiveKey="document">
        <TabPane tab="文件" key="document">
          Content of Tab Pane 1
        </TabPane>
        <TabPane tab="OpenAPI" key="OpenAPI"></TabPane>
      </Tabs>
    </Modal>
  );
};

export default UploadPanel;
