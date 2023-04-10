import { GraphinContext, Graph, GraphData, IG6GraphEvent } from '@antv/graphin';
import React from 'react';
import { Stack } from '@antv/algorithm';
export interface Redo {
  visible: boolean;
  color: string;
  hasDivider: boolean;
}
//修复异常数据
const fixNodePosition = (graph: Graph, graphData: GraphData): GraphData => {
  const currentData = graph.save() as any;
  const nodeMap: any = {};
  currentData.nodes?.forEach((n: any) => {
    nodeMap[n.id] = n;
  });
  const nodes = graphData.nodes?.map((n: any) => {
    if (typeof n.x !== 'number' || typeof n.y !== 'number') {
      const node = nodeMap[n.id];
      if (node) {
        return {
          ...n,
          x: node.x,
          y: node.y,
        };
      } else {
        return {
          ...n,
          x: 0,
          y: 0,
        };
      }
    }
    return n;
  });
  return {
    ...graphData,
    nodes,
  };
};
const useRedoUndo = (): {
  redo: () => void;
  undo: () => void;
  undoStack: Stack;
  redoStack: Stack;
} => {
  const { graph } = React.useContext(GraphinContext);
  const [stackInfo, setStackInfo] = React.useState(() => {
    return {
      undoStack: graph.getUndoStack(),
      redoStack: graph.getRedoStack(),
    };
  });
  const redo = () => {
    const redoStack = graph.getRedoStack();

    if (!redoStack || redoStack.length === 0) {
      return;
    }

    const currentData = redoStack.pop();
    if (currentData) {
      const { action } = currentData;
      let data = currentData.data.after;
      graph.pushStack(action, {
        ...currentData.data,
        after: fixNodePosition(graph, currentData.data.after),
        before: fixNodePosition(graph, currentData.data.before),
      });
      if (action === 'delete') {
        data = currentData.data.before;
      }
      update(action, data);
    }
  };
  const undo = () => {
    const undoStack = graph.getUndoStack();

    if (!undoStack || undoStack.length === 1) {
      return;
    }

    const currentData = undoStack.pop();
    if (currentData) {
      const { action } = currentData;
      graph.pushStack(
        action,
        {
          ...currentData.data,
          after: fixNodePosition(graph, currentData.data.after),
          before: fixNodePosition(graph, currentData.data.before),
        },
        'redo',
      );
      let data = currentData.data.before;

      if (action === 'add') {
        data = currentData.data.after;
      }
      update(action, data);
    }
  };
  const update = (action: string, data: GraphData) => {
    if (!data) return;

    switch (action) {
      case 'visible': {
        Object.keys(data).forEach(key => {
          const array = data[key];
          if (!array) return;
          array.forEach((model: any) => {
            const item = graph.findById(model.id);
            if (!item) {
              return;
            }
            if (model.visible) {
              graph.showItem(item, false);
            } else {
              graph.hideItem(item, false);
            }
          });
        });
        break;
      }
      case 'render':
      case 'update':
        const nodeMap = graph.getNodes().reduce((map: any, node: any) => {
          map[node.getID()] = node;
          return map;
        }, {});
        Object.keys(data).forEach(key => {
          const array = data[key];
          if (!array) return;
          array.forEach((model: any) => {
            if (nodeMap[model.id]) {
              graph.updateItem(model.id, model, false);
            }
          });
        });
        break;
      case 'changedata':
        graph.changeData(data, false);
        break;
      case 'delete': {
        Object.keys(data).forEach(key => {
          const array = data[key];
          if (!array) return;
          array.forEach((model: any) => {
            const itemType = model.itemType;
            delete model.itemType;
            graph.addItem(itemType, model, false);
          });
        });
        break;
      }
      case 'add':
        Object.keys(data).forEach(key => {
          const array = data[key];
          if (!array) return;
          array.forEach((model: any) => {
            graph.removeItem(model.id, false);
          });
        });
        break;
      case 'updateComboTree':
        const comboMap: any = {};
        graph.getCombos().forEach(combo => {
          comboMap[combo.getID()] = combo;
        });
        Object.keys(data).forEach(key => {
          const array = data[key];
          if (!array) return;
          array.forEach((model: any) => {
            if (!comboMap[model.id] || (model.parentId && !comboMap[model.parentId])) {
              return;
            }
            graph.updateComboTree(model.id, model.parentId, false);
          });
        });
        break;
      default:
    }
  };

  React.useEffect(() => {
    const handleStackChanage = (evt: IG6GraphEvent) => {
      const { undoStack, redoStack } = evt as any;
      setStackInfo({
        undoStack,
        redoStack,
      });
    };
    graph.on('stackchange', handleStackChanage);
    return () => {
      graph.off('stackchange', handleStackChanage);
    };
  }, [graph]);
  //@ts-ignore
  return {
    redo,
    undo,
    ...stackInfo,
  };
};

export default useRedoUndo;
