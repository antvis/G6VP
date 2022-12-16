import GISDK, { useContext as useGIContext, utils } from '@antv/gi-sdk';
import { original } from 'immer';
import React, { useRef } from 'react';
import { Navbar, Sidebar } from '../../components';
import Loading from '../../components/Loading';
import { getSearchParams } from '../../components/utils';
import { getProjectById } from '../../services/';
import { queryAssets } from '../../services/assets';
import { IProject } from '../../services/typing';
import { navbarOptions } from './Constants';
import { getServicesByConfig } from './getAssets';
import getCombinedServiceConfig from './getAssets/getCombinedServiceConfig';
import { AnalysisContext } from './hooks/useContext';
import './index.less';
import MetaPanel from './MetaPanel';

import useModel from './useModel';
import { getUpdateGISite, isObjectEmpty, queryActiveAssetsInformation } from './utils';

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
      const { data, config, activeAssetsKeys, schemaData, engineId, engineContext, themes, name } =
        (await getProjectById(projectId)) as IProject;

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

      updateState(draft => {
        draft.engineId = engineId; // 项目绑定的引擎ID
        draft.engineContext = engineContext; //项目绑定的引擎上下文
        draft.id = projectId; //项目ID
        draft.name = name; // 项目绑定的引擎ID
        draft.config = config!; //项目配置
        // draft.projectConfig = config!; //项目原始配置（从服务器中来的）
        draft.data = transData; //画布数据
        draft.schemaData = schemaData; //图数据的Schema
        draft.inputData = inputData; //用户上传的数据（可展示在「数据」模块）
        draft.activeNavbar = activeNavbar; //当前激活的导航
        draft.activeAssetsKeys = activeAssetsKeys; //用户选择的资产ID
        draft.themes = themes; //主题
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
            //@ts-ignore
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

  /** 更新站点的 SCHEMA 和 DATA */
  const updateGISite = getUpdateGISite({ config, projectId });

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
