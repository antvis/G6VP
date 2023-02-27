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
    <div style={{ height: '-webkit-fill-available', backgroundColor: 'var(--background-color)', borderRadius: '8px' }}>
      <DatasetTable data={lists} />
    </div>
  );
};

export default Datasets;
