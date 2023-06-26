import { IssuesCloseOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import * as React from 'react';
import { deleteDataset, queryRecycleDatasetList } from '../../services/dataset';
import DatasetTable from './Table';
import $i18n from '../../i18n';
interface DatasetsProps {}

const Datasets: React.FunctionComponent<DatasetsProps> = props => {
  const [state, setState] = React.useState({
    lists: [],
  });
  const { lists } = state;
  const refreshDataset = () => {
    (async () => {
      const res = await queryRecycleDatasetList();
      setState({
        lists: res,
      });
    })();
  };
  const handleClear = () => {
    (async () => {
      const promise = lists.map((item: any) => deleteDataset(item.id));
      await Promise.all(promise).then(() => refreshDataset());
    })();
  };
  React.useEffect(refreshDataset, []);
  return (
    <Card
      style={{
        height: '-webkit-fill-available',
      }}
      bodyStyle={{
        paddingTop: '8px',
      }}
      title={
        <>
          <IssuesCloseOutlined />
          {$i18n.get({ id: 'gi-site.pages.Dataset.Delete.DataWillBeAutomaticallyCleared', dm: '七天后将自动清空数据' })}
        </>
      }
      extra={
        lists?.length ? (
          <Button onClick={handleClear}>
            {$i18n.get({ id: 'gi-site.pages.Dataset.Delete.ClearRecycleBin', dm: '清空回收站' })}
          </Button>
        ) : (
          ''
        )
      }
    >
      <DatasetTable data={lists} queryData={refreshDataset} deletable={false} recoverable={true} />
    </Card>
    // <div
    //   style={{
    //
    //     backgroundColor: 'var(--background-color)',
    //     borderRadius: '8px',
    //     padding: '16px',
    //   }}
    // >

    // </div>
  );
};

export default Datasets;
