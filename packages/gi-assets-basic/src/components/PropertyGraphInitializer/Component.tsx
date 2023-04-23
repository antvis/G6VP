import { useContext, utils } from '@antv/gi-sdk';
import * as React from 'react';

export interface IProps {}

const PropertyGraphInitializer: React.FunctionComponent<IProps> = props => {
  const context = useContext();
  const { data, schemaData, updateContext } = context;

  React.useEffect(() => {
    if (!context.propertyGraphData) {
      const propertyGraphData = utils.graphData2PropertyGraph(data, schemaData);
      updateContext(draft => {
        draft.propertyGraphData = propertyGraphData;
      });
    }
  }, [data]);

  return null;
};

export default PropertyGraphInitializer;
