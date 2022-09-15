import type { GISiteParams } from '@alipay/graphinsight';
import GISDK, { useContext as useGIContext, utils } from '@alipay/graphinsight';
import { notification } from 'antd';
import { original } from 'immer';
import React, { useRef } from 'react';
import { Navbar, Sidebar } from '../../components';
import Loading from '../../components/Loading';
import { getSearchParams } from '../../components/utils';
import { setDefaultAssetPackages } from '../../loader';
import { getProjectById, updateProjectById } from '../../services/';
import { queryAssets } from '../../services/assets.market';
import { findEngineInstanceList } from '../../services/engineInstace';
import { IProject } from '../../services/typing';
import { navbarOptions } from './Constants';
import { getComponentsByAssets, getElementsByAssets, getServicesByConfig } from './getAssets';
import getCombinedServiceConfig from './getAssets/getCombinedServiceConfig';
import getLayoutsByAssets from './getAssets/getLayoutsByAssets';
import { AnalysisContext } from './hooks/useContext';
import './index.less';
import MetaPanel from './MetaPanel';
import { ConfigRecommedor } from './recommendTools';
import useModel from './useModel';
import { isObjectEmpty } from './utils';

setDefaultAssetPackages();

const queryActiveAssetsInformation = ({ assets, data, config, serviceConfig, schemaData, engineId }) => {
  const components = getComponentsByAssets(assets.components, data, serviceConfig, config, schemaData, engineId);
  const elements = getElementsByAssets(assets.elements, data, schemaData);
  const layouts = getLayoutsByAssets(assets.layouts, data, schemaData);

  return {
    components,
    elements,
    layouts,
  };
};

