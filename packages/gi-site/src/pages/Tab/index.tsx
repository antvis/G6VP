import * as React from 'react';
import TableMode from './TableMode/index';
interface TabContainerProps {
  match: any;
}

const TabContainer: React.FunctionComponent<TabContainerProps> = props => {
  const { match } = props;
  const { type } = match.params;

  return <div style={{ height: '100vh', width: '100vw' }}>{type === 'table' && <TableMode />}</div>;
};

export default TabContainer;
