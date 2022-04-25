import { useContext, utils } from '@alipay/graphinsight';
import { PlusOutlined } from '@ant-design/icons';
import { GraphinData } from '@antv/graphin';
import { Button } from 'antd';
import { nanoid } from 'nanoid';
import React, { useEffect, useMemo, useState } from 'react';
import FilterSelection from './FilterSelection';
import './index.less';
import { IFilterCriteria } from './type';
import { filterGraphData } from './utils';

const { generatorSchemaByGraphData, isStyles } = utils;

export interface FilterPanelProps {
  histogramColor: string;
  isFilterIsolatedNodes: boolean;
}

const FilterPanel: React.FunctionComponent<FilterPanelProps> = props => {
  const { histogramColor, isFilterIsolatedNodes } = props;
  const [filterOptions, setFilterOptions] = useState<{ [id: string]: IFilterCriteria }>({});
  const { source, updateContext, transform, schemaData } = useContext();
  const dataSchemas = useMemo(() => generatorSchemaByGraphData(source), [source]);

  const nodeProperties = useMemo(() => {
    return dataSchemas.nodes.reduce((acc, cur) => {
      return {
        ...acc,
        ...cur.properties,
      };
    }, {});
  }, [dataSchemas]);

  const edgeProperties = useMemo(() => {
    return dataSchemas.edges.reduce((acc, cur) => {
      return {
        ...acc,
        ...cur.properties,
      };
    }, {});
  }, [dataSchemas]);

  const addFilter = () => {
    const id = nanoid();
    const filterCriteria = {
      id,
      isFilterReady: false,
    };

    setFilterOptions(preState => {
      return {
        ...preState,
        [id]: filterCriteria,
      };
    });
  };

  const updateFilterCriteria = (id: string, filterCriteria: IFilterCriteria) => {
    setFilterOptions(preState => {
      return {
        ...preState,
        [id]: filterCriteria,
      };
    });
  };

  const removeFilterCriteria = (id: string) => {
    delete filterOptions[id];
    setFilterOptions({ ...filterOptions });
  };

  useEffect(() => {
    let data: GraphinData = source;
    Object.values(filterOptions).map(filterCriteria => {
      data = filterGraphData(data, filterCriteria, isFilterIsolatedNodes);
    });
    updateContext(draft => {
      if (isStyles(source.nodes)) {
        draft.data = data;
      } else {
        draft.data = transform(data);
      }
      draft.layoutCache = true;
    });
  }, [filterOptions]);

  return (
    <div className="gi-filter-panel">
      <Button type="primary" style={{ width: '100%', borderRadius: '4px' }} onClick={addFilter} icon={<PlusOutlined />}>
        增加筛选器
      </Button>
      <div className="gi-filter-panel-criteria-container">
        {Object.values(filterOptions).map(filterCriter => {
          return (
            <FilterSelection
              filterCriter={filterCriter}
              nodeProperties={nodeProperties}
              edgeProperties={edgeProperties}
              updateFilterCriteria={updateFilterCriteria}
              removeFilterCriteria={removeFilterCriteria}
              histogramColor={histogramColor}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FilterPanel;