const GraphRef = props => {
  const { graphRef } = props;
  const { graph } = useGIContext();
  graphRef.current = graph;
  return null;
};
const Analysis = props => {
  const { match } = props;
  const { projectId } = match.params;
  const graphRef = useRef(null);

  const [state, updateState] = useModel();

  const {
    config,
    key,
    isReady,
    isSave,
    activeNavbar,
    collapse,
    data,
    assets,
    enableAI,
    projectConfig,
    activeAssetsInformation,
    activeAssetsKeys,
    activeAssets,
    engineId,
  } = state;

  const handleChangeNavbar = opt => {
    const isSame = activeNavbar === opt.id;
    updateState(draft => {
      draft.activeNavbar = opt.id;
      draft.collapse = isSame ? !collapse : false;
    });
  };

  React.useLayoutEffect(() => {
    (async () => {
      updateState(draft => {
        draft.isReady = false;
      });
      /** 从地址栏上选择默认展示的tab */
      const { searchParams } = getSearchParams(window.location);
      const activeNavbar = searchParams.get('nav') || 'data';
      /** 根据 projectId 获取项目的信息  */
      const {
        data,
        config,
        activeAssetsKeys,
        serviceConfig,
        schemaData,
        engineId,
        engineContext,
      } = (await getProjectById(projectId)) as IProject;

      localStorage.setItem('GI_ACTIVE_PROJECT_ID', projectId);
      const SERVER_ENGINE_CONTEXT_STRING = localStorage.getItem('SERVER_ENGINE_CONTEXT') || '{}';
      const SERVER_ENGINE_CONTEXT = JSON.parse(SERVER_ENGINE_CONTEXT_STRING);
      const { GI_SITE_PROJECT_ID } = SERVER_ENGINE_CONTEXT;
      if (GI_SITE_PROJECT_ID !== projectId) {
        localStorage.setItem(
          'SERVER_ENGINE_CONTEXT',
          JSON.stringify({
            engineId: engineId,
            GI_SITE_PROJECT_ID: projectId,
            ...engineContext,
          }),
        );
      }

      const { transData, inputData } = data;

      // 根据 projectId，查询引擎实例信息
      const engineInfoResult = await findEngineInstanceList(projectId);
      let engineInfos = [];
      if (engineInfoResult.success && engineInfoResult.data.length > 0) {
        engineInfos = engineInfoResult.data;
        // 默认最新的实例
        localStorage.setItem('graphScopeGraphName', engineInfos[0].activeGraphName);
        localStorage.setItem('activeEngineInfo', JSON.stringify(engineInfos[0]));
      }

      updateState(draft => {
        draft.engineId = engineId; // 项目绑定的引擎ID
        draft.engineContext = engineContext; //项目绑定的引擎上下文
        draft.id = projectId; //项目ID
        draft.config = config!; //项目配置
        draft.projectConfig = config!; //项目原始配置（从服务器中来的）
        draft.data = transData; //画布数据
        draft.schemaData = schemaData; //图数据的Schema
        draft.inputData = inputData; //用户上传的数据（可展示在「数据」模块）
        draft.activeNavbar = activeNavbar; //当前激活的导航
        draft.serviceConfig = serviceConfig; //自定义服务配置
        draft.activeAssetsKeys = activeAssetsKeys; //用户选择的资产ID
        draft.engineInfos = engineInfos;
        draft.activeEngineInfo = engineInfos[0];
      });
    })();
    // 当项目ID变化，或者强制重新刷新的时候运行
  }, [projectId, key]);

  React.useEffect(() => {
    if (!activeAssetsKeys) {
      //初始化阶段
      return;
    }
    /** 根据活跃资产Key值，动态加载资产实例 */
    queryAssets(activeAssetsKeys).then(
      //@ts-ignore
      activeAssets => {
        const mockServiceConfig = []; //getMockServiceConfig(activeAssets.components);
        const assetServices = utils.getCombineServices(activeAssets.services!);

        updateState(draft => {
          /** 将组件资产中的的 MockServices 与项目自自定义的 Services 去重处理 */
          const combinedServiceConfig = getCombinedServiceConfig(mockServiceConfig, original(draft.serviceConfig));
          const schemaData = original(draft.schemaData);

          const activeAssetsInformation = queryActiveAssetsInformation({
            engineId,
            assets: activeAssets,
            data,
            config,
            serviceConfig: [...assetServices, ...combinedServiceConfig],
            schemaData,
          });

          const configComponents = activeAssetsInformation.components.map(c => {
            const defaultValues = c.props;
            //@ts-ignore
            const cfgComponents = draft.config.components.find(d => d.id === c.id);
            let matchItem = c as any;
            if (cfgComponents) {
              matchItem = original(cfgComponents);
            }

            /** 将config.components 中的值与 assets.components 中的值进行合并 */
            const resProps = utils.mergeObjectByRule(
              (_acc, curr) => {
                return typeof curr === 'string' && curr.startsWith(engineId);
              },
              defaultValues,
              matchItem.props,
            );

            return {
              // ...matchItem,
              id: matchItem.id,
              name: matchItem.name,
              props: resProps,
            };
          });

          const { id: layoutId, props: layoutProps } = draft.config.layout!;
          // FIXBUG: 数据中layout为 ClusteringDagre，但资产没有保存成功
          const defaultLayout =
            activeAssetsInformation.layouts[layoutId] || activeAssetsInformation.layouts['GraphinForce'];
          const layoutConfig = {
            id: layoutId,
            props: {
              ...defaultLayout.props,
              ...layoutProps,
            },
          };

          /** 根据服务配置列表，得到真正运行的Service实例 */

          const services = utils.uniqueElementsBy(
            [...getServicesByConfig(combinedServiceConfig, data, schemaData), ...assetServices],
            (a, b) => {
              return a.id === b.id;
            },
          );
          draft.isReady = true; //项目加载完毕
          draft.serviceConfig = combinedServiceConfig; //更新项目服务配置
          draft.services = services; //更新服务
          draft.config.components = configComponents; //更新 config.components
          draft.config.layout = layoutConfig; //更新 config.layout
          draft.activeAssets = activeAssets; //更新活跃资产
          draft.activeAssetsKeys = activeAssetsKeys; //更新活跃资产ID
          draft.activeAssetsInformation = activeAssetsInformation;
        });
      },
    );
  }, [activeAssetsKeys]);

  const getRecommenderCfg = params => {
    const { config, data } = params;
    const Recommender = new ConfigRecommedor(data);
    const layoutCfg = Recommender.recLayoutCfg();
    const nodeCfg = Recommender.recNodeCfg();
    const edgeCfg = Recommender.recEdgeCfg();
    const newGraphData = Recommender.graphData;
    // console.log('newGraphData', newGraphData)
    const newConfig = {
      ...config,
      node: {
        ...config.node,
        props: {
          ...config.node.props,
          ...nodeCfg,
        },
      },
      edge: {
        ...config.edge,
        props: {
          ...config.edge.props,
          ...edgeCfg,
        },
      },
      layout: {
        ...config.layout,
        props: {
          ...config.layout.props,
          ...layoutCfg,
        },
      },
    };
    return {
      newConfig: newConfig,
      newData: newGraphData,
    };
  };

  /** 更新站点的 SCHEMA 和 DATA */
  const updateGISite = (params: GISiteParams) => {
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

  // React.useLayoutEffect(() => {
  //   const { config, projectConfig, data } = state;

  //   if (isReady && data && enableAI) {
  //     const { newData, newConfig } = getRecommenderCfg({
  //       data: JSON.parse(JSON.stringify(data)),
  //       config,
  //     });
  //     updateState(draft => {
  //       draft.id = projectId;
  //       draft.config = newConfig;
  //       draft.data = newData; // 改变 data 是为了能把衍生出的属性加进去，比如 degree
  //     });
  //   } else if (!enableAI) {
  //     updateState(draft => {
  //       draft.id = projectId;
  //       draft.config = projectConfig;
  //     });
  //   }
  // }, [projectId, isReady, enableAI]);

  const isLoading = isObjectEmpty(config) || !isReady;

  if (isLoading) {
    return (
      <div className="gi">
        <Loading />
      </div>
    );
  }
  const context = { context: state, updateContext: updateState, updateGISite };

  console.log('%c GRAPHINSIGHT SITE', 'color:lightgreen', state, context);

  return (
    <AnalysisContext.Provider value={context}>
      <div className="gi">
        <div className="gi-navbar">
          <Navbar projectId={projectId} enableAI={enableAI} graphRef={graphRef} />
        </div>
        <div className="gi-analysis">
          <div className="gi-analysis-sidebar">
            <Sidebar options={navbarOptions} value={activeNavbar} onChange={handleChangeNavbar} />
          </div>
          <div className={`gi-analysis-conf ${collapse ? 'collapse' : ''}`}>
            <MetaPanel
              value={activeNavbar}
              data={data}
              activeAssetsKeys={activeAssetsKeys}
              /** 配置文件 */
              config={config}
              components={activeAssetsInformation!.components}
              elements={activeAssetsInformation!.elements}
              services={state.services}
              layouts={activeAssetsInformation!.layouts}
            />
          </div>
          <div className="gi-analysis-workspace">
            <div className="gi-analysis-canvas">
              <GISDK
                id="gi-site"
                config={config}
                /** 资产以Props的方式按需引入 */
                assets={{
                  components: activeAssets!.components,
                  elements: activeAssets!.elements,
                  layouts: activeAssets!.layouts,
                }}
                services={state.services}
              >
                <GraphRef graphRef={graphRef} />
              </GISDK>
            </div>
          </div>
        </div>
      </div>
    </AnalysisContext.Provider>
  );
};

export default Analysis;
