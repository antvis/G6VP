import { useContext } from '@alipay/graphinsight';
import * as React from 'react';
import './index.less';

export interface LoadingProps {
  img?: string;
  text?: string;
  width: number;
}

const Loading: React.FunctionComponent<LoadingProps> = props => {
  const context = useContext();
  const {
    width = 200,
    img = 'https://gw.alipayobjects.com/zos/bmw-prod/db278704-6158-432e-99d2-cc5db457585d.svg',
    text,
  } = props;

  const { data } = context;
  const hasNodes = data && data.nodes && data.nodes.length !== 0;

  if (!hasNodes) {
    return (
      <div className="gi-placeholader">
        {img && <img src={img} width={width} />}
        {text}
      </div>
    );
  }
  return null;
};

export default Loading;
