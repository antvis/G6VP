import * as React from 'react';
import { getSearchParams } from '../../components/utils';
import * as DatasetServices from '../../services/dataset';
import * as ProjectServices from '../../services/project';
import DatasetTable from './Table';

import { utils } from '@antv/gi-sdk';
import { getConfigByEngineId } from '../Workspace/utils';

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
  return (
    <div>
      <DatasetTable data={lists} />
    </div>
  );
};

export default SystemDirectConnect;
