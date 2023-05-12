import { FireTwoTone, PlusOutlined } from '@ant-design/icons';
import { useContext, utils } from '@antv/gi-sdk';
import { GraphinData } from '@antv/graphin';
import { Button } from 'antd';
import { nanoid } from 'nanoid';
import React, { useEffect, useMemo, useState } from 'react';
import FilterSelection from './FilterSelection';
import RecommendFilter from './RecommendFilter';
import './index.less';
import { HistogramOpt, IFilterCriteria } from './type';
import { filterGraphData, getChartData, highlightSubGraph } from './utils';

const { isStyles } = utils;

let updateTimer: NodeJS.Timer;

export interface FilterPanelProps {
  isFilterIsolatedNodes: boolean;
  highlightMode?: boolean;
  filterLogic: 'and' | 'or';
  filterKeys: string[];
  histogramOptions?: HistogramOpt;
  enableInfoDetect?: boolean;
  controlledValues?: {
    options: { [id: string]: IFilterCriteria };
  };
  onOpen?: () => void;
}

const FilterPanel: React.FunctionComponent<FilterPanelProps> = props => {
  const {
    isFilterIsolatedNodes,
    highlightMode,
    filterLogic,
    filterKeys = [],
    histogramOptions,
    enableInfoDetect,
    controlledValues,
    onOpen,
  } = props;
  const [filterOptions, setFilterOptions] = useState<{ [id: string]: IFilterCriteria }>({});
  const [sorttedProperties, setSorttedProperties] = useState<{
    node: { propertyName: string; entropy: number }[];
    edge: { propertyName: string; entropy: number }[];
  }>({ node: [], edge: [] });
  const { source, updateContext, updateHistory, transform, schemaData, graph, propertyGraphData } = useContext();

  useEffect(() => {
    if (!enableInfoDetect) return;
    setSorttedProperties({
      node: utils.getPropertyRanks(propertyGraphData, 'node'),
      edge: utils.getPropertyRanks(propertyGraphData, 'edge'),
    });
  }, [propertyGraphData, enableInfoDetect]);

  const nodeProperties = useMemo(() => {
    return schemaData.nodes.reduce((acc, cur) => {
      return {
        ...acc,
        ...cur.properties,
      };
    }, {});
  }, [schemaData]);

  const edgeProperties = useMemo(() => {
    return schemaData.edges.reduce((acc, cur) => {
      return {
        ...acc,
        ...cur.properties,
      };
    }, {});
  }, [schemaData]);

  const addFilter = (defaultKey?: string, filterProps = {}) => {
    const id = nanoid();
    const filterCriteria = {
      id,
      defaultKey,
      histogramOptions,
      isFilterReady: false,
      ...filterProps,
    };

    setFilterOptions(preState => {
      return {
        ...preState,
        [id]: filterCriteria,
      };
    });

    // 滚动到新增的 panel 位置
    setTimeout(() => {
      const dom = document.getElementById(`panel-${filterCriteria.id}`);
      if (dom) dom.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
    return filterCriteria;
  };

  const updateFilterCriteria = (id: string, filterCriteria: IFilterCriteria) => {
    setFilterOptions(preState => {
      const newFilterOptions = {
        ...preState,
        [id]: filterCriteria,
      };
      handleUpateHistory(newFilterOptions);
      return newFilterOptions;
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

      handleUpateHistory(newFilterOptions);

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
          histogramOptions,
          isFilterReady: false,
        };
        return filterCriteria;
      })
      .reduce((acc, cur) => {
        acc[cur.id] = cur;
        return acc;
      }, {});

    setFilterOptions(initialFilterOptions);
    if (filterKeys.length) handleUpateHistory(initialFilterOptions);
  }, [filterKeys]);

  const handleFilterOptionsChange = (options: { [id: string]: IFilterCriteria }) => {
    let data: GraphinData = source;
    // 多个筛选器的筛选逻辑为 ”与“
    if (filterLogic === 'and') {
      Object.values(options).map(filterCriteria => {
        data = filterGraphData(data, filterCriteria, isFilterIsolatedNodes);
      });
      // 多个筛选器间的筛选逻辑为 ”或“
    } else {
      data = {
        nodes: [],
        edges: [],
      };
      Object.values(options).map(filterCriteria => {
        const filterData = filterGraphData(source, filterCriteria, isFilterIsolatedNodes);
        data.nodes = [...data.nodes, ...filterData.nodes];
        data.edges = [...data.edges, ...filterData.edges];
      });

      // 去重
      data.nodes = utils.uniqueElementsBy(data.nodes, (n1, n2) => n1.id === n2.id);
      data.edges = utils.uniqueElementsBy(data.edges, (e1, e2) => e1.id === e2.id);
    }

    if (highlightMode) {
      const { isEmpty, isFull } = highlightSubGraph(graph, data);

      updateContext(draft => {
        //@ts-ignore
        draft.persistentHighlight = !isEmpty && !isFull;
      });

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
  };

  useEffect(() => {
    handleFilterOptionsChange(filterOptions);
  }, [filterOptions]);

  /**
   * 点击 “智能推荐” 时，重新生成所有的智能推荐图表
   */
  const handleClickRecommend = () => {
    const newRecommendOptions = {};
    ['node', 'edge'].forEach((itemType: any) => {
      sorttedProperties[itemType].forEach((item, i) => {
        if (i > 2) return;
        const { propertyName } = item;
        const id = nanoid();
        const chartData = getChartData(source, propertyName, itemType);
        const sorttedValues = utils.getPropertyValueRanks(propertyGraphData, itemType, propertyName);
        let hasOutlier = false;
        const selectOptions = [...chartData.keys()].map(key => {
          const { rank, isOutlier = false } =
            sorttedValues.find(item => String(item.propertyValue) === String(key)) || {};
          hasOutlier = hasOutlier || isOutlier;
          return {
            value: key,
            label: key,
            rank,
            isOutlier,
          };
        });
        newRecommendOptions[id] = {
          id,
          isRecommend: true,
          elementType: itemType,
          prop: propertyName,
          analyzerType: 'COLUMN',
          isFilterReady: false,
          chartData,
          selectOptions,
          hasOutlier,
        } as IFilterCriteria;
      });
    });
    setFilterOptions(prevOptions => {
      const prevRecommendOptionIds: string[] = [];
      const newOptions = { ...prevOptions };
      Object.values(newOptions).forEach(option => {
        if (option.isRecommend) prevRecommendOptionIds.push(option.id);
      });
      prevRecommendOptionIds.forEach(id => {
        delete newOptions[id];
      });
      return {
        ...newOptions,
        ...newRecommendOptions,
      };
    });

    // 滚动到新增的 panel 位置
    setTimeout(() => {
      const id = Object.keys(newRecommendOptions)[0];
      const dom = document.getElementById(`panel-${id}`);
      if (dom) dom.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

   * 更新到历史记录
   * @param success 是否成功
   * @param errorMsg 若失败，填写失败信息
   * @param value 查询语句
   */
  const handleUpateHistory: Function = (
    options: {
      [id: string]: IFilterCriteria;
    },
    success: boolean = true,
    errorMsg?: string,
  ) => {
    const fn = () => {
      const stashOptions = {};
      Object.keys(options).forEach(key => {
        const { analyzerType, defaultKey, elementType, id, prop, selectOptions, histogramOptions } = options[key];
        stashOptions[key] = {
          analyzerType,
          defaultKey,
          elementType,
          id,
          prop,
          selectOptions,
          histogramOptions,
        };
      });

      updateHistory({
        componentId: 'FilterPanel',
        type: 'analyse',
        subType: '筛选',
        statement: '筛选',
        success,
        errorMsg,
        params: {
          options: stashOptions,
        },
      });
    };
    // 防止 filterOptions 被频繁更新导致的重复 updateHistory
    if (updateTimer) clearTimeout(updateTimer);
    updateTimer = setTimeout(fn, 500);
  };

  /**
   * 受控参数变化，自动进行分析
   * e.g. ChatGPT，历史记录模版等
   */
  useEffect(() => {
    if (controlledValues) {
      const { options } = controlledValues;
      onOpen?.();
      setFilterOptions(options);
    }
  }, [controlledValues]);

  return (
    <div className="gi-filter-panel">
      <Button
        type="primary"
        style={{ width: enableInfoDetect ? 'calc(100% - 104px)' : '100%', borderRadius: '4px' }}
        onClick={() => addFilter()}
        icon={<PlusOutlined />}
      >
        增加筛选器
      </Button>
      {enableInfoDetect ? (
        <Button style={{ width: '100px', marginLeft: '4px' }} onClick={handleClickRecommend}>
          <FireTwoTone twoToneColor="#eb2f96" />
          智能推荐
        </Button>
      ) : (
        ''
      )}
      <div className="gi-filter-panel-criteria-container">
        {Object.values(filterOptions).map(filterCriteria => {
          const { isRecommend } = filterCriteria;
          return isRecommend ? (
            <RecommendFilter
              filterCriteria={filterCriteria}
              updateFilterCriteria={updateFilterCriteria}
              removeFilterCriteria={removeFilterCriteria}
            />
          ) : (
            <FilterSelection
              source={source}
              filterCriteria={filterCriteria}
              nodeProperties={nodeProperties}
              edgeProperties={edgeProperties}
              updateFilterCriteria={updateFilterCriteria}
              removeFilterCriteria={removeFilterCriteria}
              sorttedProperties={sorttedProperties}
              enableInfoDetect={enableInfoDetect}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FilterPanel;
