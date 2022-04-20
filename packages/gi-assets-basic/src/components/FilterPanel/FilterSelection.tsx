import React, { useEffect, useState, useRef } from 'react';
import { Pie, Plot, PieOptions, WordCloud, WordCloudOptions } from '@antv/g2plot';
import { Button, Select } from 'antd';
import { DeleteOutlined, NumberOutlined, FieldStringOutlined } from '@ant-design/icons';
import { Filter as BrushFilter } from 'motif-gi';
import { useContext } from '@alipay/graphinsight';
import { IFilterCriteria, IChartData } from './type';
import { getValueMap, getHistogram } from './utils';
import './index.less';

const iconMap = {
  boolean: <FieldStringOutlined style={{ color: 'rgb(39, 110, 241)', marginRight: '4px' }} />,
  string: <FieldStringOutlined style={{ color: 'rgb(39, 110, 241)', marginRight: '4px' }} />,
  number: <NumberOutlined style={{ color: 'rgb(255, 192, 67)', marginRight: '4px' }} />,
};

interface FilterSelectionProps {
  filterCriter: IFilterCriteria;
  updateFilterCriteria: (id: string, filterCriteria: IFilterCriteria) => void;
  removeFilterCriteria: (id: string) => void;
  nodeProperties: Object;
  edgeProperties: Object;
  histogramColor: string;
}

