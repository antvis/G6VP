import { useContext, utils } from '@alipay/graphinsight';
import { Column, Sunburst } from "@antv/g2plot";
import { Skeleton } from 'antd';
import React from 'react';
import csvjson from 'csvjson';
import DivContainer from '../UIComponents/DivContainer';
import Properties from './Properties';
export interface PropertiesPanelProps {
  hasService: boolean;
  serviceId?: string;
  placement: 'LT' | 'LB' | 'RT' | 'RB';
  width: string;
  height: string;
  title: string;
  offset: number[];
}

let hasIndustryDatas: any = {};
let columnChart;
let sunburstChart;

/**
 * https://doc.linkurio.us/user-manual/latest/visualization-inspect/
 */
const PropertiesPanel: React.FunctionComponent<PropertiesPanelProps> = props => {
  const { serviceId, hasService, placement, width, title, height, offset } = props;
  const { graph, services, GISDK_ID } = useContext();
  const service = utils.getService(services, serviceId);
  if (!service) {
    return null;
  }

  const [state, setState] = React.useState({
    visible: false,
    detail: null,
    isLoading: false,
  });
  const { visible, detail, isLoading } = state;
  const columnRef = React.useRef(null);
  const sunburstRef = React.useRef(null);

  const handleClose = () => {
    setState(preState => {
      if (preState.visible) {
        return {
          visible: false,
          isLoading: false,
          detail: null,
        };
      }
      return preState;
    });
  };

  const generateChart = () => {
    const { nodeType, type, id } = (detail || {} as any);
    const industryData = hasIndustryDatas[type]?.map[id] || hasIndustryDatas[nodeType]?.map[id];
    console.log('columnChart', columnChart);
    if (!industryData) {
      if (columnChart && columnChart.chart && !columnChart.chart.destroyed) columnChart?.chart?.destroy(); 
      if (sunburstChart && sunburstChart.chart && !sunburstChart.chart.destroyed) sunburstChart?.chart?.destroy();
      return;
    }
    const { domainCount = 0, riskDomainCount = 0, A, B, C, D, E, F, G, H, I } = industryData;

    const columnData = [A, B, C, D, E, F, G, H, I].map((value, i) => ({ value: String.fromCharCode(65 + i), count: (+value || 0)}))
    if (columnChart && columnChart.chart && !columnChart.chart.destroyed) {
      columnChart.changeData(columnData);
    } else {
      // @ts-ignore
      columnChart = new Column(columnRef.current, {
        data: columnData,
        xField: "value",
        yField: "count",
        maxColumnWidth: 60,
        colorField: "count",
        label: {
          position: "middle",
          style: {
            fill: "#FFFFFF",
            opacity: 0.6,
          },
        },
        xAxis: {
          title: {
            text: "Industry",
            position: "end",
            offset: 14,
            style: {
              stroke: "#fff",
              lineWidth: 2,
              fontWeight: 400,
            },
          },
        },
        yAxis: {
          title: {
            text: "数量",
            position: "end",
            autoRotate: false,
            spacing: -55,
            style: {
              stroke: "#fff",
              lineWidth: 2,
              fontWeight: 400,
            },
          },
        },
      });
      columnChart.render();
    }

    const sunburstData = {
      name: 'Industry All',
      children: [{
        name: 'risk domains',
        children: columnData.map(column => ({ name: column.value, value: column.count }))
      }, {
        name: 'normal domains',
        value: domainCount - riskDomainCount
      }]
    };
    console.log('sunburstChart', sunburstChart, sunburstData)
    if (sunburstChart && sunburstChart.chart && !sunburstChart.chart.destroyed) {
      sunburstChart.changeData(sunburstData)
    } else {
      // @ts-ignore
      sunburstChart = new Sunburst(sunburstRef.current, {
        data: sunburstData,
        innerRadius: 0.3,
        interactions: [{ type: 'element-active' }],
        label: {
          // label layout: limit label in shape, which means the labels out of shape will be hide
          layout: [{ type: 'limit-in-shape' }],
        },
        color: ['#ccc', '#fa8c16'],
      });
      sunburstChart.render();
    }

  }

  React.useLayoutEffect(() => {
    const handleNodeClick = async e => {
      setState(preState => {
        return {
          ...preState,
          visible: true,
          isLoading: true,
        };
      });

      const model = e.item.getModel();
      // 有数据服务就从服务中取数，没有服务就从Model中取数
      const detail = await service(model);

      setState(preState => {
        return {
          ...preState,
          detail,
          isLoading: false,
        };
      });
    };
    const handleEdgeClick = async e => {
      setState(preState => {
        return {
          ...preState,
          visible: true,
          isLoading: true,
        };
      });

      const model = e.item.getModel();
      // 有数据服务就从服务中取数，没有服务就从Model中取数
      const detail = await service(model);

      setState(preState => {
        return {
          ...preState,
          detail,
          isLoading: false,
        };
      });
    };

    graph.on('node:click', handleNodeClick);
    graph.on('edge:click', handleEdgeClick);
    graph.on('canvas:click', handleClose);
    return () => {
      graph.off('node:click', handleNodeClick);
      graph.off('canvas:click', handleClose);
      graph.off('edge:click', handleEdgeClick);
    };
  }, [graph, setState, service]);

  React.useEffect(() => {
    hasIndustryDatas = {
      'Whois_Name': { // 2.3MB
        path: 'https://gw.alipayobjects.com/os/bmw-prod/04a48d23-9052-4711-a0bc-ebe78d20ecbf.csv',
        map: {}
      },
      'Cert': { // 14.23MB
        path: 'https://gw.alipayobjects.com/os/bmw-prod/fbd7be82-548c-4e6a-b32a-adcde0ae294e.csv',
        map: {}
      },
      'IP': { // 21MB
        path: 'https://gw.alipayobjects.com/os/bmw-prod/5dc92ab3-fdb1-49fe-871b-7c42ec38ad13.csv',
        map: {}
      }
    }

    Object.keys(hasIndustryDatas).forEach(nodeType => {
      const { path, map } = hasIndustryDatas[nodeType];
      fetch(path)
      .then((csv) => csv.text())
      .then((csv) => {
        const data = csvjson.toObject(csv, {
          delimiter: ",",
          quote: '"',
          arrayDenote: ""
        });
        data.forEach(item => {
          const { id, domainCount, riskDomainCount, A, B, C, D, E, F, G, H, I } = item;
          map[item.id] = { id, domainCount, riskDomainCount, A, B, C, D, E, F, G, H, I }
        });
      });
    })
  }, []);

  React.useEffect(() => {
    generateChart();
  }, [detail])


  const content = !isLoading && detail ? <Properties data={detail} /> : <Skeleton active />;
  const container = document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLDivElement;
  return (
    <DivContainer
      animate={true}
      title={title}
      visible={visible}
      containerPlacement={placement}
      containerWidth={width}
      containerHeight={height}
      onClose={handleClose}
      offset={offset}
    >
      {content}
      <div className="column-wrapper" style={{ height: '200px' }} ref={columnRef} />
      <div className="sunburst-wrapper" style={{ height: '300px' }} ref={sunburstRef} />
    </DivContainer>
  );
};

export default PropertiesPanel;
