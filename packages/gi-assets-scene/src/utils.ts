import { GIConfig, utils } from '@alipay/graphinsight';

export const getToolbarStyleByConfig = (config: GIConfig) => {
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
  const positionStyles = utils.getPositionStyles(placement, offset);

  return {
    direction: direction,
    positionStyles,
  };
};
