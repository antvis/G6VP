import Graphin, { Utils } from '@antv/graphin';
import React from 'react';

export interface Props {
  /**
   * @description 配置信息
   */
  config: any;
}
const GISDK = props => {
  const { config } = props;
  const data = Utils.mock(10)
    .circle()
    .graphin();
  console.log('config', config);
  return (
    <div>
      <Graphin data={data}></Graphin>
    </div>
  );
};

export default GISDK;
