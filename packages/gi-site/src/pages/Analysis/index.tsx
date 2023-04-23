import GISDK, { useContext as useGIContext, utils } from '@antv/gi-sdk';
import { message } from 'antd';
import { original } from 'immer';
import React, { useRef, useState } from 'react';
import { Sidebar } from '../../components';
import Loading from '../../components/Loading';
import Navbar from '../../components/Navbar/WorkbookNav';
import { getSearchParams } from '../../components/utils';
import { queryAssets } from '../../services/assets';
import { queryDatasetInfo } from '../../services/dataset';
import * as ProjectServices from '../../services/project';
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
  const [panelWidth, setPanelWidth] = useState(false);

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
      const activeNavbar = searchParams.get('nav') || 'style';

      /** 根据 projectId 获取项目的信息  */
      const { config, activeAssetsKeys, themes, name, datasetId } = (await ProjectServices.getById(
        projectId,
      )) as IProject;

      if (!activeAssetsKeys.components.includes('PropertyGraphInitializer'))
        activeAssetsKeys.components.push('PropertyGraphInitializer');

      const datasetInfo = await queryDatasetInfo(datasetId);
      if (!datasetInfo) {
        window.location.href = window.location.origin;
        message.info('请先选择数据集...');
        return;
      }
      let { engineId, engineContext, schemaData, data, name: DATASET_NAME } = datasetInfo;

      localStorage.setItem(
        'SERVER_ENGINE_CONTEXT',
        JSON.stringify({
          GI_SITE_PROJECT_ID: projectId,
          ...engineContext,
        }),
      );

      const { transData, inputData } = data || {
        transData: { nodes: [], edges: [] },
        inputData: [{ nodes: [], edges: [] }],
      };

      window['LOCAL_DATA_FOR_GI_ENGINE'] = {
        data: transData,
        schemaData,
      };

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
        draft.datasetId = datasetInfo.id;
        draft.datasetName = datasetInfo.name;
        draft.engineType = datasetInfo.engineType;
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
              type: matchItem.type || c.type,
              name: matchItem.name || c.name,
              props: resProps,
            };
          });

          const { id: layoutId, props: layoutProps } = draft.config.layout!;
          // FIXBUG: 数据中layout为 ClusteringDagre，但资产没有保存成功
          const defaultLayout = activeAssetsInformation.layouts[layoutId] || activeAssetsInformation.layouts['Force2'];
          const layoutConfig = {
            id: layoutId,
            props: {
              ...defaultLayout.props,
              ...layoutProps,
              preset: {
                ...(defaultLayout.props.preset || {}),
                ...(layoutProps.preset || {}),
              },
            },
          };

          /** 根据服务配置列表，得到真正运行的Service实例 */

          const services = utils.uniqueElementsBy(
            [...getServicesByConfig(combinedServiceConfig, data, schemaData), ...assetServices],
            (a, b) => {
              return a.id === b.id;
            },
          );

          const pageLayoutComponent = configComponents.find(component => component.type === 'GICC_LAYOUT');
          if (config && !config.pageLayout && pageLayoutComponent) {
            draft.config.pageLayout = pageLayoutComponent;
          } else if (pageLayoutComponent && config.pageLayout?.id === pageLayoutComponent.id) {
            // 旧版工作簿中未记录 pageLayout，从 components 中恢复信息
            const { name, type } = pageLayoutComponent;
            draft.config.pageLayout = {
              ...draft.config.pageLayout,
              name,
              type,
            };
            draft.config.pageLayout.props = draft.config.pageLayout.props || { containers: [] };
            pageLayoutComponent.props?.containers.forEach(container => {
              const cacheContainer = draft.config.pageLayout?.props.containers?.find(con => con.id === container.id);
              if (cacheContainer) {
                const idx = draft.config.pageLayout?.props.containers.indexOf(cacheContainer);
                draft.config.pageLayout.props.containers[idx] = {
                  ...container,
                  ...cacheContainer,
                };
              } else {
                draft.config.pageLayout.props.containers.push(container);
              }
            });
          }

          draft.isReady = true; //项目加载完毕
          draft.serviceConfig = combinedServiceConfig; //更新项目服务配置
          draft.services = services; //更新服务
          draft.config.components = configComponents; //更新 config.components
          draft.config.layout = layoutConfig; //更新 config.layout
          draft.activeAssets = activeAssets; //更新活跃资产
          draft.activeAssetsInformation = activeAssetsInformation;
        });
      },
    );
  }, [activeAssetsKeys]);

  /** 更新站点的 SCHEMA 和 DATA */
  const updateGISite = getUpdateGISite({ config, projectId, activeAssetsKeys });

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
          <Navbar workbookId={projectId} />
        </div>
        <div className="gi-analysis">
          <div className="gi-analysis-sidebar">
            <Sidebar options={navbarOptions} value={activeNavbar} onChange={handleChangeNavbar} />
          </div>
          <div
            className={`gi-analysis-conf ${collapse ? 'collapse' : ''}`}
            style={
              !collapse ? { width: panelWidth.width, flexBasis: panelWidth.width, minWidth: panelWidth.minWidth } : {}
            }
          >
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
              setPanelWidth={setPanelWidth}
              collapse={collapse}
            />
          </div>
          <div
            className="gi-analysis-workspace"
            style={
              !collapse
                ? {
                    width: `calc(100% - ${panelWidth.width} - 36px)`,
                    flexBasis: `calc(100% - ${panelWidth.width} - 36px)`,
                  }
                : {}
            }
          >
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