const FilterSelection: React.FC<FilterSelectionProps> = props => {
  const { filterCriter, nodeProperties, edgeProperties, updateFilterCriteria, removeFilterCriteria, histogramColor } =
    props;
  const [chartData, setChartData] = useState<Map<string, number>>();
  const { source } = useContext();
  const piePlotRef = useRef<Plot<PieOptions> | undefined>();
  const wordCloudRef = useRef<Plot<WordCloudOptions> | undefined>();

  const onSelectChange = value => {
    const id = filterCriter.id as string;
    const elementType = value.slice(0, 4);
    const prop = value.slice(5);
    const elementProps = elementType === 'node' ? nodeProperties : edgeProperties;
    let analyzerType;
    if (elementProps[prop] === 'number') {
      analyzerType = 'BRUSH';
      const histogram = getHistogram(source, prop, elementType, histogramColor);
      updateFilterCriteria(id, {
        //...filterCriter,
        id,
        analyzerType,
        isFilterReady: false,
        elementType,
        prop,
        histogram,
        range: histogram.domain,
      });
    } else if (elementProps[prop] === 'boolean') {
      analyzerType = 'SELECT';
      const selectOptions = [
        {
          value: true,
          label: '是',
        },
        {
          value: false,
          label: '否',
        },
      ];
      updateFilterCriteria(id, {
        //...filterCriter,
        id,
        isFilterReady: false,
        elementType,
        prop,
        analyzerType,
        selectOptions,
      });
    } else if (elementProps[prop] === 'string') {
      const valueMap = getValueMap(source, prop, elementType);
      let selectOptions;
      if (valueMap.size <= 5) {
        analyzerType = 'PIE';
        setChartData(valueMap);
      } else if (valueMap.size <= 10) {
        analyzerType = 'WORDCLOUD';
        setChartData(valueMap);
      } else {
        analyzerType = 'SELECT';
        selectOptions = [...valueMap.keys()].map(key => ({
          value: key,
          label: key,
        }));
      }
      updateFilterCriteria(id, {
        //...filterCriter,
        id,
        isFilterReady: false,
        elementType,
        prop,
        analyzerType,
        selectOptions,
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
    const id = filterCriter.id as string;
    const isFilterReady = value.length !== 0;
    updateFilterCriteria(id, {
      ...filterCriter,
      isFilterReady,
      selectValue: value,
    });
  };

  const onBrushChange = value => {
    const id = filterCriter.id as string;
    updateFilterCriteria(id, {
      ...filterCriter,
      isFilterReady: true,
      range: value,
    });
  };

  const renderPie = (chartData?: Map<string, number>, container?: string) => {
    if (!chartData || !container) {
      return;
    }
    const sum = [...chartData.values()].reduce((acc, cur) => acc + cur, 0);
    const data = [...chartData.entries()].map(e => {
      const [key, value] = e;
      return {
        x: key,
        value,
      };
    });

    const piePlot = new Pie(container, {
      //width: 300,
      height: 200,
      data,
      angleField: 'value',
      colorField: 'x',
      radius: 0.9,
      label: {
        type: 'inner',
        offset: '-30%',
        content: ({ value }) => `${((value / sum) * 100).toFixed(0)}%`,
        style: {
          fontSize: 14,
          textAlign: 'center',
        },
      },
      interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    });

    piePlot.on('element:click', ({ view }) => {
      const elements = view.geometries[0].elements;
      const selectValue = elements.filter(e => e.states.indexOf('selected') != -1).map(e => e.data.x);
      const isFilterReady = selectValue.length != 0;
      updateFilterCriteria(filterCriter.id!, {
        ...filterCriter,
        isFilterReady,
        selectValue,
      });
    });

    piePlot.render();
    piePlotRef.current = piePlot;
  };

  const renderWordCloud = (chartData?: Map<string, number>, container?: string) => {
    if (!chartData || !container) {
      return;
    }
    const data = [...chartData.entries()].map(e => {
      const [key, value] = e;
      return {
        x: key,
        value,
        category: '',
      };
    });

    const wordCloud = new WordCloud(container, {
      data,
      height: 200,
      wordField: 'x',
      weightField: 'value',
      color: '#122c6a',
      wordStyle: {
        fontFamily: 'Verdana',
        fontSize: [10, 16],
      },
      // 设置交互类型
      interactions: [{ type: 'element-active' }, { type: 'element-selected' }],
      state: {
        active: {
          // 这里可以设置 active 时的样式
          style: {
            lineWidth: 3,
          },
        },
      },
    });

    wordCloud.on('element:click', ({view}) => {
      const elements = view.geometries[0].elements;
      const selectValue = elements.filter(e => e.states.indexOf('selected') != -1).map(e => e.data.datum.x);
      const isFilterReady = selectValue.length != 0;
      updateFilterCriteria(filterCriter.id!, {
        ...filterCriter,
        isFilterReady,
        selectValue,
      });
    })

    wordCloud.render();
    wordCloudRef.current = wordCloud;
  };

  useEffect(() => {
    if (filterCriter.analyzerType === 'PIE') {
      piePlotRef.current?.destroy();
      renderPie(chartData, `${filterCriter.id}-chart-container`);
    } else {
      piePlotRef.current?.destroy();
      piePlotRef.current = undefined;
    }

    if (filterCriter.analyzerType === 'WORDCLOUD') {
      wordCloudRef.current?.destroy();
      renderWordCloud(chartData, `${filterCriter.id}-chart-container`);
    } else {
      wordCloudRef.current?.destroy();
      wordCloudRef.current = undefined;
    }
  }, [chartData, filterCriter.analyzerType]);

  return (
    <div key={filterCriter.id} className="gi-filter-panel-group">
      <div className="gi-filter-panel-prop">
        <Select
          style={{ width: '80%' }}
          onChange={onSelectChange}
          className="gi-filter-panel-prop-select"
          placeholder="选择元素属性"
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
        <Button onClick={() => removeFilterCriteria(filterCriter.id!)} type="text">
          <DeleteOutlined className="gi-filter-panel-delete" />
        </Button>
      </div>
      <div className="gi-filter-panel-value" id={`${filterCriter.id}-chart-container`}>
        {filterCriter.analyzerType == 'SELECT' && (
          <Select
            style={{ width: '100%' }}
            onChange={onValueSelectChange}
            mode="tags"
            placeholder="选择筛选值"
            options={filterCriter.selectOptions}
            value={filterCriter.selectValue}
          />
        )}
        {filterCriter.analyzerType === 'BRUSH' && (
          <BrushFilter
            value={filterCriter.range!}
            histogram={filterCriter.histogram!}
            onChangeRange={onBrushChange}
            /* BrushFilter 组件问题，设置不了百分比 */
            width={document.getElementsByClassName('gi-filter-panel-prop')[0].clientWidth}
          />
        )}

        {filterCriter.analyzerType === 'NONE' && <span>请选择合法字段</span>}
      </div>
    </div>
  );
};

export default FilterSelection;
