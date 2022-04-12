import React, { useState } from 'react';
import { Select } from 'antd';
import { GraphinData } from '@antv/graphin';
import { useContext } from '@alipay/graphinsight';
import { IFilterCriteria } from './type';

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
  const [filterField, setFilterField] = useState();

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
        id,
        elementType,
        prop,
        analyzerType,
        selectOptions,
      });
    }
  };

  const onValueSelectChange = value => {
    const id = filterCriter.id as string;
    const isFilterReady = value.length !== 0;
    console.log('value', value)
    updateFilterCriteria(id, {
      ...filterCriter,
      isFilterReady,
      selectValue: value,
    });
  };

  return (
    <div key={filterCriter.id}>
      <div>
        <Select style={{ width: '200px' }} onChange={onSelectChange}>
          <Select.OptGroup key="node" label="节点">
            {Object.keys(nodeProperties).map(prop => (
              <Select.Option value={`node-${prop}`}>{prop}</Select.Option>
            ))}
          </Select.OptGroup>
          <Select.OptGroup key="edge" label="边">
            {Object.keys(edgeProperties).map(prop => (
              <Select.Option value={`edge-${prop}`}>{prop}</Select.Option>
            ))}
          </Select.OptGroup>
        </Select>
      </div>
      <div>
        {filterCriter.analyzerType == 'SELECT' && (
          <Select style={{ width: '200px' }} onChange={onValueSelectChange} mode="tags" placeholder="选择筛选值" options={filterCriter.selectOptions} value={filterCriter.selectValue}>
          </Select>
        )}
      </div>
    </div>
  );
};

export default FilterSelection;
