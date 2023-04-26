import type { IGIAC } from '@antv/gi-sdk';
import { extra } from '@antv/gi-sdk';
import * as React from 'react';
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
  GIAC.title = visible ? '切换至2D' : '切换至3D';
  return (
    <>
      <GIAComponent
        //@ts-ignore
        GIAC={GIAC}
        onClick={() => {
          setVisible(true);
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

export default LargeGraph;
