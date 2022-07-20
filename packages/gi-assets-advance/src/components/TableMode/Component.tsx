import { useContext } from '@alipay/graphinsight';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { Tabs } from 'antd';
import React from 'react';
import './index.less';

interface IState {
  nodeData: any[];
  edgeData: any[];
}

const { TabPane } = Tabs;

const TableMode = () => {
  const { schemaData, data: graphData } = useContext();

  console.log('data:', graphData);

  console.log('schemaData:', schemaData);

  const nodeDataCfg = React.useMemo(() => {
    const nodeProperties = schemaData.nodes.reduce((acc, cur) => {
      return {
        ...acc,
        ...cur.properties,
      };
    }, {});

    let columns: string[] = [];
    for (let key in nodeProperties) {
      if (typeof nodeProperties[key] === 'number' || typeof nodeProperties[key] === 'string') {
        columns.push(key);
      }
    }
    const data = graphData.nodes.map(node => node.data);
    return {
      fields: {
        columns,
      },
      data,
    };
  }, [schemaData, graphData]);

  const edgeDataCfg = React.useMemo(() => {
    const edgeProperties = schemaData.edges.reduce((acc, cur) => {
      return {
        ...acc,
        ...cur.properties,
      };
    }, {});

    let columns: string[] = [];
    for (let key in edgeProperties) {
      if (typeof edgeProperties[key] === 'number' || typeof edgeProperties[key] === 'string') {
        columns.push(key);
      }
    }
    const data = graphData.edges.map(edge => edge.data);
    return {
      fields: {
        columns,
      },
      data,
    };
  }, [schemaData, graphData]);

  const options = {
  }

  return (
    <div className="gi-table-mode" id="gi-table-mode">
      <Tabs tabPosition="left">
        <TabPane tab="点表" key="node">
          <SheetComponent  options={options} adaptive={{ width: true, height: true }} dataCfg={nodeDataCfg} sheetType="table" />
        </TabPane>
        <TabPane tab="边表" key="edge">
          <SheetComponent options={options} adaptive={{ width: true, height: true }} dataCfg={edgeDataCfg} sheetType="table" />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TableMode;
