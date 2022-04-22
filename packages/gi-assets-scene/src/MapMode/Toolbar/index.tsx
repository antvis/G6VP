import { extra, GIConfig, utils } from '@alipay/graphinsight';
import { IGIAC } from '@alipay/graphinsight/lib/components/const';
import * as React from 'react';
import Toolbar from './Component';
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

  //@ts-ignore
  const toolbarCfg = (config.components.find(c => c.id === 'Toolbar') || {
    id: 'Toolbar',
    props: {
      direction: 'horizontal',
      placement: 'LT',
      offset: [10, 10],
    },
  }) as {
    id: string;
    props: {
      direction?: 'horizontal' | 'vertical';
      placement: string;
      offset: number[];
    };
  };
  const { direction, placement, offset } = toolbarCfg.props;

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

  const positionStyles = utils.getPositionStyles(placement, offset);

  console.log(Brush_GIAC, Switch_GIAC, Toggle_GIAC);

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
