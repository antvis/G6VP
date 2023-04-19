import {
  BarChartOutlined,
  DeleteOutlined,
  FieldStringOutlined,
  FieldTimeOutlined,
  NumberOutlined,
  PieChartOutlined,
  SelectOutlined,
  FireTwoTone,
} from '@ant-design/icons';
import { GraphinData } from '@antv/graphin';
import { useContext, utils } from '@antv/gi-sdk';
import { Button, Dropdown, Menu, Select, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import { ColumnChart, HistogramChart, PieChart, WordCloudChart } from './Charts';
import HistogramOptions from './Charts/HistogramOptions';
import LineChart from './Charts/LineChart';
import './index.less';
import { IFilterCriteria } from './type';
import { getChartData, getHistogramData } from './utils';

export const iconMap = {
  boolean: <FieldStringOutlined style={{ color: 'rgb(39, 110, 241)', marginRight: '4px' }} />,
  string: <FieldStringOutlined style={{ color: 'rgb(39, 110, 241)', marginRight: '4px' }} />,
  number: <NumberOutlined style={{ color: 'rgb(255, 192, 67)', marginRight: '4px' }} />,
  date: <FieldTimeOutlined style={{ color: 'rgb(255, 192, 67)', marginRight: '4px' }} />,
};

const analyzerType2Icon = {
  COLUMN: <BarChartOutlined />,
  PIE: <PieChartOutlined />,
  SELECT: <SelectOutlined />,
};

interface FilterSelectionProps {
  filterCriteria: IFilterCriteria;
  updateFilterCriteria: (id: string, filterCriteria: IFilterCriteria) => void;
  removeFilterCriteria: (id: string) => void;
  nodeProperties: Object;
  edgeProperties: Object;
  source: GraphinData;
  sorttedProperties?: {
    node: { propertyName: string; entropy: number }[];
    edge: { propertyName: string; entropy: number }[];
  };
  defaultKey?: string;
  enableInfoDetect?: boolean;
}

const FilterSelection: React.FC<FilterSelectionProps> = props => {
  const { propertyGraphData } = useContext();
  const {
    filterCriteria,
    nodeProperties,
    edgeProperties,
    updateFilterCriteria,
    removeFilterCriteria,
    source,
    enableInfoDetect,
    sorttedProperties = { node: [], edge: [] },
  } = props;

  // 对于离散类型的数据支持切换图表类型
  const [enableChangeChartType, setEnableChangeChartType] = useState<boolean>(false);

  const onSelectChange = value => {
    const id = filterCriteria.id as string;
    const elementType = value.slice(0, 4);
    const prop = value.slice(5);
    const elementProps = elementType === 'node' ? nodeProperties : edgeProperties;
    let analyzerType;
    if (elementProps[prop] === 'number') {
      analyzerType = 'HISTOGRAM';
      updateFilterCriteria(id, {
        ...filterCriteria,
        id,
        analyzerType,
        isFilterReady: false,
        elementType,
        prop,
      });
      setEnableChangeChartType(false);
    } else if (elementProps[prop] === 'boolean') {
      analyzerType = 'Column';
      updateFilterCriteria(id, {
        ...filterCriteria,
        id,
        isFilterReady: false,
        elementType,
        prop,
        analyzerType,
      });
      setEnableChangeChartType(false);
    } else if (elementProps[prop] === 'string') {
      const chartData = getChartData(source, prop, elementType);
      let selectOptions = [...chartData.keys()].map(key => ({
        value: key,
        label: key,
      }));
      if (chartData.size <= 5) {
        analyzerType = 'PIE';
        //setChartData(valueMap);
      } else if (chartData.size <= 10) {
        analyzerType = 'COLUMN';
        //setChartData(valueMap);
      } else {
        analyzerType = 'SELECT';

        const sorttedValues = utils.getPropertyValueRanks(propertyGraphData, elementType, prop);
        selectOptions = selectOptions.map(option => {
          const { value } = option;
          const { rank, isOutlier } = sorttedValues.find(item => item.propertyValue === value) || {};
          return {
            ...option,
            rank,
            isOutlier,
          };
        });
      }
      updateFilterCriteria(id, {
        ...filterCriteria,
        id,
        isFilterReady: false,
        elementType,
        prop,
        analyzerType,
        selectOptions,
        chartData,
      });
      setEnableChangeChartType(true);
    } else if (elementProps[prop] === 'date') {
      analyzerType = 'DATE';
      updateFilterCriteria(id, {
        ...filterCriteria,
        id,
        isFilterReady: false,
        elementType,
        prop,
        analyzerType,
      });
      setEnableChangeChartType(false);
    } else {
      analyzerType = 'NONE';
      updateFilterCriteria(id, {
        ...filterCriteria,
        id,
        isFilterReady: false,
        elementType,
        prop,
        analyzerType,
      });
      setEnableChangeChartType(false);
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

  const changeChartType = ({ key }) => {
    updateFilterCriteria(filterCriteria.id as string, {
      ...filterCriteria,
      analyzerType: key,
    });
  };

  const elementProps = filterCriteria.elementType === 'node' ? nodeProperties : edgeProperties;

  // 初始展示筛选器
  useEffect(() => {
    if (filterCriteria.defaultKey) {
      onSelectChange(filterCriteria.defaultKey);
    }
  }, [filterCriteria.defaultKey]);

  useEffect(() => {
    const { prop, elementType, analyzerType } = filterCriteria;
    if (prop && elementType && analyzerType && ['PIE', 'SELECT', 'WORDCLOUD'].indexOf(analyzerType) !== -1) {
      const chartData = getChartData(source, prop, elementType);
      updateFilterCriteria(filterCriteria.id!, {
        ...filterCriteria,
        chartData,
      });
    }

    if (prop && elementType && analyzerType && ['HISTOGRAM'].indexOf(analyzerType) !== -1) {
      const histogramData = getHistogramData(source, prop, elementType);
      updateFilterCriteria(filterCriteria.id!, {
        ...filterCriteria,
        histogramData,
      });
    }
  }, [source, filterCriteria.prop, filterCriteria.elementType, filterCriteria.analyzerType]);

  const menu = (
    <Menu
      onClick={changeChartType}
      items={[
        {
          key: 'COLUMN',
          label: <BarChartOutlined />,
        },
        {
          key: 'PIE',
          label: <PieChartOutlined />,
        },
        {
          key: 'SELECT',
          label: <SelectOutlined />,
        },
      ]}
    />
  );

  const getPropertyOptions = (itemType, top = 3) => {
    const elementProps = itemType === 'node' ? nodeProperties : edgeProperties;
    return Object.entries(elementProps).map(e => {
      const [key, value] = e;
      const icon = iconMap[value];

      let isImportant = false;
      if (enableInfoDetect) {
        const entropyIdx = sorttedProperties[itemType].findIndex(property => property.propertyName === key);
        if (entropyIdx > -1 && entropyIdx < top) isImportant = true;
      }

      return (
        <Select.Option value={`${itemType}-${key}`}>
          {isImportant ? (
            <Row>
              <Col span={22}>
                {icon}
                {key}
              </Col>
              <Col span={2}>
                <FireTwoTone twoToneColor="#eb2f96" />
              </Col>
            </Row>
          ) : (
            <>
              {icon}
              {key}
            </>
          )}
        </Select.Option>
      );
    });
  };

  return (
    <div key={filterCriteria.id} id={`panel-${filterCriteria.id}`} className="gi-filter-panel-group">
      <div className="gi-filter-panel-prop">
        <Select
          style={{ width: '80%' }}
          onChange={onSelectChange}
          className="gi-filter-panel-prop-select"
          placeholder="选择元素属性"
          showSearch
          filterOption={(input, option) => {
            return (option?.value as string)?.toLowerCase().includes(input.toLowerCase());
          }}
          value={
            filterCriteria.elementType && filterCriteria.prop
              ? `${filterCriteria.elementType}-${filterCriteria.prop}`
              : undefined
          }
        >
          <Select.OptGroup key="node" label="节点">
            {getPropertyOptions('node')}
          </Select.OptGroup>
          <Select.OptGroup key="edge" label="边">
            {getPropertyOptions('edge')}
          </Select.OptGroup>
        </Select>
        {enableChangeChartType && (
          <Dropdown overlay={menu}>
            <Button icon={analyzerType2Icon[filterCriteria.analyzerType!]} type="text"></Button>
          </Dropdown>
        )}
        <HistogramOptions filterCriteria={filterCriteria} updateFilterCriteria={updateFilterCriteria} />
        <Button onClick={() => removeFilterCriteria(filterCriteria.id!)} type="text" style={{ padding: '4px' }}>
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
            value={filterCriteria.selectValue}
          >
            {filterCriteria.selectOptions?.map(option => {
              const { rank, label, value } = option;
              return (
                <Select.Option value={value}>
                  {rank !== undefined && rank < 3 ? (
                    <Row style={{ width: '100%' }}>
                      <Col span={20}>{label}</Col>
                      <Col span={4}>{new Array(3 - rank).fill(<FireTwoTone twoToneColor="#eb2f96" />)}</Col>
                    </Row>
                  ) : (
                    label
                  )}
                </Select.Option>
              );
            })}
          </Select>
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

        {filterCriteria.analyzerType === 'COLUMN' && (
          <ColumnChart filterCriteria={filterCriteria} updateFilterCriteria={updateFilterCriteria} highlightRank={5} />
        )}

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
