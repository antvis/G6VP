import { Collapse, Tabs } from 'antd';
import * as React from 'react';
import './index.less';
import Sidebar from './Sidebar';

const { Panel } = Collapse;

const { TabPane } = Tabs;

interface DataSourceProps {
  handleClose: () => void;
}

const DataSource: React.FunctionComponent<DataSourceProps> = props => {
  const { handleClose } = props;
  return (
    <div>
      <Sidebar />
    </div>
  );
};

export default DataSource;
