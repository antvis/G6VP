import type { GIConfig } from '@antv/gi-sdk';

const update = (GI_PROJECT_CONFIG: GIConfig) => {
  GI_PROJECT_CONFIG.components.push({
    id: 'Counter',
    props: {},
  });
  console.log('update', GI_PROJECT_CONFIG);
  return GI_PROJECT_CONFIG;
};
export default update;
