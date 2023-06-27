import { extra, GIConfig, IGIAC } from '@antv/gi-sdk';
import * as React from 'react';
import Toolbar from '../../CommonCmponents/Toolbar';
import { getToolbarStyleByConfig } from '../../utils';
import $i18n from '../../i18n';
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
    metas.title = $i18n.get({ id: 'scene.MapMode.Toolbar.CircleSelection', dm: '圈选' });
    metas.tooltipPlacement = 'right';
    return metas;
  }, [GIAC]);
  const Switch_GIAC = React.useMemo(() => {
    const metas = deepClone(GIAC);
    metas.icon = 'icon-location';
    metas.title = $i18n.get({ id: 'scene.MapMode.Toolbar.ReturnToNetgraphMode', dm: '返回网图模式' });
    metas.tooltipPlacement = 'right';
    return metas;
  }, [GIAC]);
  const Toggle_GIAC = React.useMemo(() => {
    const metas = deepClone(GIAC);
    metas.icon = 'icon-fullscreen';
    metas.title = $i18n.get({ id: 'scene.MapMode.Toolbar.SmallWindow', dm: '小窗' });
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
