import * as React from 'react';
import { getSearchParams } from '../../components/utils';
import { addProject } from '../../services';
import { createDataset } from '../../services/dataset';
import DatasetTable from './Table';

import { utils } from '@antv/gi-sdk';
import { getConfigByEngineId } from '../Workspace/utils';

const SystemDirectConnect: React.FunctionComponent = props => {
  const autoConnect = async () => {
    try {
      const { searchParams } = getSearchParams(window.location);
      const datasetInfoString = searchParams.get('datasetInfo');
      console.log('datasetInfoString', datasetInfoString);
      if (datasetInfoString) {
        const datasetInfo = JSON.parse(decodeURIComponent(datasetInfoString));
        const { id, name, schemaData, engineId, engineContext } = datasetInfo;
        const style = utils.generatorStyleConfigBySchema(schemaData);
        const { config, activeAssetsKeys } = getConfigByEngineId(engineId);
        const projectId = await addProject({
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
        await createDataset({
          id,
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
    autoConnect();
  }, []);
  return (
    <div>
      <DatasetTable data={[]} />
    </div>
  );
};

export default SystemDirectConnect;
