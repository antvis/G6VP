import { useContext, utils } from '@antv/gi-sdk';
import React, { memo } from 'react';

export interface IProps {}

const PropertyGraphInitializer: React.FunctionComponent<IProps> = props => {
  const context = useContext();
  const { data, schemaData, updateContext } = context;

  // React.useEffect(() => {
  //   const propertyGraphData = utils.graphData2PropertyGraph(data, schemaData);
  //   updateContext(draft => {
  //     draft.propertyGraphData = propertyGraphData;
  //   });
  // }, [data]);

  return null;
};

export default memo(PropertyGraphInitializer);
