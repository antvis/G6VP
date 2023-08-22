import { Segmented } from 'antd';
import * as React from 'react';

import { IState } from './typing';
interface SegementFilterProps {
  state: IState;
  updateState: any;
}

export const options = [
  {
    value: 'All-Path',
    label: '全部路径',
    disabled: true,
  },
  {
    value: 'Shortest-Path',
    label: '最短路径',
  },
];

const SegementFilter: React.FunctionComponent<SegementFilterProps> = props => {
  return (
    <div>
      <Segmented options={options} value={options[1].value} />
    </div>
  );
};

export default SegementFilter;
