import * as React from 'react';
import * as TempalteServices from '../../services/template';
import { ITemplate } from '../../services/typing';
import TempalteList from './Table';
interface DatasetsProps {}

const List: React.FunctionComponent<DatasetsProps> = props => {
  const [state, setState] = React.useState<{ lists: ITemplate[] }>({
    lists: [],
  });
  React.useEffect(() => {
    (async () => {
      const res = await TempalteServices.list();
      console.log('ITemplate res', res);
      setState({
        lists: res,
      });
    })();
  }, []);
  const { lists } = state;
  return (
    <div>
      <TempalteList data={lists} />
    </div>
  );
};

export default List;
