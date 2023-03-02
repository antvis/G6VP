import { BarsOutlined, CodeOutlined } from '@ant-design/icons';
import * as React from 'react';

import SegmentedTabs from '../../components/SegmentedTabs';
import { getSearchParams } from '../../components/utils';
import * as DatasetServices from '../../services/dataset';
import * as ProjectServices from '../../services/project';
import DatasetTable from './Table';

import { utils } from '@antv/gi-sdk';
import { getConfigByEngineId } from '../Workspace/utils';
const styles = {
  code: {
    background: '#000',
    color: '#fff',
  },
};
const SystemDirectConnect: React.FunctionComponent = props => {
  const [state, setState] = React.useState({
    lists: [],
  });
  const autoConnect = async () => {
    try {
      const { searchParams } = getSearchParams(window.location);
      const datasetInfoString = searchParams.get('datasetInfo');
      console.log('datasetInfoString', datasetInfoString);
      if (datasetInfoString) {
        const datasetInfo = JSON.parse(decodeURIComponent(datasetInfoString));
        const { id, name, schemaData, engineId, engineContext, owner } = datasetInfo;
        const style = utils.generatorStyleConfigBySchema(schemaData);
        const { config, activeAssetsKeys } = getConfigByEngineId(engineId);
        const projectId = await ProjectServices.create({
          datasetId: id,
          name,
          status: 1, // 1 正常项目， 0 删除项目
          tag: '',
          members: '',
          projectConfig: {
            ...config,
            ...style,
          },
          activeAssetsKeys,
          type: 'project',
        });
        await DatasetServices.createDataset({
          id,
          engineType: 'DB_GRAPH',
          type: 'system',
          from: 'GraphScope',
          name,
          schemaData,
          engineId,
          engineContext,
        });
        window.location.href = `${window.location.origin}/#/workspace/${projectId}`;
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    (async () => {
      await autoConnect();
      const res = await DatasetServices.systemDirectConnectList();
      console.log('res', res);
      setState({
        lists: res,
      });
    })();
  }, []);
  const { lists } = state;
  const INFO = (
    <div style={{ padding: '12px' }}>
      <p>
        任何系统，都可以通过 URL 携带参数，访问 AntV Insight ，实现数据集的自动创建，从而实现系统间的「一键连接」分析。
      </p>
      <h4> STEP 1 : 构建 info 信息</h4>
      <pre style={styles.code}>
        {`
    const info = encodeURIComponent(
      JSON.stringify({
        id: '以 "ds_" 为前缀的数据集 ID ',
        name: '数据集名称',
        engineId:"数据引擎ID",
        engineContext: "数据引擎上下文",
        schemaData: "数据模型（图数据需要）",
        workbook:"GI_WORKBOOK",// 选择用「关系图画布」还是「地理画布」
      }),
    ); `}
      </pre>
      <h4>STEP 2 : 将 info 信息以 URL 的方式带入到 AntV Insight 站点</h4>
      <pre style={styles.code}>{`   
    window.open('graphinsight.antgroup.com/#/dataset/SYSTEM_DIRECT_CONNECT?datasetInfo=info');
      `}</pre>
    </div>
  );
  return (
    <SegmentedTabs
      items={[
        {
          key: 'list',
          icon: <BarsOutlined />,
          label: '数据列表',
          children: <DatasetTable data={lists} />,
        },
        {
          key: 'code',
          icon: <CodeOutlined />,
          label: '对接说明',
          children: INFO,
        },
      ]}
    ></SegmentedTabs>

    // <div style={{ height: 'calc(100vh - 100px)', background: 'var(--background-color)' }}>

    // </div>
  );
};

export default SystemDirectConnect;
