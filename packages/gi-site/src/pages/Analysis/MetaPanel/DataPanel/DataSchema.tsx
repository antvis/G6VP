import { utils } from '@alipay/graphinsight';
import { EditFilled } from '@ant-design/icons';
import Graphin from '@antv/graphin';
import { Button, Drawer } from 'antd';
import * as React from 'react';
import CollapseCard from '../../../../components/CollapseCard';
import { updateProjectById } from '../../../../services';
import { useContext } from '../../hooks/useContext';
import getSchemaGraph from './getSchemaGraph';
import SchemaEditor from './SchemaEditor';
interface DataServiceProps {}

export interface FormValues {
  id: string;
  displayName: string;

  content: string;
}
const DataSchema: React.FunctionComponent<DataServiceProps> = props => {
  const { updateContext, context } = useContext();

  const { id, serviceConfig, schemaData, config } = context;

  const [state, setState] = React.useState({
    visible: false,
  });
  const schemaGraph = React.useMemo(() => {
    return getSchemaGraph(schemaData);
  }, [schemaData]);
  const { visible } = state;
  const handleClick = () => {
    setState(preState => {
      return {
        ...preState,
        visible: true,
      };
    });
  };
  const onClose = () => {
    setState(preState => {
      return {
        ...preState,
        visible: false,
      };
    });
  };

  const onSave = params => {
    const newConfig = utils.generatorStyleConfigBySchema(schemaData, config);

    updateProjectById(id, {
      projectConfig: JSON.stringify(newConfig),
      schemaData: JSON.stringify(params.schemaData),
    }).then(res => {
      updateContext(draft => {
        draft.key = Math.random();
      });
    });
  };
  return (
    <div>
      <CollapseCard
        title="图模型"
        extra={
          <Button type="dashed" style={{ width: '100%' }} size="small" onClick={handleClick}>
            <EditFilled /> 编辑
          </Button>
        }
      >
        <Graphin
          style={{ width: '322px', height: '300px', minHeight: '300px' }}
          data={schemaGraph}
          fitView
          layout={{ type: 'graphin-force', animation: false }}
        ></Graphin>
        <Drawer title="编辑图模型" placement="right" onClose={onClose} visible={visible} width="calc(100vw - 382px)">
          <SchemaEditor schemaGraph={schemaGraph} schemaData={schemaData} onSave={onSave} />
        </Drawer>
      </CollapseCard>
    </div>
  );
};

export default DataSchema;
