import { useContext } from '@antv/gi-sdk';
import { Spin } from 'antd';
import React, { memo } from 'react';
import './index.less';

export interface LoadingProps {}

const Loading: React.FunctionComponent<LoadingProps> = props => {
  const context = useContext();

  const { isLoading } = context;

  if (isLoading) {
    return (
      <div className="gi-loading">
        <Spin />
      </div>
    );
  }
  return null;
};

export default memo(Loading);
