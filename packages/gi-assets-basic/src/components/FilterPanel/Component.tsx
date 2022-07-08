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
  isFilterIsolatedNodes: boolean;
  highlightMode?: boolean;
  filterLogic: 'and' | 'or';
  filterKeys: string[];
}

const FilterPanel: React.FunctionComponent<FilterPanelProps> = props => {
  const { isFilterIsolatedNodes, highlightMode, filterLogic, filterKeys } = props;
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

  const addFilter = (defaultKey?: string) => {
    const id = nanoid();
    const filterCriteria = {
      id,
      defaultKey,
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
    // 初始化时需要展示的筛选器
    const initialFilterOptions = filterKeys
      .map(defaultKey => {
        const id = nanoid();
        const filterCriteria = {
          id,
          defaultKey,
          isFilterReady: false,
        };
        return filterCriteria;
      })
      .reduce((acc, cur) => {
        acc[cur.id] = cur;
        return acc;
      }, {});

    setFilterOptions(initialFilterOptions);
  }, [filterKeys]);

  useEffect(() => {
    let data: GraphinData = source;
    // 多个筛选器的筛选逻辑为 ”与“
    if (filterLogic === 'and') {
      Object.values(filterOptions).map(filterCriteria => {
        data = filterGraphData(data, filterCriteria, isFilterIsolatedNodes);
      });
      // 多个筛选器间的筛选逻辑为 ”或“
    } else {
      data = {
        nodes: [],
        edges: [],
      };
      Object.values(filterOptions).map(filterCriteria => {
        const filterData = filterGraphData(source, filterCriteria, isFilterIsolatedNodes);
        data.nodes = [...data.nodes, ...filterData.nodes];
        data.edges = [...data.edges, ...filterData.edges];
      });

      // 去重
      data.nodes = utils.uniqueElementsBy(data.nodes, (n1, n2) => n1.id === n2.id);
      data.edges = utils.uniqueElementsBy(data.edges, (e1, e2) => e1.id === e2.id);
    }

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
      <Button
        type="primary"
        style={{ width: '100%', borderRadius: '4px' }}
        onClick={() => addFilter()}
        icon={<PlusOutlined />}
      >
        增加筛选器
      </Button>
      <div className="gi-filter-panel-criteria-container">
        {Object.values(filterOptions).map(filterCriteria => {
          return (
            <FilterSelection
              source={source}
              filterCriteria={filterCriteria}
              nodeProperties={nodeProperties}
              edgeProperties={edgeProperties}
              updateFilterCriteria={updateFilterCriteria}
              removeFilterCriteria={removeFilterCriteria}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FilterPanel;
