import { extra } from '@alipay/graphinsight';
import type { GIAComponentProps } from '@alipay/graphinsight/lib/components/GIAC';
import * as React from 'react';
import ForceGraph from './ForceGraph';
const { GIAComponent } = extra;
export interface MapModeProps {
  GIAC: GIAComponentProps['GIAC'];
  visible?: boolean;
  /** 主题  */
  theme: string;
  /** 地图类型 */
  type: string;
}

const LargeGraph: React.FunctionComponent<MapModeProps> = props => {
  const GIAC = { ...props.GIAC };
  const { visible: defaultVisible, theme, type } = props;
  const [visible, setVisible] = React.useState(defaultVisible);
  GIAC.title = visible ? '切换至2D' : '切换至3D';

  return (
    <div>
      <GIAComponent
        //@ts-ignore
        GIAC={GIAC}
        onClick={() => {
          setVisible(true);
        }}
      />
      {visible && (
        <ForceGraph
          // theme={theme}
          // type={type}
          //@ts-ignore
          GIAC={GIAC}
          handleClick={() => {
            setVisible(false);
          }}
        />
      )}
    </div>
  );
};

export default LargeGraph;
