import { IGIAC, extra } from '@antv/gi-sdk';
import * as React from 'react';
import useRedoUndo from '../hooks/useRedoUndo';
const { GIAComponent } = extra;
export interface Undo {
  GIAC: IGIAC;
}

const Undo: React.FunctionComponent<Undo> = props => {
  const { GIAC } = props;
  const { undo, undoStack } = useRedoUndo();
  return <GIAComponent GIAC={{ ...GIAC, disabled: undoStack.length < 3 }} onClick={undo} />;
};

export default Undo;
