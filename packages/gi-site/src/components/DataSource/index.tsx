import { Collapse, Tabs } from 'antd';
import * as React from 'react';
import GetGraph from './GetGraph';
import GetSubGraph from './GetSubGraph';
import './index.less';
import SourceCode from './SourceCode';

const { Panel } = Collapse;

const { TabPane } = Tabs;

interface DataSourceProps {
  handleClose: () => void;
}

const DataSource: React.FunctionComponent<DataSourceProps> = props => {
  const { handleClose } = props;
  return (
    <div>
      <Tabs tabPosition={'left'}>
        <TabPane tab="原始数据" key="source">
          <SourceCode handleClose={handleClose} />
        </TabPane>
        <TabPane tab="初始化接口" key="initial">
          <GetGraph handleClose={handleClose} />
        </TabPane>
        <TabPane tab="子图下钻接口" key="subgraph">
          <GetSubGraph handleClose={handleClose} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DataSource;
