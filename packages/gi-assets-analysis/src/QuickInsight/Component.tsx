import { QuickAnalysis } from '@alipay/aa-embed';
import { extra, useContext } from '@alipay/graphinsight';
import type { GIAComponentProps } from '@alipay/graphinsight/lib/components/GIAC';
import * as React from 'react';
const { GIAComponent } = extra;
export interface MapModeProps {
  GIAC: GIAComponentProps['GIAC'];
  visible?: boolean;
  /** 主题  */
  queryFieldName: string[];
  aggregateMethod: string[];
}

const MapMode: React.FunctionComponent<MapModeProps> = props => {
  const GIAC = { ...props.GIAC };
  const { visible: defaultVisible, queryFieldName = [], aggregateMethod = [] } = props;
  const [visible, setVisible] = React.useState(defaultVisible);
  const { data } = useContext();
  const insightData = data.nodes.map(n => n.data);

  const measures = queryFieldName.map((c, index) => {
    return {
      queryFieldName: c,
      //@ts-ignore
      aggregateMethod: aggregateMethod[index] || aggregateMethod[0] || 'SUM',
    };
  });
  console.log('data', insightData, 'measure', measures);

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
        <QuickAnalysis
          data={insightData}
          //@ts-ignore
          measures={
            // []
            measures
          }
          visible={visible}
          onChangeVisible={setVisible}
        />
      )}
    </div>
  );
};

export default MapMode;
