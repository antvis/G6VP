import { Segmented } from 'antd';
import * as React from 'react';

import { IState } from './typing';
import $i18n from '../../i18n';

export const options = [
  {
    value: 'All-Path',
    label: $i18n.get({ id: 'basic.components.PathAnalysis.SegmentFilter.AllPaths', dm: '全部路径' }),
    disabled: true,
  },
  {
    value: 'Shortest-Path',
    label: $i18n.get({ id: 'basic.components.PathAnalysis.SegmentFilter.ShortestPath', dm: '最短路径' }),
  },
];

const SegmentFilter: React.FunctionComponent = () => {
  return (
    <div>
      <Segmented options={options} value={options[1].value} />
    </div>
  );
};

export default SegmentFilter;
