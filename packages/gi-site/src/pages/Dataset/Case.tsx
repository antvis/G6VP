import { DeploymentUnitOutlined, EnvironmentOutlined } from '@ant-design/icons';
import * as React from 'react';
import SegmentedTabs from '../../components/SegmentedTabs';
import * as DatasetServices from '../../services/dataset';
import DatasetTable from './Table';
import $i18n from '../../i18n';
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
            label: $i18n.get({ id: 'gi-site.pages.Dataset.Case.RelationalData', dm: '关系数据' }),
            children: <DatasetTable data={lists} deletable={false} />,
          },
          // {
          //   key: 'geo',
          //   icon: <EnvironmentOutlined />,
          //   label: $i18n.get({ id: 'gi-site.pages.Dataset.Case.GeographicData', dm: '地理数据' }),
          //   children: <>{$i18n.get({ id: 'gi-site.pages.Dataset.Case.UnderConstruction', dm: '正在建设中...' })}</>,
          // },
        ]}
      />
    </>
  );
};

export default Cases;
