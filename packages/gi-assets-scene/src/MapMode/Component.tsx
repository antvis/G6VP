import { extra } from '@alipay/graphinsight';
import type { GIAComponentProps } from '@alipay/graphinsight/lib/components/GIAC';
import * as React from 'react';
import L7Map from './L7Map';
const { GIAComponent } = extra;
export interface MapModeProps {
  GIAC: GIAComponentProps['GIAC'];
  visible?: boolean;
  /** 主题  */
  theme: string;
  /** 地图类型 */
  type: string;
  minSize: string;
  maxSize: string;
  placement: 'LT' | 'RT' | 'LB' | 'RB';
  offset: number[];
}

const MapMode: React.FunctionComponent<MapModeProps> = props => {
  const GIAC = { ...props.GIAC };
  const { visible: defaultVisible, theme, type, minSize, maxSize, placement, offset } = props;
  const [visible, setVisible] = React.useState(defaultVisible);
  GIAC.title = visible ? '切换至网图' : '切换至地图';

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
        <L7Map
          minSize={minSize}
          maxSize={maxSize}
          placement={placement}
          offset={offset}
          theme={theme}
          type={type}
          GIAC={GIAC}
          handleClick={() => {
            setVisible(false);
          }}
        />
      )}
    </div>
  );
};

export default MapMode;
