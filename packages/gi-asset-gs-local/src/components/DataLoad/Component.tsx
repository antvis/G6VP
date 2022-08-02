import { extra, useContext } from '@alipay/graphinsight';
import * as React from 'react';
import { Drawer, Button } from 'antd';
import ContainerHeader from '../../components-ui/ContainerHeader';
import GraphScopeDataLoad from '../../services/ServerComponent';
const { GIAComponent, deepClone } = extra;

export interface ClusterManageProps {}

const DataLoadPanel: React.FunctionComponent<ClusterManageProps> = props => {
  const context = useContext();
  const [state, setState] = React.useState({
    visible: false,
  });

  const handleShowDrawer = () => {
    setState({
      ...state,
      visible: true,
    });
  };

  const onClose = () => {
    setState({
      ...state,
      visible: false,
    });
  };
  return (
    <div>
      <ContainerHeader title="数据导入" />
      <Button onClick={handleShowDrawer}>数据导入</Button>
      <Drawer title="数据导入" placement="right" onClose={onClose} visible={state.visible} width={1000}>
        <GraphScopeDataLoad onClose={onClose} />
      </Drawer>
    </div>
  );
};

export default DataLoadPanel;
