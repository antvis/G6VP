import { extra, GIConfig, IGIAC } from '@antv/gi-sdk';
import * as React from 'react';
import Toolbar from '../../CommonCmponents/Toolbar';
import { getToolbarStyleByConfig } from '../../utils';
const { GIAComponent, deepClone } = extra;
interface ToolbarContainerProps {
  config: GIConfig;
  GIAC: IGIAC;
  handleToggleMap: () => void;
  handleSwitchMap: () => void;
  handleBrush: () => void;
}

const ToolbarContainer: React.FunctionComponent<ToolbarContainerProps> = props => {
  const { GIAC, config, handleBrush, handleSwitchMap, handleToggleMap } = props;

  const Brush_GIAC = React.useMemo(() => {
    const metas = deepClone(GIAC);
    metas.icon = 'icon-highlight';
    metas.title = '圈选';
    metas.tooltipPlacement = 'right';
    return metas;
  }, [GIAC]);
  const Switch_GIAC = React.useMemo(() => {
    const metas = deepClone(GIAC);
    metas.icon = 'icon-location';
    metas.title = '返回网图模式';
    metas.tooltipPlacement = 'right';
    return metas;
  }, [GIAC]);
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
        <GIAComponent GIAC={Switch_GIAC} onClick={handleSwitchMap} />
        <GIAComponent GIAC={Toggle_GIAC} onClick={handleToggleMap} />
        <GIAComponent GIAC={Brush_GIAC} onClick={handleBrush} />
      </Toolbar>
    </div>
  );
};

export default ToolbarContainer;
