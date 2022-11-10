import { PlusOutlined } from '@ant-design/icons';
import { useContext, utils } from '@antv/gi-sdk';
import { GraphinData } from '@antv/graphin';
import { Button } from 'antd';
import { nanoid } from 'nanoid';
import React, { useEffect, useMemo, useState } from 'react';
import FilterSelection from '../FilterPanel/FilterSelection';
import '../FilterPanel/index.less';
import { IFilterCriteria } from '../FilterPanel/type';
import { filterGraphData } from '../FilterPanel/utils';
import Interpretation from './Interpretation';

const { isStyles } = utils;

export interface FilterPanelProps {
  isFilterIsolatedNodes: boolean;
  highlightMode?: boolean;
  limit: number;
  filterLogic: 'and' | 'or';
}

const FilterPanel: React.FunctionComponent<FilterPanelProps> = props => {
  const { isFilterIsolatedNodes, limit, filterLogic } = props;
  const [filterOptions, setFilterOptions] = useState<{ [id: string]: IFilterCriteria }>({});
  const { updateContext, transform, schemaData, largeGraphData } = useContext();
  const dataSchemas = schemaData;

  const [state, setState] = React.useState({
    data: { nodes: [], edges: [] },
  });

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
    if (!largeGraphData) {
      return;
    }
    let data: GraphinData = largeGraphData as GraphinData;

    let canvasData;

    // 多个筛选器的筛选逻辑为 ”与“
    if (filterLogic === 'and') {
      Object.values(filterOptions).map(filterCriteria => {
        data = filterGraphData(data, filterCriteria, isFilterIsolatedNodes);
      });
      // 多个筛选器间的筛选逻辑为 ”或“
    } else {
      const graph_data = {
        nodes: [],
        edges: [],
      } as GraphinData;
      Object.values(filterOptions).map(filterCriteria => {
        const { isFilterReady, analyzerType } = filterCriteria;
        let filtered;
        if (!isFilterReady || analyzerType === 'NONE') {
          // 如果是「OR」的关系中，筛选不符合条件，返回的值都为空
          filtered = { nodes: [], edges: [] };
        } else {
          filtered = filterGraphData(largeGraphData, filterCriteria, isFilterIsolatedNodes);
        }
        graph_data.nodes = [...graph_data.nodes, ...filtered.nodes];
        graph_data.edges = [...graph_data.edges, ...filtered.edges];
      });

      data = {
        nodes: utils.uniqueElementsBy(graph_data.nodes, (n1, n2) => n1.id === n2.id),
        edges: utils.uniqueElementsBy(graph_data.edges, (e1, e2) => {
          if (e1.id && e2.id) {
            return e1.id === e2.id;
          }
          // 因为largeGraph没有做transform，因此没有edge.id，需要手动拼装下
          return `${e1.source}_${e1.target}_${e1.edgeType}` === `${e2.source}_${e2.target}_${e2.edgeType}`;
        }),
      };
    }

    canvasData = data;
    //filterData.current = data;

    //如果在limit内，则添加到画布上
    const isOverLimit = data.nodes.length > limit;
    if (isOverLimit) {
      canvasData = {
        nodes: [],
        edges: [],
      };
    }

    updateContext(draft => {
      if (largeGraphData && isStyles(largeGraphData.nodes)) {
        draft.data = canvasData;
        draft.source = canvasData;
      } else {
        draft.data = transform(canvasData);
        draft.source = transform(canvasData);
      }
      draft.layoutCache = true;
    });
  }, [filterOptions]);

  return (
    <div className="gi-filter-panel">
      <Interpretation filterOptions={filterOptions} filterLogic={filterLogic} />
      <Button type="primary" style={{ width: '100%', borderRadius: '4px' }} onClick={addFilter} icon={<PlusOutlined />}>
        增加筛选器
      </Button>
      <div className="gi-filter-panel-criteria-container">
        {Object.values(filterOptions).map(filterCriter => {
          return (
            <div>
              <FilterSelection
                source={largeGraphData as GraphinData}
                filterCriteria={filterCriter}
                nodeProperties={nodeProperties}
                edgeProperties={edgeProperties}
                updateFilterCriteria={updateFilterCriteria}
                removeFilterCriteria={removeFilterCriteria}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilterPanel;
