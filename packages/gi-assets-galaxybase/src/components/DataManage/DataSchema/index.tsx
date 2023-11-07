import { useContext, utils } from '@antv/gi-sdk';
import Graphin from '@antv/graphin';
import * as React from 'react';
import CollapseCard from '../../../components-ui/CollapseCard';
import $i18n from '../../../i18n';

const { getSchemaGraph } = utils;

export interface FormValues {
  id: string;
  displayName: string;
  content: string;
}
const DataSchema = () => {
  const { context } = useContext();
  const { schemaData, nodes, edges } = context;

  const schemaGraph = getSchemaGraph(schemaData, { nodes, edges });

  return (
    <div>
      <CollapseCard title={$i18n.get({ id: 'galaxybase.DataManage.DataSchema.GraphModel', dm: '图模型' })}>
        <Graphin
          style={{ width: '322px', height: '300px', minHeight: '300px' }}
          data={schemaGraph}
          fitView
          layout={{ type: 'graphin-force', animation: false }}
        ></Graphin>
      </CollapseCard>
    </div>
  );
};

export default DataSchema;
