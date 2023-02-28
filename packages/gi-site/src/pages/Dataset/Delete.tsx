import * as React from 'react';
import { Button } from 'antd';
import { deleteDataset, queryRecycleDatasetList } from '../../services/dataset';
import DatasetTable from './Table';
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
    <div
      style={{
        height: '-webkit-fill-available',
        backgroundColor: 'var(--background-color)',
        borderRadius: '8px',
        padding: '16px',
      }}
    >
      <DatasetTable data={lists} queryData={refreshDataset} deletable={false} recoverable={true} />
      {lists?.length ? (
        <Button onClick={handleClear} style={{ position: 'absolute', marginTop: '-50px' }}>
          清空回收站
        </Button>
      ) : (
        ''
      )}
    </div>
  );
};

export default Datasets;
