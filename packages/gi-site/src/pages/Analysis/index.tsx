import GISDK, { GIAssets } from '@alipay/graphinsight';
import { original } from 'immer';
import localforage from 'localforage';
import React from 'react';
import { useImmer } from 'use-immer';
import { Navbar, Sidebar } from '../../components';
import Loading from '../../components/Loading';
import { getSearchParams } from '../../components/utils';
import { setDefaultAssetPackages } from '../../loader';
import { getProjectById } from '../../services/';
import { queryAssets } from '../../services/assets.market';
import { navbarOptions } from './Constants';
import { getComponentsByAssets, getElementsByAssets, getServicesByConfig } from './getAssets';
import getCombinedServiceConfig from './getAssets/getCombinedServiceConfig';
import getLayoutsByAssets from './getAssets/getLayoutsByAssets';
import getMockServiceConfig from './getAssets/getMockServiceConfig';
import { AnalysisContext } from './hooks/useContext';
import './index.less';
import MetaPanel from './MetaPanel';
import { ConfigRecommedor } from './recommendTools';
import UploadPanel from './uploadData/index';
import type { StateType } from './useModal';
import { initialState } from './useModal';
import { isObjectEmpty } from './utils';

// 配置不同的驱动优先级
localforage.config({
  driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
  name: 'GI-WebServer',
  version: 2.0,
  description: 'GraphInsight Local Server',
  storeName: 'project',
});

setDefaultAssetPackages();

const queryActiveAssetsInformation = ({ assets, data, config, serviceConfig, schemaData }) => {
  const components = getComponentsByAssets(assets.components, data, serviceConfig, config, schemaData);
  const elements = getElementsByAssets(assets.elements, data, schemaData);
  const layouts = getLayoutsByAssets(assets.layouts, data);

  return {
    components,
    elements,
    layouts,
  };
};

let startTime = Date.now();
let endTime = Date.now();
const Analysis = props => {
  const { match } = props;
  const { projectId } = match.params;

  const [state, updateState] = useImmer<StateType>(initialState);
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
    isUploadModalVisible,
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
      const { data, config, activeAssetsKeys, serviceConfig, schemaData } = await getProjectById(projectId);
      const { transData, inputData } = data;

      updateState(draft => {
        draft.id = projectId; //项目ID
        draft.config = config; //项目配置
        draft.projectConfig = config; //项目原始配置（从服务器中来的）
        draft.data = transData; //画布数据
        draft.schemaData = schemaData; //图数据的Schema
        draft.inputData = inputData; //用户上传的数据（可展示在「数据」模块）
        draft.activeNavbar = activeNavbar; //当前激活的导航
        draft.serviceConfig = serviceConfig; //服务配置
        draft.activeAssetsKeys = activeAssetsKeys; //用户选择的资产ID
      });
      return;
    })();
    // 当项目ID变化，或者强制重新刷新的时候运行
  }, [projectId, key]);

  React.useEffect(() => {
    if (!activeAssetsKeys) {
      //初始化阶段
      return;
    }
    /** 根据活跃资产Key值，动态加载资产实例 */
    queryAssets(projectId, activeAssetsKeys).then(
      //@ts-ignore
      (activeAssets: GIAssets) => {
        const mockServiceConfig = getMockServiceConfig(activeAssets.components);

        updateState(draft => {
          /** 将组件资产中的的 MockServices 与项目自自定义的 Services 去重处理 */
          const combinedServiceConfig = getCombinedServiceConfig(mockServiceConfig, original(draft.serviceConfig));
          const activeAssetsInformation = queryActiveAssetsInformation({
            assets: activeAssets,
            data,
            config,
            serviceConfig: combinedServiceConfig,
            schemaData: original(draft.schemaData),
          });

          const configComponents = activeAssetsInformation.components.map(c => {
            const defaultValues = c.props;
            const cfgComponents = draft.config.components.find(d => d.id === c.id);
            let matchItem = c;
            if (cfgComponents) {
              matchItem = original(cfgComponents);
            }
            return {
              ...matchItem,
              props: {
                /** 将config.components 中的值与 assets.components 中的值进行合并 */
                ...defaultValues,
                ...matchItem.props,
              },
            };
          });
          /** 根据服务配置列表，得到真正运行的Service实例 */
          const services = getServicesByConfig(combinedServiceConfig, data);
          draft.isReady = true; //项目加载完毕
          draft.serviceConfig = combinedServiceConfig; //更新项目服务配置
          draft.services = services; //更新服务
          draft.config.components = configComponents; //更新 config.components
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
  endTime = Date.now();
  console.log('%c GRAPHINSIGHT SITE', 'color:red', state, 'isReady', isReady, endTime - startTime, endTime);

  const handleClose = () => {
    updateState(draft => {
      draft.isUploadModalVisible = false;
    });
  };

  if (isLoading) {
    return (
      <div className="gi">
        <Loading />
      </div>
    );
  }
  const context = { context: state, updateContext: updateState };
  console.log('%c GRAPHINSIGHT SITE', 'color:lightgreen', state.config, isObjectEmpty(config), !isReady, isLoading);

  return (
    <AnalysisContext.Provider value={context}>
      <div className="gi">
        <div className="gi-navbar">
          <Navbar projectId={projectId} enableAI={enableAI} />
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
              components={activeAssetsInformation.components}
              elements={activeAssetsInformation.elements}
              services={state.services}
              layouts={activeAssetsInformation.layouts}
            />
          </div>
          <div className="gi-analysis-workspace">
            <div className="gi-analysis-canvas">
              <GISDK
                config={config}
                /** 资产以Props的方式按需引入 */
                assets={{
                  components: activeAssets.components,
                  elements: activeAssets.elements,
                  layouts: activeAssets.layouts,
                }}
                services={state.services}
              ></GISDK>
            </div>
          </div>
        </div>
        {isUploadModalVisible && (
          <UploadPanel visible={isUploadModalVisible} handleClose={handleClose} initData={data}></UploadPanel>
        )}
      </div>
    </AnalysisContext.Provider>
  );
};

export default Analysis;
