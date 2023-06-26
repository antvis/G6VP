import { BarsOutlined, CodeOutlined } from '@ant-design/icons';
import * as React from 'react';

import SegmentedTabs from '../../components/SegmentedTabs';
import { getSearchParams } from '../../components/utils';
import * as DatasetServices from '../../services/dataset';
import * as ProjectServices from '../../services/project';
import * as TemplateService from '../../services/template';
import { queryDatasetList } from '../../services/dataset';
import DatasetTable from './Table';

import { utils } from '@antv/gi-sdk';
import { getConfigByEngineId } from '../Workspace/utils';
import $i18n from '../../i18n';
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
      if (datasetInfoString) {
        const datasetInfo = JSON.parse(decodeURIComponent(datasetInfoString));
        const { id, name, schemaData, engineId, engineContext, templateId } = datasetInfo;
        const templates = [...(await TemplateService.listInner()), ...(await TemplateService.list())];
        const template = templates.find(item => item.id === templateId) || {};
        const style = utils.generatorStyleConfigBySchema(schemaData);
        const { config, activeAssetsKeys } = getConfigByEngineId(engineId, JSON.parse(JSON.stringify(template)));
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
      setState({
        lists: res,
      });
    })();
  }, []);
  const { lists } = state;
  const INFO = (
    <div style={{ padding: '12px' }}>
      <p>
        {$i18n.get({
          id: 'gi-site.pages.Dataset.SystemDirectConnect.AnySystemCanUseThe',
          dm: '任何系统，都可以通过 URL 携带参数，访问 AntV Insight ，实现数据集的自动创建，从而实现系统间的「一键连接」分析。',
        })}
      </p>
      <h4>
        {$i18n.get({
          id: 'gi-site.pages.Dataset.SystemDirectConnect.StepBuildInfoInformation',
          dm: 'STEP 1 : 构建 info 信息',
        })}
      </h4>
      <pre style={styles.code}>
        {$i18n.get({
          id: 'gi-site.pages.Dataset.SystemDirectConnect.ConstInfoEncodeuricomponentJsonStringify',
          dm: '\n    const info = encodeURIComponent(\n      JSON.stringify({\n        id: \'以 "ds_" 为前缀的数据集 ID \',\n        name: \'数据集名称\',\n        engineId:"数据引擎ID",\n        engineContext: "数据引擎上下文",\n        schemaData: "数据模型（图数据需要）",\n        workbook:"GI_WORKBOOK",// 选择用「关系图画布」还是「地理画布」\n      }),\n    ); ',
        })}
      </pre>
      <h4>
        {$i18n.get({
          id: 'gi-site.pages.Dataset.SystemDirectConnect.StepBringInfoInformationTo',
          dm: 'STEP 2 : 将 info 信息以 URL 的方式带入到 AntV Insight 站点',
        })}
      </h4>
      <pre style={styles.code}>{`   
    window.open('graphinsight.antgroup.com/#/dataset/SYSTEM_DIRECT_CONNECT?datasetInfo=info');
      `}</pre>
    </div>
  );

  const refreshDataset = () => {
    (async () => {
      const res = await queryDatasetList('system');
      setState({
        lists: res,
      });
    })();
  };

  return (
    <SegmentedTabs
      items={[
        {
          key: 'list',
          icon: <BarsOutlined />,
          label: $i18n.get({ id: 'gi-site.pages.Dataset.SystemDirectConnect.DataList', dm: '数据列表' }),
          children: <DatasetTable data={lists} queryData={refreshDataset} />,
        },
        {
          key: 'code',
          icon: <CodeOutlined />,
          label: $i18n.get({ id: 'gi-site.pages.Dataset.SystemDirectConnect.DockingInstructions', dm: '对接说明' }),
          children: INFO,
        },
      ]}
    ></SegmentedTabs>

    // <div style={{ height: 'calc(100vh - 100px)', background: 'var(--background-color)' }}>

    // </div>
  );
};

export default SystemDirectConnect;
