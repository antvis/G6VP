import { registerContext, useContext } from '@antv/gi-sdk';
import React, { memo } from 'react';

export interface IProps {}
const partialStore = {
  propertyGraphData: {
    nodes: [],
    edges: [],
  },
};
registerContext(partialStore);

const PropertyGraphInitializer: React.FunctionComponent<IProps> = props => {
  const { context, updateContext } = useContext<typeof partialStore>();
  const { data, schemaData } = context;

  // React.useEffect(() => {
  //   //@ts-ignore
  //   const propertyGraphData = utils.graphData2PropertyGraph(data, schemaData);
  //   updateContext(draft => {
  //     draft.propertyGraphData = propertyGraphData;
  //   });
  // }, [data]);

  return null;
};

export default memo(PropertyGraphInitializer);
