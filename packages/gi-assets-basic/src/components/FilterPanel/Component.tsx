import { useContext, utils } from '@alipay/graphinsight';
import { PlusOutlined } from '@ant-design/icons';
import { GraphinData } from '@antv/graphin';
import { Button } from 'antd';
import { nanoid } from 'nanoid';
import React, { useEffect, useMemo, useState } from 'react';
import FilterSelection from './FilterSelection';
import './index.less';
import { IFilterCriteria } from './type';
import { filterGraphData, highlightSubGraph } from './utils';

const { generatorSchemaByGraphData, isStyles } = utils;

export interface FilterPanelProps {
  histogramColor: string;
  isFilterIsolatedNodes: boolean;
  highlightMode?: boolean;
}

const FilterPanel: React.FunctionComponent<FilterPanelProps> = props => {
  const { histogramColor, isFilterIsolatedNodes, highlightMode } = props;
  const [filterOptions, setFilterOptions] = useState<{ [id: string]: IFilterCriteria }>({});
  const { source, updateContext, transform, schemaData, graph } = useContext();
  const dataSchemas = schemaData; // useMemo(() => generatorSchemaByGraphData(source), [source]);

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
    // delete filterOptions[id];
    // setFilterOptions({ ...filterOptions });

    setFilterOptions(preState => {
      const newFilterOptions = {};
      for (let key in preState) {
        if (key !== id) {
          newFilterOptions[key] = preState[key];
        }
      }

      return newFilterOptions;
    });
  };

  useEffect(() => {
    let data: GraphinData = source;
    Object.values(filterOptions).map(filterCriteria => {
      data = filterGraphData(data, filterCriteria, isFilterIsolatedNodes);
    });

    if (highlightMode) {
      highlightSubGraph(graph, data);
      return;
    }

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
