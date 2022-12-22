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
  ({ config, projectId, activeAssetsKeys }) =>
  (params: GISiteParams) => {
    if (!params) {
      return false;
    }
    let { data, schemaData, tag, engineId, engineContext, projectConfig: ENGINE_PROJECT_CONFIG } = params;

    if (!schemaData || !engineId) {
      notification.error({
        message: '服务引擎启动失败',
        description: '没有查询到图模型，请检查接口是否正常',
      });
      return false;
    }
    const style = utils.generatorStyleConfigBySchema(schemaData);
    const preContext = JSON.parse(localStorage.getItem('SERVER_ENGINE_CONTEXT') || '{}');
    let projectConfig;

    const IS_INITIAL_STYLE = config.nodes?.length === 1 && config.edges?.length === 1;
    if (preContext.engineId === engineId && !IS_INITIAL_STYLE) {
      projectConfig = {
        ...ENGINE_PROJECT_CONFIG, //引擎设置的拥有最低优先级
        ...style, // GI默认生成的节点和边的样式
        ...config, // 默认的GI配置
      };
    } else {
      projectConfig = {
        ...config, // 默认的GI配置
        ...style, // GI默认生成的节点和边的样式
        ...ENGINE_PROJECT_CONFIG, //引擎设置的拥有最高优先级
      };
    }

    const updateParams = {
      engineId,
      engineContext,
      schemaData,
      projectConfig,
    };

    updateParams['activeAssetsKeys'] = {
      ...activeAssetsKeys,
      components: projectConfig.components.map(item => item.id),
    };
    if (data) {
      updateParams['data'] = data;
    }

    updateProjectById(projectId, updateParams).then(res => {
      notification.success({
        message: '服务引擎启动成功',
        description: '服务引擎启动成功,正在重启窗口',
      });
      utils.setServerEngineContext({
        GI_SITE_PROJECT_ID: projectId,
        engineId: engineId,
      });
      setTimeout(() => {
        window.location.reload();
      }, 200);
    });
  };
