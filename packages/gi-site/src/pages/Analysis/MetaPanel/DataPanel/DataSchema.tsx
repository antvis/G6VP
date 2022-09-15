import { utils } from '@alipay/graphinsight';
import { EditFilled } from '@ant-design/icons';
import Graphin from '@antv/graphin';
import { Button, Drawer } from 'antd';
import * as React from 'react';
import CollapseCard from '../../../../components/CollapseCard';
import { updateProjectById } from '../../../../services';
import { useContext } from '../../hooks/useContext';
import SchemaEditor from './SchemaEditor';
interface DataServiceProps {}

/**
 * 通过缓存策略，将之前的Config配置作用在新的Config上
 * @param curr 当前新产生的 NodesConfig or EdgeConfig
 * @param prev 之前的 NodesConfig or EdgeConfig
 * @returns
 */
const getStyleConfig = (curr: any[], prev: any[]) => {
  const prevMap = new Map();
  prev.forEach(c => {
    const id = JSON.stringify(c.expressions);
    prevMap.set(id, c);
  });
  return curr.map(c => {
    const id = JSON.stringify(c.expressions);
    const prev = prevMap.get(id);
    if (prev) {
      return prev;
    } else {
      return c;
    }
  });
};

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
    return utils.getSchemaGraph(schemaData, config);
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
    const { schemaData } = params;
    const styleConfig = utils.generatorStyleConfigBySchema(schemaData);
    const nodesConfig = getStyleConfig(styleConfig.nodes, config.nodes);
    const edgesConfig = getStyleConfig(styleConfig.edges, config.edges);

    updateProjectById(id, {
      projectConfig: {
        ...config,
        nodes: nodesConfig,
        edges: edgesConfig,
      },
      schemaData,
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
          <SchemaEditor schemaGraph={schemaGraph} schemaData={schemaData} onSave={onSave} config={config} />
        </Drawer>
      </CollapseCard>
    </div>
  );
};

export default DataSchema;
