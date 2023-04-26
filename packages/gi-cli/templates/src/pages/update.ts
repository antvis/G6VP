import type { GIConfig } from '@antv/gi-sdk';
import Server from '../services/index';
const ENGINE_ID = Server.id;
const update = (GI_PROJECT_CONFIG: GIConfig) => {
  GI_PROJECT_CONFIG.components.push({
    id: 'Counter',
    type: 'AUTO',
    props: {},
  });
  GI_PROJECT_CONFIG.components.forEach(item => {
    if (item.id === 'Initializer') {
      //改写服务的ID
      item.props.serviceId = `${ENGINE_ID}/GI_SERVICE_INTIAL_GRAPH`;
      item.props.schemaServiceId = `${ENGINE_ID}/GI_SERVICE_SCHEMA`;
    }
  });

  console.log('update', GI_PROJECT_CONFIG);
  return GI_PROJECT_CONFIG;
};
export default update;
