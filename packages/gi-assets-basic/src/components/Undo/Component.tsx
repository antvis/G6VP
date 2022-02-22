import { extra } from '@alipay/graphinsight';
import { IGIAC } from '@alipay/graphinsight/lib/components/const';
import * as React from 'react';
import useRedoUndo from '../hooks/useRedoUndo';
const { GIAComponent } = extra;
export interface Undo {
  GIAC: IGIAC;
}

const Undo: React.FunctionComponent<Undo> = props => {
  const { GIAC } = props;
  const { handleUndo, disableUndo } = useRedoUndo();
  return <GIAComponent GIAC={{ ...GIAC, disabled: disableUndo }} onClick={handleUndo} />;
};

export default Undo;
