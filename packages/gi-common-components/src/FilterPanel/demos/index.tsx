import { useContext } from '@antv/gi-sdk';
import Graphin from '@antv/graphin';
import * as React from 'react';
import FilterPanel from '../Component';
import { data, schemaData } from './const';
interface DemoProps {}

const Filter = () => {
  const { graph } = useContext();
  /** 只有 highlightMode=true 的时候，才会有回调函数 */
  const handleChange = val => {
    console.log('val', val);
  };

  return (
    <FilterPanel
      isFilterIsolatedNodes={true}
      highlightMode={true}
      filterLogic="and"
      filterKeys={[]}
      source={data}
      schemaData={schemaData}
      graph={graph}
      onChange={handleChange}
    ></FilterPanel>
  );
};

const Demo: React.FunctionComponent<DemoProps> = props => {
  return (
    <Graphin data={data}>
      <div
        style={{ position: 'absolute', top: '0px', right: '0px', width: '300px', background: '#fff', bottom: '0px' }}
      >
        <Filter></Filter>;
      </div>
    </Graphin>
  );
};

export default Demo;
