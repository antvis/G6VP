import { DeleteOutlined, FireTwoTone } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { ColumnChart } from './Charts';
import { IFilterCriteria } from './type';

import './index.less';

interface RecommendFilterProps {
  filterCriteria: IFilterCriteria;
  updateFilterCriteria: (id: string, filterCriteria: IFilterCriteria) => void;
  removeFilterCriteria: (id: string) => void;
}

const RecommendFilter: React.FC<RecommendFilterProps> = props => {
  const { filterCriteria, updateFilterCriteria, removeFilterCriteria } = props;

  const { hasOutlier } = filterCriteria;
  return (
    <div key={filterCriteria.id} className="gi-filter-panel-group">
      <div className="gi-filter-panel-prop">
        <h3>
          <FireTwoTone twoToneColor="#eb2f96" />
          <span style={{ marginLeft: '4px' }}>{filterCriteria.elementType === 'node' ? '节点' : '边'}属性：</span>
          <span>{filterCriteria.prop}</span>
        </h3>
        <Button onClick={() => removeFilterCriteria(filterCriteria.id!)} type="text" style={{ padding: '4px' }}>
          <DeleteOutlined className="gi-filter-panel-delete" />
        </Button>
      </div>
      <div className="gi-filter-panel-recommend-tip">
        {hasOutlier
          ? '该属性大多值具有相同的出现次数，但有些值有出现次数大于平均出现次数（红色），值得关注'
          : '该属性的某些值出现概率极低（红色），很可能含有更大信息量，值得关注'}
      </div>
      <div className="gi-filter-panel-value" id={`${filterCriteria.id}-chart-container`}>
        <ColumnChart filterCriteria={filterCriteria} updateFilterCriteria={updateFilterCriteria} highlightRank={5} />
      </div>
    </div>
  );
};

export default RecommendFilter;
