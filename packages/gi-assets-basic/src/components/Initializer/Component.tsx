import { GIConfig, registerContext, useContext, utils } from '@antv/gi-sdk';
import { notification } from 'antd';
import React, { memo } from 'react';
import $i18n from '../../i18n';
const { isPosition, isStyles } = utils;

export type GIService = any;
export interface IProps {
  serviceId: string;
  schemaServiceId: string;
  aggregate: boolean;
  transByFieldMapping: boolean;
}

const transform = data => {
  const { combos } = data;
  const nodes = data.nodes.map(item => {
    const { id, data } = item;
    return {
      id: id,
      data: data,
    };
  });

  const edges = data.edges.map((item, index) => {
    const { source, target, id, data } = item;
    return {
      id: id || `edge-${index}`,
      source,
      target,
      data,
    };
  });

  // console.log('TransformGraphinData edges ', edges, nodes);

  return {
    nodes,
    edges,
    combos,
  };
};

const initializerStore = {
  largeGraphLimit: 600,
  isLoading: true,
  layoutCache: false,
  source: { nodes: [], edges: [] },
  data: { nodes: [], edges: [] },
  largeGraphMode: false,
  largeGraphData: { nodes: [], edges: [] },
};
registerContext(initializerStore);

const Initializer: React.FunctionComponent<IProps> = props => {
  const { context, services, updateContext } = useContext<typeof initializerStore>();
  const { serviceId, schemaServiceId, aggregate, transByFieldMapping } = props;

  const { largeGraphLimit } = context;

  React.useEffect(() => {
    let initialService = services.find(s => s.id === serviceId) as GIService;
    let schemaService = services.find(s => s.id === schemaServiceId) as GIService;

    if (!initialService) {
      notification.error({
        message: $i18n.get({ id: 'basic.components.Initializer.Component.CanvasRenderingFailed', dm: '画布渲染失败' }),
        description: $i18n.get(
          {
            id: 'basic.components.Initializer.Component.TheServiceidServiceIsMissing',
            dm: '缺少 {serviceId} 服务，请检查相关资产是否加载成功',
          },
          { serviceId: serviceId },
        ),
      });
      initialService = {
        service: () => {
          return new Promise(resolve => {
            resolve({
              nodes: [],
              edges: [],
            });
          });
        },
      };
    }
    if (!schemaService) {
      notification.error({
        message: $i18n.get({
          id: 'basic.components.Initializer.Component.FailedToObtainGraphModel',
          dm: '图模型获取失败',
        }),
        description: $i18n.get(
          {
            id: 'basic.components.Initializer.Component.TheServiceidServiceIsMissing',
            dm: '缺少 {serviceId} 服务，请检查相关资产是否加载成功',
          },
          { serviceId: serviceId },
        ),
      });
      schemaService = {
        service: () => {
          return new Promise(resolve => {
            resolve({
              nodes: [],
              edges: [],
            });
          });
        },
      };
    }
    Promise.all([schemaService.service(), initialService.service()]).then(
      ([schemaData, graphData = { nodes: [], edges: [] }]) => {
        let schema = schemaData;
        let data = graphData;
        if (transByFieldMapping) {
          const { schemaData: _schemaData, data: _data } = utils.transDataBySchemaMeta(graphData, schemaData);
          schema = _schemaData;
          data = _data;
        }
        const { nodes } = data;

        if (nodes.length > largeGraphLimit) {
          notification.warn({
            message: $i18n.get({
              id: 'basic.components.Initializer.Component.TheAmountOfDataLoaded',
              dm: '加载的数据量过大',
            }),
            description: $i18n.get({
              id: 'basic.components.Initializer.Component.WeRecommendThatYouAggregate',
              dm: '建议聚合数据，默认切换到网格布局。您也可以在「资产中心」中加载「大图组件」启用 3D 渲染',
            }),
          });
        }
        updateContext(draft => {
          /** 判断是否保存样式和位置 */
          const position = isPosition(nodes);
          const style = isStyles(nodes);
          /** 取消布局缓存 */
          draft.initialized = true;
          draft.layoutCache = false;

          /** 如果接口有 schema，就更新 schemaData */
          if (schema) {
            draft.schemaData = schema as any;
          }
          /** 只有当 config 中没有 nodes 和 edges 的时候，才会用 schema 生成一个默认样式 */

          if (schema && (draft.nodes?.length === 0 || draft.edges?.length === 0)) {
            const schemaStyle = utils.generatorStyleConfigBySchema(schema) as GIConfig;
            draft.nodes = schemaStyle.nodes;
            draft.edges = schemaStyle.edges;
          }
          /** 如果有布局信息 */
          if (position) {
            //@ts-ignore
            draft.layout.type = 'preset';
          }
          /** 如果有样式数据 */
          if (style) {
            draft.data = data;
            draft.source = data;
            draft.isLoading = false;
            return;
          }
          /** 如果是大图模式 */
          if (nodes.length > largeGraphLimit) {
            const newData = data;
            draft.largeGraphMode = true;
            draft.largeGraphData = newData;
            draft.source = newData;
            draft.data = {
              nodes: [],
              edges: [],
            };
            draft.isLoading = false;
            return;
          }
          /** 如果是聚合模式 */
          if (aggregate) {
            const newData = data;
            draft.source = newData;
            draft.largeGraphMode = false;
            //@ts-ignore
            draft.largeGraphData = undefined;
            draft.data = utils.aggregateEdges(data);
            draft.isLoading = false;
            return;
          }
          /** 默认是普通模式 */
          const newData = transform(data);

          draft.data = newData;
          draft.source = newData;
          draft.largeGraphMode = false;
          //@ts-ignore
          draft.largeGraphData = undefined;
          draft.isLoading = false;
        });
      },
    );
  }, [largeGraphLimit, aggregate, transByFieldMapping]);

  return null;
};

export default memo(Initializer);
