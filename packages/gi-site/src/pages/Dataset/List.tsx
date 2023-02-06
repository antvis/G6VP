import * as React from 'react';
import { queryDatasetList } from '../../services/dataset';
import DatasetTable from './Table';
interface DatasetsProps {}

const Datasets: React.FunctionComponent<DatasetsProps> = props => {
  const [state, setState] = React.useState({
    lists: [],
  });
  React.useEffect(() => {
    (async () => {
      const res = await queryDatasetList();
      console.log('res', res);
      setState({
        lists: res,
      });
    })();
  }, []);
  const { lists } = state;
  return (
    <div>
      <DatasetTable data={lists} />
    </div>
  );
};

export default Datasets;
