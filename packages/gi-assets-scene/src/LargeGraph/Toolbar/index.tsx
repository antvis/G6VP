import { extra, GIConfig } from '@alipay/graphinsight';
import { IGIAC } from '@alipay/graphinsight/lib/components/const';
import * as React from 'react';
import Toolbar from '../../CommonCmponents/Toolbar/index';
import { getToolbarStyleByConfig } from '../../utils';
const { GIAComponent, deepClone } = extra;
interface ToolbarContainerProps {
  config: GIConfig;
  GIAC: IGIAC;
  handleToggleMap: () => void;
  handleSwitchMap: () => void;
}

const ToolbarContainer: React.FunctionComponent<ToolbarContainerProps> = props => {
  const { GIAC, config, handleSwitchMap, handleToggleMap } = props;

  const Toggle_GIAC = React.useMemo(() => {
    const metas = deepClone(GIAC);
    metas.icon = 'icon-fullscreen';
    metas.title = '小窗';
    metas.tooltipPlacement = 'right';
    return metas;
  }, [GIAC]);

  const { direction, positionStyles } = getToolbarStyleByConfig(config);

  return (
    <div>
      <Toolbar direction={direction} style={positionStyles}>
        <GIAComponent GIAC={GIAC} onClick={handleSwitchMap} />
        <GIAComponent GIAC={Toggle_GIAC} onClick={handleToggleMap} />
      </Toolbar>
    </div>
  );
};

export default ToolbarContainer;
