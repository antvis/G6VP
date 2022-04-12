import React, { useState, useEffect } from 'react';
import { Drawer, Button, Select } from 'antd';
import { GraphinData } from '@antv/graphin';
import { nanoid } from 'nanoid';
import { useContext } from '@alipay/graphinsight';
import { generatorSchemaByGraphData } from '@alipay/graphinsight/es/utils';
import {filterGraphData} from './utils'
import FilterSelection from './FilterSelection';
import { IFilterCriteria } from './type';

export interface FilterPanelProps {
  visible: boolean;
}

const FilterPanel: React.FunctionComponent<FilterPanelProps> = props => {
  const { visible } = props;
  const [filterOptions, setFilterOptions] = useState<{ [id: string]: IFilterCriteria }>({});
  const { source, updateContext, graph } = useContext();
  const dataSchemas = generatorSchemaByGraphData(source);

  const nodeProperties = dataSchemas.nodes.reduce((acc, cur) => {
    return {
      ...acc,
      ...cur.properties,
    };
  }, {});

  const edgeProperties = dataSchemas.edges.reduce((acc, cur) => {
    return {
      ...acc,
      ...cur.properties,
    };
  }, {});

  const addFilter = () => {
    const id = nanoid();
    const filterCriteria = {
      id,
      isFilterReady: false,
    };

    setFilterOptions({
      ...filterOptions,
      [id]: filterCriteria,
    });
  };

  const updateFilterCriteria = (id: string, filterCriteria: IFilterCriteria) => {
    setFilterOptions({
      ...filterOptions,
      [id]: filterCriteria,
    });
  };

  const removeFilterCriteria = (id: string) => {
    delete filterOptions[id];
    setFilterOptions({ ...filterOptions });
  };


  
  useEffect(() => {
    console.log(filterOptions, 'filterOptions')
    let data:GraphinData = source;
    Object.values(filterOptions).map(filterCriteria => {
      data = filterGraphData(data, filterCriteria, graph);
    })
    updateContext(draft => {
      draft.data = data;
    })
  }, [filterOptions])


  return (
    <Drawer
      placement="right"
      visible={visible}
      title="筛选面板"
      width="356px"
      style={{
        marginTop: '61px',
      }}
      mask={false}
      bodyStyle={{
        padding: '12px 24px',
      }}
    >
      <Button style={{ width: '100%' }} onClick={addFilter}>
        增加筛选器
      </Button>
      {Object.values(filterOptions).map(filterCriter => {
        return (
          <FilterSelection
            filterCriter={filterCriter}
            nodeProperties={nodeProperties}
            edgeProperties={edgeProperties}
            updateFilterCriteria={updateFilterCriteria}
            removeFilterCriteria={removeFilterCriteria}
          />
        );
      })}
    </Drawer>
  );
};

export default FilterPanel;
