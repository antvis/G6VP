import type { GISiteParams } from '@antv/gi-sdk';
import { utils } from '@antv/gi-sdk';
import { notification } from 'antd';
import { updateProjectById } from '../../services/';
import { getComponentsByAssets, getElementsByAssets } from './getAssets';
import getLayoutsByAssets from './getAssets/getLayoutsByAssets';
const { generatorSchemaByGraphData, generatorStyleConfigBySchema } = utils;
export { generatorSchemaByGraphData, generatorStyleConfigBySchema };

export const isObjectEmpty = obj => {
  return Object.keys(obj).length === 0;
};
export const queryActiveAssetsInformation = ({ assets, data, config, serviceConfig, schemaData, engineId }) => {
  const components = getComponentsByAssets(assets.components, data, serviceConfig, config, schemaData, engineId);
  const elements = getElementsByAssets(assets.elements, data, schemaData);
  const layouts = getLayoutsByAssets(assets.layouts, data, schemaData);
  return {
    components,
    elements,
    layouts,
  };
};

/** 更新站点的 SCHEMA 和 DATA */
export const getUpdateGISite =
  ({ config, projectId }) =>
  (params: GISiteParams) => {
    if (!params) {
      return false;
    }
    let { data, schemaData, tag, activeAssetsKeys, engineId, engineContext } = params;

    if (!schemaData || !engineId) {
      notification.error({
        message: '服务引擎启动失败',
        description: '没有查询到图模型，请检查接口是否正常',
      });
      return false;
    }
    const style = utils.generatorStyleConfigBySchema(schemaData);
    const updateParams = {
      engineId,
      engineContext,
      schemaData,
      projectConfig: { ...config, ...style },
    };
    if (activeAssetsKeys) {
      updateParams['activeAssetsKeys'] = activeAssetsKeys;
    }
    if (data) {
      updateParams['data'] = data;
    }

    updateProjectById(projectId, updateParams).then(res => {
      notification.success({
        message: '服务引擎启动成功',
        description: '服务引擎启动成功，1秒后将重启窗口',
      });

      localStorage.setItem(
        'SERVER_ENGINE_CONTEXT',
        JSON.stringify({
          GI_SITE_PROJECT_ID: projectId,
          engineId: engineId,
          ...engineContext,
        }),
      );
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  };
