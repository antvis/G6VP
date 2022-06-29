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
}

const FilterPanel: React.FunctionComponent<FilterPanelProps> = props => {
  const { histogramColor, isFilterIsolatedNodes, limit } = props;
  const [filterOptions, setFilterOptions] = useState<{ [id: string]: IFilterCriteria }>({});
  const { updateContext, transform, schemaData, largeGraphData } = useContext();
  const dataSchemas = schemaData;
  const filterData = React.useRef({});

  const [state, setState] = React.useState({
    source: largeGraphData,
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
  const { source } = state;

  useEffect(() => {
    let data: GraphinData = source as GraphinData;
    let canvasData;

    Object.values(filterOptions).map(filterCriteria => {
      data = filterGraphData(data, filterCriteria, isFilterIsolatedNodes);
    });
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
      if (source && isStyles(source.nodes)) {
        draft.data = canvasData;
      } else {
        draft.data = transform(canvasData);
      }
      draft.layoutCache = true;
    });
  }, [filterOptions, source]);

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
                filterCriter={filterCriter}
                nodeProperties={nodeProperties}
                edgeProperties={edgeProperties}
                updateFilterCriteria={updateFilterCriteria}
                removeFilterCriteria={removeFilterCriteria}
                histogramColor={histogramColor}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilterPanel;
