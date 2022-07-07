import { useContext, utils } from '@alipay/graphinsight';
import { PlusOutlined } from '@ant-design/icons';
import { GraphinData } from '@antv/graphin';
import { Button } from 'antd';
import { nanoid } from 'nanoid';
import React, { useEffect, useMemo, useState } from 'react';
import FilterSelection from '../FilterPanel/FilterSelection';
import '../FilterPanel/index.less';
import { IFilterCriteria } from '../FilterPanel/type';
import { filterGraphData } from '../FilterPanel/utils';
import Interpretation from './Interpretation';

const { generatorSchemaByGraphData, isStyles } = utils;

export interface FilterPanelProps {
  histogramColor: string;
  isFilterIsolatedNodes: boolean;
  highlightMode?: boolean;
  limit: number;
  filterLogic: 'and' | 'or';
}

const FilterPanel: React.FunctionComponent<FilterPanelProps> = props => {
  const { histogramColor, isFilterIsolatedNodes, limit, filterLogic } = props;
  const [filterOptions, setFilterOptions] = useState<{ [id: string]: IFilterCriteria }>({});
  const { updateContext, transform, schemaData, largeGraphData } = useContext();
  const dataSchemas = schemaData;
  const filterData = React.useRef({});

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
    let data: GraphinData = largeGraphData as GraphinData;
    let canvasData;

    // 多个筛选器的筛选逻辑为 ”与“
    if (filterLogic === 'and') {
      Object.values(filterOptions).map(filterCriteria => {
        data = filterGraphData(data, filterCriteria, isFilterIsolatedNodes);
      });
      // 多个筛选器间的筛选逻辑为 ”或“
    } else {
      data = Object.values(filterOptions).reduce(
        (acc: any, filterCriteria: any) => {
          const curr = filterGraphData(largeGraphData as GraphinData, filterCriteria, isFilterIsolatedNodes);
          return {
            nodes: utils.uniqueElementsBy([...acc.nodes, ...curr.nodes], (n1, n2) => n1.id === n2.id),
            edges: utils.uniqueElementsBy([...acc.edges, ...curr.edges], (e1, e2) => {
              if (e1.id && e2.id) {
                return e1.id === e2.id;
              }
              return `${e1.source}_${e1.target}_${e1.type}` === `${e2.source}_${e2.target}_${e2.type}`;
            }),
          };
        },
        {
          nodes: [],
          edges: [],
        },
      );
      console.log('or data', data);
    }

    // Object.values(filterOptions).map(filterCriteria => {
    //   data = filterGraphData(data, filterCriteria, isFilterIsolatedNodes);
    // });
    // 画布中的数据
    canvasData = data;
    filterData.current = data;

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
      <Interpretation data={filterData.current as GraphinData} filterOptions={filterOptions} />
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
