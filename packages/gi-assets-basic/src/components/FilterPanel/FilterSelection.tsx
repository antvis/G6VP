import {
  BarChartOutlined,
  DeleteOutlined,
  FieldStringOutlined,
  FieldTimeOutlined,
  NumberOutlined,
  PieChartOutlined,
  SelectOutlined,
} from '@ant-design/icons';
import { GraphinData } from '@antv/graphin';
import { Button, Dropdown, Menu, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { LocaleWrapper } from '@antv/gi-sdk';
import type { LocaleWrapperProps } from '@antv/gi-sdk';
import type { FilterPanelLocale } from './Component';
import { ColumnChart, HistogramChart, PieChart, WordCloudChart } from './Charts';
import HistogramOptions from './Charts/HistogramOptions';
import LineChart from './Charts/LineChart';
import './index.less';
import { IFilterCriteria } from './type';
import { getChartData, getHistogramData } from './utils';
import zhCN from './locale/zh-CN';

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

interface FilterSelectionProps extends LocaleWrapperProps<FilterPanelLocale> {
  filterCriteria: IFilterCriteria;
  updateFilterCriteria: (id: string, filterCriteria: IFilterCriteria) => void;
  removeFilterCriteria: (id: string) => void;
  nodeProperties: Object;
  edgeProperties: Object;
  source: GraphinData;
  defaultKey?: string;
}

const FilterSelection: React.FC<FilterSelectionProps> = props => {
  const { filterCriteria, nodeProperties, edgeProperties, updateFilterCriteria, removeFilterCriteria, source, locale } = props;

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
      const selectOptions = [...chartData.keys()].map(key => ({
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

  return (
    <div key={filterCriteria.id} className="gi-filter-panel-group">
      <div className="gi-filter-panel-prop">
        <Select
          style={{ width: '80%' }}
          onChange={onSelectChange}
          className="gi-filter-panel-prop-select"
          placeholder={locale?.selectElementAttr}
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
          <Select.OptGroup key="node" label={locale?.node}>
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
          <Select.OptGroup key="edge" label={locale?.edge}>
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
            placeholder={locale?.selectFilterValue}
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

        {filterCriteria.analyzerType === 'COLUMN' && (
          <ColumnChart filterCriteria={filterCriteria} updateFilterCriteria={updateFilterCriteria} />
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

        {filterCriteria.analyzerType === 'NONE' && <span>{locale?.selectValidField}</span>}
      </div>
    </div>
  );
};

export default LocaleWrapper({ componentName: 'FilterPanel', defaultLocale: zhCN })(FilterSelection);
