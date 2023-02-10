import * as React from 'react';

interface DatasetsProps {}

const Datasets: React.FunctionComponent<DatasetsProps> = props => {
  const { children } = props;
  console.log('props', props);
  const data = [
    {
      name: '银行数据案例',
      id: 'ds-bank-xxx',
      owner: '山果',
      engineId: 'GraphScope',
      size: 'G(100,20)',
    },
  ];
  return <div>hello</div>;
};

export default Datasets;
