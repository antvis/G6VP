import React, { useState } from 'react';
import { Button, Select } from 'antd';
import { DeleteOutlined, NumberOutlined, FieldStringOutlined } from '@ant-design/icons';
import { GraphinData } from '@antv/graphin';
import { Filter as BrushFilter } from 'motif-gi';
import { useContext } from '@alipay/graphinsight';
import { IFilterCriteria } from './type';
import './index.less';

const iconMap = {
  boolean: <FieldStringOutlined style={{ color: 'rgb(39, 110, 241)', marginRight: '4px' }} />,
  string: <FieldStringOutlined style={{ color: 'rgb(39, 110, 241)', marginRight: '4px' }} />,
  number: <NumberOutlined style={{ color: 'rgb(255, 192, 67)', marginRight: '4px' }} />,
};

interface FilterSelectionProps {
  filterCriter: IFilterCriteria;
  updateFilterCriteria: (id: string, filterCriteria: IFilterCriteria) => void;
  removeFilterCriteria: (id: string) => void;
  nodeProperties: Object;
  edgeProperties: Object;
}

const FilterSelection: React.FC<FilterSelectionProps> = props => {
  const { filterCriter, nodeProperties, edgeProperties, updateFilterCriteria, removeFilterCriteria } = props;
  const { source } = useContext();

  const getSelectOptions = (
    graphData: GraphinData,
    type: 'boolean' | 'string',
    prop: string,
    elementType: 'node' | 'edge',
  ) => {
    if (type === 'boolean') {
      return [
        {
          value: true,
          label: '是',
        },
        {
          value: false,
          label: '否',
        },
      ];
    }
    const elements = elementType === 'node' ? graphData.nodes : graphData.edges;
    const optionSet = new Set<string>();
    elements?.forEach(e => {
      e.data && e.data[prop] && optionSet.add(e.data[prop]);
    });
    const options = [...optionSet].map(v => ({
      label: v,
      value: v,
    }));
    return options;
  };

  const getHistogram = (graphData: GraphinData, prop: string, elementType: 'node' | 'edge') => {
    const elements = elementType === 'node' ? graphData.nodes : graphData.edges;
    const valueMap = new Map<number, number>();
    let maxValue = -Infinity;
    let minValue = Infinity;
    elements.forEach(e => {
      const value = e.data && e.data[prop];
      if (value && typeof value === 'number') {
        valueMap.set(value, valueMap.has(value) ? valueMap.get(value)! + 1 : 1);
        maxValue = Math.max(value, maxValue);
        minValue = Math.min(value, minValue);
      }
    });

    const interval = (maxValue - minValue) / 50;
    const data = [...valueMap.entries()].map(e => {
      const [key, value] = e;
      const x0 = key - interval / 2;
      const x1 = key + interval / 2;
      return {
        count: value,
        x0: x0 >= minValue ? x0 : minValue,
        x1: x1 <= maxValue ? x1 : maxValue,
      };
    });
    return {
      data,
      domain: [minValue, maxValue],
      step: interval,
      dataType: 'NUMBER',
      format: '',
      color: '#3056E3',
    };
  };

  const onSelectChange = value => {
    const id = filterCriter.id as string;
    const elementType = value.slice(0, 4);
    const prop = value.slice(5);
    const elementProps = elementType === 'node' ? nodeProperties : edgeProperties;

    let analyzerType;
    if (elementProps[prop] === 'number') {
      analyzerType = 'BRUSH';
    } else if (elementProps[prop] === 'boolean' || elementProps[prop] === 'string') {
      analyzerType = 'SELECT';
    } else {
      analyzerType = 'NONE';
    }

    if (analyzerType == 'SELECT') {
      const selectOptions = getSelectOptions(source, elementProps[prop], prop, elementType);
      updateFilterCriteria(id, {
        ...filterCriter,
        elementType,
        prop,
        analyzerType,
        selectOptions,
      });
    } else if (analyzerType === 'BRUSH') {
      const histogram = getHistogram(source, prop, elementType);
      updateFilterCriteria(id, {
        ...filterCriter,
        analyzerType: 'BRUSH',
        isFilterReady: false,
        elementType,
        prop,
        histogram,
        range: histogram.domain,
      });
    }
  };

  const onValueSelectChange = value => {
    const id = filterCriter.id as string;
    const isFilterReady = value.length !== 0;
    updateFilterCriteria(id, {
      ...filterCriter,
      isFilterReady,
      selectValue: value,
    });
  };

  const onBrushChange = value => {
    const id = filterCriter.id as string;
    updateFilterCriteria(id, {
      ...filterCriter,
      isFilterReady: true,
      range: value,
    });
  };

  return (
    <div key={filterCriter.id} className="gi-filter-panel-group">
      <div className="gi-filter-panel-prop">
        <Select
          style={{ width: '80%' }}
          onChange={onSelectChange}
          className="gi-filter-panel-prop-select"
          placeholder="选择元素属性"
        >
          <Select.OptGroup key="node" label="节点">
            {Object.entries(nodeProperties).map(e => {
              const [key, value] = e;
              const icon = iconMap[value];
              return (
                <Select.Option value={`node-${key}`}>
                  {icon}
                  {key}
                </Select.Option>
              );
            })}
          </Select.OptGroup>
          <Select.OptGroup key="edge" label="边">
            {Object.entries(edgeProperties).map(e => {
              const [key, value] = e;
              const icon = iconMap[value];
              return (
                <Select.Option value={`edge-${key}`}>
                  {icon}
                  {key}
                </Select.Option>
              );
            })}
          </Select.OptGroup>
        </Select>
        <DeleteOutlined className="gi-filter-panel-delete" onClick={() => removeFilterCriteria(filterCriter.id!)} />
      </div>
      <div className="gi-filter-panel-value">
        {filterCriter.analyzerType == 'SELECT' && (
          <Select
            style={{ width: '100%' }}
            onChange={onValueSelectChange}
            mode="tags"
            placeholder="选择筛选值"
            options={filterCriter.selectOptions}
            value={filterCriter.selectValue}
          />
        )}
        {filterCriter.analyzerType === 'BRUSH' && (
          <BrushFilter
            value={filterCriter.range!}
            histogram={filterCriter.histogram!}
            onChangeRange={onBrushChange}
            /* BrushFilter 组件问题，设置不了百分比 */
            width={document.getElementsByClassName('gi-filter-panel-prop')[0].clientWidth}
          />
        )}
        {filterCriter.analyzerType === 'NONE' && <span>请选择合法字段</span>}
      </div>
    </div>
  );
};

export default FilterSelection;
