import { Stack } from '@antv/algorithm';
export interface Redo {
  visible: boolean;
  color: string;
  hasDivider: boolean;
}

const useRedoUndo = (): {
  redo: () => void;
  undo: () => void;
  undoStack: Stack;
  redoStack: Stack;
} => {
  const redo = () => {};
  const undo = () => {};

  //@ts-ignore
  return {
    undoStack: [],
    redoStack: [],
    redo,
    undo,
  } as any;
};

export default useRedoUndo;
