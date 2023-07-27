import * as React from 'react';

interface DetailProps {
  desc: string;
  app: string;
  cover: string;
  version: string;
  docs: string;
}

const Detail: React.FunctionComponent<DetailProps> = props => {
  const { desc } = props;
  return <div></div>;
};

export default Detail;
