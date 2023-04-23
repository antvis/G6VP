import { IGIAC, extra } from '@antv/gi-sdk';
import * as React from 'react';
import useRedoUndo from '../hooks/useRedoUndo';
const { GIAComponent } = extra;
export interface Redo {
  GIAC: IGIAC;
}

const Redo: React.FunctionComponent<Redo> = props => {
  const { GIAC } = props;
  const { redo, redoStack } = useRedoUndo();
  return <GIAComponent GIAC={{ ...GIAC, disabled: redoStack.length === 0 }} onClick={redo} />;
};

export default Redo;
