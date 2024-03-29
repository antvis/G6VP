import * as React from 'react';
import * as TempalteServices from '../../services/template';
import { ITemplate } from '../../services/typing';
// import TempalteList from './Table';
import Cards from './Cards';
interface DatasetsProps {
  type: 'my' | 'graph';
}

const List: React.FunctionComponent<DatasetsProps> = props => {
  const [state, setState] = React.useState<{ lists: ITemplate[] }>({
    lists: [],
  });
  const { type } = props;
  React.useEffect(() => {
    (async () => {
      const server = type === 'my' ? TempalteServices.list : TempalteServices.listInner;
      const res = await server();
      setState({
        lists: res,
      });
    })();
  }, []);
  const { lists } = state;
  return (
    <div>
      {/* <TempalteList data={lists} /> */}
      <Cards data={lists} />
    </div>
  );
};

export default List;
