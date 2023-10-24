import type { IGIAC } from '@antv/gi-sdk';
import { extra } from '@antv/gi-sdk';
import React, { memo } from 'react';
import $i18n from '../i18n';
import ForceGraph from './ForceGraph';
const { GIAComponent } = extra;

export interface MapModeProps {
  GIAC: IGIAC;
  visible?: boolean;
  type: string;
  minSize: string;
  maxSize: string;
  placement: 'LT' | 'RT' | 'LB' | 'RB';
  offset: number[];
  highlightColor: string;
  backgroundColor: string;
}

const LargeGraph: React.FunctionComponent<MapModeProps> = props => {
  const GIAC = { ...props.GIAC };
  const { visible: defaultVisible, maxSize, minSize, placement, offset, highlightColor, backgroundColor } = props;
  const [visible, setVisible] = React.useState(defaultVisible);
  GIAC.title = visible
    ? $i18n.get({ id: 'scene.src.LargeGraph.Component.SwitchToD', dm: '切换至2D' })
    : $i18n.get({ id: 'scene.src.LargeGraph.Component.SwitchToD.1', dm: '切换至3D' });
  return (
    <>
      <GIAComponent
        //@ts-ignore
        GIAC={GIAC}
        onClick={() => {
          setVisible(!visible);
        }}
      />

      {visible && (
        <ForceGraph
          backgroundColor={backgroundColor}
          highlightColor={highlightColor}
          minSize={minSize}
          maxSize={maxSize}
          placement={placement}
          offset={offset}
          GIAC={GIAC}
          handleClick={() => {
            setVisible(false);
          }}
        />
      )}
    </>
  );
};

export default memo(LargeGraph);
