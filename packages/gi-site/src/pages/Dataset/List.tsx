import * as React from 'react';
import { queryDatasetList } from '../../services/dataset';
import DatasetTable from './Table';
interface DatasetsProps {}

const Datasets: React.FunctionComponent<DatasetsProps> = props => {
  const [state, setState] = React.useState({
    lists: [],
  });
  const refreshDataset = () => {
    (async () => {
      const res = await queryDatasetList();
      setState({
        lists: res,
      });
    })();
  };
  React.useEffect(refreshDataset, []);
  const { lists } = state;
  return (
    <div
      style={{
        height: '-webkit-fill-available',
        backgroundColor: 'var(--background-color)',
        borderRadius: '8px',
        padding: '16px',
      }}
    >
      <DatasetTable data={lists} queryData={refreshDataset} />
    </div>
  );
};

export default Datasets;
