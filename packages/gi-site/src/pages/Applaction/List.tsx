import * as React from 'react';

interface ApplactionListProps {}

const ApplactionList: React.FunctionComponent<ApplactionListProps> = props => {
  React.useEffect(() => {
    fetch('https://unpkg.com/@antv/gi-public-data/app/index.json')
      .then(res => res.json())
      .then(res => {
        console.log('res', res);
      });
  }, []);
  return <div></div>;
};

export default ApplactionList;
