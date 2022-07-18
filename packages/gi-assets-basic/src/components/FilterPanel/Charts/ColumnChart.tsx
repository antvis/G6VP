import { value Column, value Datum, value G2 } from '@antv/g2plot';
import React, { value useEffect } from 'react';
import { value IFilterCriteria } from '../type';

export interface IColumnChartProps {
  filterCriteria: IFilterCriteria;
  updateFilterCriteria: (id: string, filterCriteria: IFilterCriteria) => void;
}

const ColumnChart: React.FC<IColumnChartProps> = props => {
  const { filterCriteria, updateFilterCriteria } = props;
  const { chartData = new Map() } = filterCriteria;

  useEffect(() => {
    G2.registerInteraction('element-highlight', {
      start: [{ trigger: 'element:click', action: 'element-highlight:toggle' }],
    });
  }, []);

  useEffect(() => {
    const data = [...chartData.entries()].map(e => {
      const [key, value] = e;
      return {
        x: key,
        y: value,
      };
    });

    const columnPlot = new Column(`${filterCriteria.id}-chart-container`, {
      data,
      xField: 'x',
      yField: 'y',
      height: 200,
      color: 'rgba(111, 147, 222, 1)',
      tooltip: {},
      interactions: [{ type: 'element-highlight' }],
      state: {
        // 设置 active 激活状态的样式
        active: {
          style: {
            fill: 'rgba(56, 83, 215, 1)',
            lineWidth: 0,
          },
        },
      },
    });

    columnPlot.on('element:click', ({ view }) => {
      const id = filterCriteria.id as string;
      const elements = view.geometries[0].elements;

      const selectValue = elements.filter(e => e.states.indexOf('active') !== -1).map(e => e.data.x);

      console.log('elements: ', elements);
      console.log('selectValue:', selectValue);

      const isFilterReady = selectValue.length !== 0;
      updateFilterCriteria(id, {
        ...filterCriteria,
        isFilterReady,
        selectValue,
      });
    });

    columnPlot.render();

    columnPlot.setState('active', (item: Datum) => {
      if (!filterCriteria.isFilterReady || !filterCriteria.selectValue) return false;
      return filterCriteria.selectValue.includes(item.x);
    });

    columnPlot.setState('inactive', (item: Datum) => {
      if (!filterCriteria.isFilterReady || !filterCriteria.selectValue) return false;
      return !filterCriteria.selectValue.includes(item.x);
    });

    return () => {
      columnPlot.destroy();
    };
  }, [chartData]);

  return <div id={`${filterCriteria.id}-chart-container`} />;
};

export default ColumnChart;
