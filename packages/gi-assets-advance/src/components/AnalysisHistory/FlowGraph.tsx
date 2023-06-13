import { useMemoizedFn } from 'ahooks';
import G6, { IGraph } from '@antv/g6';
import React, { CSSProperties, useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';
import { TemplateData, TemplateNode } from './type';
import { createFlowGraph, createTooltip } from './util';
import { registerNodes } from './flowNodeRegistry';
import './flowNodeRegistry';
import './index.less';

const { Tooltip } = G6;

export interface FlowGraphProps {
  // Graph 容器的 CSS 样式
  style?: CSSProperties;
  // 模版图数据
  graphData?: TemplateData;
  // 是否为应用模版时的配置态
  isConfigure?: boolean;
  // 各历史记录的 screenshot map
  urlMap: { [key: string]: string };
  // 正在运行的节点 id
  runningId?: string;
  // 发生错误的节点列表，包括节点 id 和错误信息
  errorInfos?: { id: string; msg: string }[];
  // 运行完成的节点 id 数组
  successIds?: string[];
  // 正在被配置的节点
  configuring?: TemplateNode;
  // 设置正在被配置的节点（节点点击时设置）
  setConfiguring: (model: TemplateNode | undefined) => void;
}

/**
 * 模版图
 * @param props
 * @returns
 */
const FlowGraph: React.FC<FlowGraphProps> = props => {
  const graphRef: any = useRef<HTMLDivElement>();
  const {
    runningId,
    errorInfos,
    successIds,
    graphData,
    urlMap,
    configuring,
    style = {},
    isConfigure = false,
    setConfiguring,
  } = props;
  const [state, updateState] = useImmer({
    // 图的提示插件实例
    tooltip: undefined as typeof Tooltip | undefined,
    // 图实例
    graph: null as IGraph | null,
  });

  const { tooltip, graph } = state;

  useEffect(() => {
    registerNodes();
  }, []);

  /**
   * 数据变化时，初始化图实例，或更换图数据
   */
  useEffect(() => {
    if (!graphData) return;
    const clonedData = JSON.parse(JSON.stringify(graphData));
    if (graph) {
      graph.changeData(clonedData);
      return;
    }
    const container = graphRef.current as HTMLElement;
    const graphTooltip = createTooltip(urlMap);
    const newGraph = createFlowGraph(container, graphTooltip, isConfigure);
    newGraph.on('node:click', handleNodeClick);
    newGraph.on('canvas:click', cancelConfiguring);
    newGraph.read(clonedData);
    updateState(draft => {
      draft.graph = newGraph;
      draft.tooltip = graphTooltip;
    });
  }, [graphData]);

  /**
   * 截图 map 发生变化时，更新 tooltip 内容
   */
  useEffect(() => {
    if (graph) {
      graph.removePlugin(tooltip as any);
      const graphTooltip = createTooltip();
      graph.addPlugin(graphTooltip);
    }
  }, [urlMap]);

  /**
   * 正在运行的节点发生变化，恢复/设置节点的运行状态
   */
  useEffect(() => {
    if (!graph) return;
    graph.findAllByState('node', 'running').forEach(node => graph.setItemState(node, 'running', false));
    if (runningId && graph.findById(runningId)) graph.setItemState(runningId, 'running', true);
  }, [runningId]);

  /**
   * 发生错误的节点列表发生变化，恢复/设置节点的错误状态
   */
  useEffect(() => {
    if (!graph) return;
    graph.findAllByState('node', 'error').forEach(node => graph.setItemState(node, 'error', false));
    errorInfos?.forEach(info => {
      const item = graph.findById(info.id);
      if (!item || item.destroyed) return;
      graph.updateItem(info.id, { errorMsg: info.msg });
      graph.setItemState(info.id, 'error', true);
    });
  }, [errorInfos]);

  /**
   * 运行成功的节点列表发生变化，恢复/设置节点的成功状态
   */
  useEffect(() => {
    if (!graph) return;
    if (!successIds?.length) {
      // 若数组为空，清空所有的节点成功状态
      graph.findAllByState('node', 'success').forEach(node => graph.setItemState(node, 'success', false));
    }
    setTimeout(() => {
      // 间隔一段时间再设置状态，保证节点运行状态的动画被看到
      successIds?.forEach(id => {
        const item = graph.findById(id);
        if (item) {
          graph.setItemState(item, 'running', false);
          if (!item.hasState('success')) graph.setItemState(item, 'success', true);
        }
      });
    }, 1000);
  }, [successIds]);

  /**
   * 节点的点击监听，激活被点击节点的设置中状态
   */
  const handleNodeClick = useMemoizedFn(evt => {
    if (!graph) return;
    const model = evt.item.getModel();
    // 起点和终点节点不可设置
    if (model.id === 'start' || model.id === 'end') return;
    if (configuring?.id !== model.id) {
      if (configuring) {
        // 重置前一个处于“设置中”状态的节点
        const item = graph.findById(configuring.id);
        if (item && !item.destroyed) graph.setItemState(item, 'configuring', false);
      }
      graph.setItemState(model.id, 'configuring', true);
      setConfiguring(JSON.parse(JSON.stringify(model)));
    }
  });

  /**
   * 画布的点击监听，取消被设置中节点的状态
   */
  const cancelConfiguring = useMemoizedFn(() => {
    if (!graph) return;
    if (configuring) {
      const item = graph.findById(configuring.id);
      if (item) item.setState('configuring', false);
    }
    setConfiguring(undefined);
  });

  return <div className="gi-history-modal-graph" ref={graphRef as any} style={style} />;
};

export default FlowGraph;
