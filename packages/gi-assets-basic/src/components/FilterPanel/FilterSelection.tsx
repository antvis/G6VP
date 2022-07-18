import { DeleteOutlined, FieldStringOutlined, FieldTimeOutlined, NumberOutlined } from '@ant-design/icons';
import { GraphinData } from '@antv/graphin';
import { Button, Select } from 'antd';
import React, { useEffect } from 'react';
import { HistogramChart, PieChart, WordCloudChart, ColumnChart  } from './Charts';
import LineChart from './Charts/LineChart';
import './index.less';
import { IFilterCriteria } from './type';
import { getHistogramData, getValueMap } from './utils';

export const iconMap = {
  boolean: <FieldStringOutlined style={{ color: 'rgb(39, 110, 241)', marginRight: '4px' }} />,
  string: <FieldStringOutlined style={{ color: 'rgb(39, 110, 241)', marginRight: '4px' }} />,
  number: <NumberOutlined style={{ color: 'rgb(255, 192, 67)', marginRight: '4px' }} />,
  date: <FieldTimeOutlined style={{ color: 'rgb(255, 192, 67)', marginRight: '4px' }} />,
};

interface FilterSelectionProps {
  filterCriteria: IFilterCriteria;
  updateFilterCriteria: (id: string, filterCriteria: IFilterCriteria) => void;
  removeFilterCriteria: (id: string) => void;
  nodeProperties: Object;
  edgeProperties: Object;
  source: GraphinData;
  defaultKey?: string;
}

const FilterSelection: React.FC<FilterSelectionProps> = props => {
  const { filterCriteria, nodeProperties, edgeProperties, updateFilterCriteria, removeFilterCriteria, source } = props;
  // const [chartData, setChartData] = useState<Map<string, number>>(new Map());
  // const [histogramData, setHistogramData] = useState<IHistogramValue[]>([]);
  // const { source } = useContext();

  const onSelectChange = value => {
    const id = filterCriteria.id as string;
    const elementType = value.slice(0, 4);
    const prop = value.slice(5);
    const elementProps = elementType === 'node' ? nodeProperties : edgeProperties;
    let analyzerType;
    if (elementProps[prop] === 'number') {
      analyzerType = 'HISTOGRAM';
      // const histogramData = getHistogramData(source, prop, elementType);
      updateFilterCriteria(id, {
        id,
        analyzerType,
        isFilterReady: false,
        elementType,
        prop,
        //range: [],
        // histogramData,
      });
    } else if (elementProps[prop] === 'boolean') {
      analyzerType = 'Column';
      // const chartData = getValueMap(source, prop, elementType);
      //setChartData(valueMap);
      updateFilterCriteria(id, {
        id,
        isFilterReady: false,
        elementType,
        prop,
        analyzerType,
        // chartData,
      });
    } else if (elementProps[prop] === 'string') {
      const chartData = getValueMap(source, prop, elementType);
      let selectOptions;
      if (chartData.size <= 10) {
        analyzerType = 'COLUMN';
        //setChartData(valueMap);
      } /* else if (chartData.size <= 10) {
        analyzerType = 'WORDCLOUD';
        //setChartData(valueMap);
      } */ else {
        analyzerType = 'SELECT';
        selectOptions = [...chartData.keys()].map(key => ({
          value: key,
          label: key,
        }));
      }
      updateFilterCriteria(id, {
        id,
        isFilterReady: false,
        elementType,
        prop,
        analyzerType,
        selectOptions,
        chartData,
      });
    } else if (elementProps[prop] === 'date') {
      analyzerType = 'DATE';
      updateFilterCriteria(id, {
        id,
        isFilterReady: false,
        elementType,
        prop,
        analyzerType,
      });
    } else {
      analyzerType = 'NONE';
      updateFilterCriteria(id, {
        id,
        isFilterReady: false,
        elementType,
        prop,
        analyzerType,
      });
    }
  };

  const onValueSelectChange = value => {
    const id = filterCriteria.id as string;
    const isFilterReady = value.length !== 0;
    updateFilterCriteria(id, {
      ...filterCriteria,
      isFilterReady,
      selectValue: value,
    });
  };
  const elementProps = filterCriteria.elementType === 'node' ? nodeProperties : edgeProperties;

  // 初始展示筛选器
  useEffect(() => {
    if (filterCriteria.defaultKey) {
      onSelectChange(filterCriteria.defaultKey)
    }
  }, [filterCriteria.defaultKey])

  useEffect(() => {
    const { prop, elementType, analyzerType } = filterCriteria;
    if (prop && elementType && analyzerType && ["PIE", "SELECT", "WORDCLOUD"].indexOf(analyzerType) !== -1) {
      const chartData = getValueMap(source, prop, elementType);
      updateFilterCriteria(filterCriteria.id!, {
        ...filterCriteria,
        chartData,
      })
    }

    if (prop && elementType && analyzerType && ["HISTOGRAM"].indexOf(analyzerType) !== -1) {
      const histogramData = getHistogramData(source, prop, elementType);
      updateFilterCriteria(filterCriteria.id!, {
        ...filterCriteria,
        histogramData,
      })
    }

  }, [source, filterCriteria.prop, filterCriteria.elementType, filterCriteria.analyzerType ])



  return (
    <div key={filterCriteria.id} className="gi-filter-panel-group">
      <div className="gi-filter-panel-prop">
        <Select
          style={{ width: '80%' }}
          onChange={onSelectChange}
          className="gi-filter-panel-prop-select"
          placeholder="选择元素属性"
          value={
            filterCriteria.elementType && filterCriteria.prop
              ? `${filterCriteria.elementType}-${filterCriteria.prop}`
              : undefined
          }
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
        <Button onClick={() => removeFilterCriteria(filterCriteria.id!)} type="text">
          <DeleteOutlined className="gi-filter-panel-delete" />
        </Button>
      </div>
      <div className="gi-filter-panel-value" id={`${filterCriteria.id}-chart-container`}>
        {filterCriteria.analyzerType == 'SELECT' && (
          <Select
            style={{ width: '100%' }}
            onChange={onValueSelectChange}
            mode="tags"
            placeholder="选择筛选值"
            options={filterCriteria.selectOptions}
            value={filterCriteria.selectValue}
          />
        )}

        {filterCriteria.analyzerType === 'PIE' && (
          <PieChart
            filterCriteria={filterCriteria}
            updateFilterCriteria={updateFilterCriteria}
            //chartData={chartData}
          />
        )}

        {filterCriteria.analyzerType === 'WORDCLOUD' && (
          <WordCloudChart
            filterCriteria={filterCriteria}
            updateFilterCriteria={updateFilterCriteria}
            //chartData={chartData}
          />
        )}

        {
          filterCriteria.analyzerType === "COLUMN" && (
            <ColumnChart filterCriteria={filterCriteria} updateFilterCriteria={updateFilterCriteria}/>
          )
        }

        {filterCriteria.analyzerType === 'HISTOGRAM' && (
          <HistogramChart filterCriteria={filterCriteria} updateFilterCriteria={updateFilterCriteria} />
        )}

        {filterCriteria.analyzerType === 'DATE' && (
          <LineChart
            filterCriteria={filterCriteria}
            source={source}
            elementProps={elementProps}
            /* BrushFilter 组件问题，设置不了百分比 */
            width={document.getElementsByClassName('gi-filter-panel-prop')[0].clientWidth}
          />
        )}

        {filterCriteria.analyzerType === 'NONE' && <span>请选择合法字段</span>}
      </div>
    </div>
  );
};

export default FilterSelection;
