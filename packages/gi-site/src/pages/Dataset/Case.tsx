import { DeploymentUnitOutlined, EnvironmentOutlined } from '@ant-design/icons';
import * as React from 'react';
import SegmentedTabs from '../../components/SegmentedTabs';
import * as DatasetServices from '../../services/dataset';
import DatasetTable from './Table';
interface CasesProps {}

const Cases: React.FunctionComponent<CasesProps> = props => {
  const [state, setState] = React.useState({
    lists: [],
  });
  React.useEffect(() => {
    (async () => {
      const res = await DatasetServices.findCase();
      console.log('res', res);
      setState({
        lists: res,
      });
    })();
  }, []);
  const { lists } = state;
  return (
    <>
      <SegmentedTabs
        defaultActive="graph"
        items={[
          {
            key: 'graph',
            icon: <DeploymentUnitOutlined />,
            label: '关系数据',
            children: <DatasetTable data={lists} deletable={false} />,
          },
          {
            key: 'geo',
            icon: <EnvironmentOutlined />,
            label: '地理数据',
            children: <>正在建设中...</>,
          },
        ]}
      />
    </>
  );
};

export default Cases;
