import { useMemo } from 'react';
import { createUuid } from '../process/common';
let updateHistoryTimer: number;
const useConstant = (id, state, updateState) => {
  const stopForceSimulation = () => {
    // if (graphinRef.current) {
    //   const { layout, graph } = graphinRef.current;
    //   const { instance } = layout;
    //   if (instance) {
    //     const { type, simulation } = instance;
    //     if (type === 'graphin-force') {
    //       simulation.stop();
    //       return;
    //     }
    //   }
    //   const layoutController = graph.get('layoutController');
    //   const layoutMethod = layoutController.layoutMethods?.[0];
    //   if (layoutMethod?.type === 'force2') {
    //     layoutMethod.stop();
    //   }
    // }
  };
  const restartForceSimulation = (nodes = []) => {
    // if (graphinRef.current) {
    //   const { layout: graphLayout, graph } = graphinRef.current;
    //   const { instance } = graphLayout;
    //   if (instance) {
    //     const { type, simulation } = instance;
    //     if (type === 'graphin-force') {
    //       simulation.restart(nodes, graph);
    //       return;
    //     }
    //   }
    //   const layoutController = graph.get('layoutController');
    //   const layoutMethod = layoutController.layoutMethods?.[0];
    //   if (layoutMethod?.type === 'force2') {
    //     graph.updateLayout({ animate: true, disableTriggerLayout: false });
    //     updateState(draft => {
    //       draft.layout.animate = true;
    //     });
    //   }
    // }
  };
  const sourceDataMap = useMemo(() => {
    const nodes = state.source.nodes.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});

    const edges = state.source.edges.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});

    return {
      nodes,
      edges,
    };
  }, [state.source]);
  const transform = d => {
    console.warn('transform 函数已经废弃，请使用 update config 的方式');
    return d;
  };
  const updateData = res => {
    updateState(draft => {
      const newData = res;
      draft.data = newData;
      draft.source = newData;
      draft.layoutCache = false;
    });
  };
  const updateLayout = res => {
    updateState(draft => {
      draft.config.layout = res;
      draft.layoutCache = false;
    });
  };
  const updateDataAndLayout = (res, lay) => {
    updateState(draft => {
      const newData = res;
      draft.data = newData;
      draft.source = newData;
      draft.config.layout = lay;
      draft.layoutCache = false;
    });
  };
  // 更新历史记录
  const updateHistory = param => {
    const time = new Date().getTime();
    const fn = () => {
      updateState(draft => {
        // @ts-ignore
        draft.history = (draft.history || []).concat([
          {
            id: createUuid(),
            timestamp: time,
            ...param,
          },
        ]);
      });
    };
    // 防止频繁更新导致的重复 updateHistory
    // 同时，间隔一定时间再更新到历史栈中，保证画布数据已经更新完成
    if (updateHistoryTimer) window.clearTimeout(updateHistoryTimer);
    updateHistoryTimer = window.setTimeout(fn, 500);
  };
  /** get gisdk id */
  const GISDK_ID = useMemo(() => {
    if (!id) {
      const defaultId = `${Math.random().toString(36).substr(2)}`;
      console.warn(`⚠️: props.id 缺失，默认生成 GISDK_ID : ${defaultId} 用于多实例管理`);
      return defaultId;
    }
    return id;
  }, []);

  return {
    stopForceSimulation,
    restartForceSimulation,
    sourceDataMap,
    transform,
    updateData,
    updateDataAndLayout,
    updateHistory,
    updateLayout,
    GISDK_ID,
  };
};
export default useConstant;
